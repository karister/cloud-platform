package com.example.cloudplatformcomm;

import android.app.Activity;
import android.content.ContentValues;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.LinkAddress;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.HttpURLConnection;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

/**
 * Keeps all ESP32-CAM LAN traffic out of the HTTPS WebView. The JavaScript side
 * only receives small JSON events and a same-origin stream URL; JPEG bytes and
 * MJPEG frames never cross the bridge.
 */
final class CameraBridge {
    static final String EVENT_NAME = "esp32-camera-event";
    static final String ASSET_HOST = "appassets.androidplatform.net";
    static final int DISCOVERY_PORT = 4210;
    static final int LEGACY_SAVE_PHOTO_REQUEST = 1003;
    private static final int REQUEST_TIMEOUT_MS = 5000;
    private static final int SCAN_TIMEOUT_MS = 1500;
    private static final int MAX_CAPTURE_BYTES = 8 * 1024 * 1024;

    private final Activity activity;
    private final WebView webView;
    private final ConnectivityManager connectivityManager;
    private final ExecutorService requestExecutor = Executors.newCachedThreadPool();
    private final ExecutorService scanExecutor = Executors.newFixedThreadPool(16);
    private final Map<String, CameraSession> sessions = new ConcurrentHashMap<>();
    private volatile Network lastNetwork;
    private volatile PendingLegacyPhoto pendingLegacyPhoto;

    private static final class CameraSession {
        final String id;
        final Set<String> verifiedBases = ConcurrentHashMap.newKeySet();
        final Set<HttpURLConnection> connections = ConcurrentHashMap.newKeySet();
        final Set<Future<?>> tasks = ConcurrentHashMap.newKeySet();
        volatile boolean cancelled;
        volatile DiscoveryWorker discovery;
        volatile String streamUrl;

        CameraSession(String id) {
            this.id = id;
        }
    }

    private static final class Target {
        final String scheme;
        final String host;
        final int port;

        Target(String scheme, String host, int port) {
            this.scheme = scheme;
            this.host = host;
            this.port = port;
        }

        String base() {
            return scheme + "://" + host + (port == 80 ? "" : ":" + port);
        }

        URL url(String path) throws MalformedURLException {
            return new URL(base() + path);
        }
    }

    private static final class HttpResult {
        final int statusCode;
        final byte[] body;
        final String contentType;

        HttpResult(int statusCode, byte[] body, String contentType) {
            this.statusCode = statusCode;
            this.body = body;
            this.contentType = contentType;
        }
    }

    private static final class PendingLegacyPhoto {
        final String sessionId;
        final String requestId;
        final byte[] bytes;

        PendingLegacyPhoto(String sessionId, String requestId, byte[] bytes) {
            this.sessionId = sessionId;
            this.requestId = requestId;
            this.bytes = bytes;
        }
    }

    CameraBridge(Activity activity, WebView webView) {
        this.activity = activity;
        this.webView = webView;
        this.connectivityManager = (ConnectivityManager) activity.getSystemService(Activity.CONNECTIVITY_SERVICE);
        this.lastNetwork = connectivityManager != null ? connectivityManager.getActiveNetwork() : null;
        if (connectivityManager != null) {
            connectivityManager.registerDefaultNetworkCallback(new ConnectivityManager.NetworkCallback() {
                @Override
                public void onAvailable(Network network) {
                    handleNetworkChange(network);
                }

                @Override
                public void onLost(Network network) {
                    if (network != null && network.equals(lastNetwork)) handleNetworkChange(null);
                }
            });
        }
    }

    String request(String payload) {
        try {
            JSONObject input = new JSONObject(payload);
            String sessionId = input.optString("sessionId");
            String requestId = input.optString("requestId");
            String operation = input.optString("operation");
            if (!isSafeId(sessionId) || !isSafeId(requestId) || !isOperation(operation)) {
                sendResult(sessionId, requestId, false, null, error("INVALID_ARGUMENT", "无效的摄像头请求", 0));
                return "";
            }
            CameraSession session = sessions.computeIfAbsent(sessionId, CameraSession::new);
            submit(session, () -> handleRequest(session, requestId, operation, input));
            return requestId;
        } catch (JSONException e) {
            return "";
        }
    }

    void cancelSession(String sessionId) {
        CameraSession session = sessions.remove(sessionId);
        if (session == null) return;
        session.cancelled = true;
        if (session.discovery != null) session.discovery.stop();
        for (Future<?> task : session.tasks) task.cancel(true);
        for (HttpURLConnection connection : session.connections) connection.disconnect();
        session.connections.clear();
    }

    void cancelAll() {
        for (String sessionId : new ArrayList<>(sessions.keySet())) cancelSession(sessionId);
    }

    void close() {
        cancelAll();
        requestExecutor.shutdownNow();
        scanExecutor.shutdownNow();
    }

    void onPause() {
        // Do not leave multicast sockets or MJPEG connections alive in background.
        cancelAll();
    }

    boolean onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode != LEGACY_SAVE_PHOTO_REQUEST) return false;
        PendingLegacyPhoto pending = pendingLegacyPhoto;
        pendingLegacyPhoto = null;
        if (pending == null) return true;
        if (resultCode != Activity.RESULT_OK || data == null || data.getData() == null) {
            sendResult(pending.sessionId, pending.requestId, false, null, error("CANCELLED", "已取消保存照片", 0));
            return true;
        }
        try (OutputStream output = activity.getContentResolver().openOutputStream(data.getData())) {
            if (output == null) throw new IOException("无法打开相册目标");
            output.write(pending.bytes);
            output.flush();
            JSONObject result = new JSONObject();
            result.put("uri", data.getData().toString());
            sendResult(pending.sessionId, pending.requestId, true, result, null);
        } catch (IOException | JSONException e) {
            sendResult(pending.sessionId, pending.requestId, false, null, error("SAVE_FAILED", "保存照片失败：" + e.getMessage(), 0));
        }
        return true;
    }

    WebResourceResponse interceptStream(String path) {
        String[] pieces = path == null ? new String[0] : path.split("/");
        if (pieces.length != 4 || !"camera".equals(pieces[1]) || !"stream".equals(pieces[3])) return null;
        CameraSession session = sessions.get(pieces[2]);
        if (session == null || session.cancelled || session.streamUrl == null) return errorResponse(404, "Camera stream is unavailable");
        try {
            URL url = new URL(session.streamUrl);
            HttpURLConnection connection = openConnection(session, url, 0);
            connection.setRequestProperty("Accept", "multipart/x-mixed-replace");
            connection.setReadTimeout(0);
            int status = connection.getResponseCode();
            if (status < 200 || status >= 300) {
                connection.disconnect();
                return errorResponse(status, "Camera stream returned HTTP " + status);
            }
            session.connections.add(connection);
            String contentType = connection.getContentType();
            InputStream stream = new DisconnectingInputStream(connection.getInputStream(), session, connection);
            // WebView otherwise infers Content-Length: 0 from a live network
            // InputStream's initial available() value and closes MJPEG before frame 1.
            Map<String, String> headers = new HashMap<>();
            headers.put("Content-Type", contentType == null ? "multipart/x-mixed-replace" : contentType);
            headers.put("Transfer-Encoding", "chunked");
            headers.put("Cache-Control", "no-store");
            return new WebResourceResponse("multipart/x-mixed-replace", null, 200, "OK", headers, stream);
        } catch (IOException e) {
            return errorResponse(502, "Unable to open camera stream");
        }
    }

    private void handleRequest(CameraSession session, String requestId, String operation, JSONObject input) {
        if (session.cancelled) return;
        try {
            switch (operation) {
                case "discover":
                    startDiscovery(session);
                    JSONObject discovery = new JSONObject();
                    discovery.put("native", true);
                    sendResult(session.id, requestId, true, discovery, null);
                    break;
                case "status":
                    handleStatus(session, requestId, input);
                    break;
                case "control":
                    handleControl(session, requestId, input);
                    break;
                case "capture":
                    handleCapture(session, requestId, input);
                    break;
                case "stream":
                    handleStream(session, requestId, input);
                    break;
                default:
                    sendResult(session.id, requestId, false, null, error("UNSUPPORTED", "不支持的摄像头操作", 0));
            }
        } catch (CameraException e) {
            sendResult(session.id, requestId, false, null, error(e.code, e.getMessage(), e.statusCode));
        } catch (Exception e) {
            sendResult(session.id, requestId, false, null, error("NETWORK_ERROR", "摄像头请求失败：" + safeMessage(e), 0));
        }
    }

    private void handleStatus(CameraSession session, String requestId, JSONObject input) throws Exception {
        Target target = target(input.optString("base"));
        HttpResult result = getWithRetry(session, target.url("/status"), REQUEST_TIMEOUT_MS, MAX_CAPTURE_BYTES);
        JSONObject status = new JSONObject(new String(result.body, StandardCharsets.UTF_8));
        if (!isCameraStatus(status)) throw new CameraException("NOT_CAMERA", "目标不是 ESP32-CAM", 0);
        session.verifiedBases.add(target.base());
        JSONObject output = new JSONObject();
        output.put("status", status);
        sendResult(session.id, requestId, true, output, null);
    }

    private void handleControl(CameraSession session, String requestId, JSONObject input) throws Exception {
        Target target = verifiedTarget(session, input.optString("base"));
        String variable = input.optString("variable");
        int value = input.optInt("value", Integer.MIN_VALUE);
        if (!("framesize".equals(variable) || "quality".equals(variable) || "led_intensity".equals(variable))) {
            throw new CameraException("UNSUPPORTED", "不支持的摄像头控制项", 0);
        }
        if ("quality".equals(variable) && (value < 4 || value > 63)) {
            throw new CameraException("INVALID_ARGUMENT", "画质必须是 4–63 的整数", 0);
        }
        if ("framesize".equals(variable) && !(value == 5 || value == 8 || value == 9 || value == 10 || value == 13)) {
            throw new CameraException("INVALID_ARGUMENT", "不支持的分辨率", 0);
        }
        if ("led_intensity".equals(variable) && (value < 0 || value > 255)) {
            throw new CameraException("INVALID_ARGUMENT", "补光强度必须是 0–255", 0);
        }
        getWithRetry(session, target.url("/control?var=" + Uri.encode(variable) + "&val=" + value), REQUEST_TIMEOUT_MS, 64 * 1024);
        JSONObject output = new JSONObject();
        output.put("httpStatus", 200);
        sendResult(session.id, requestId, true, output, null);
    }

    private void handleCapture(CameraSession session, String requestId, JSONObject input) throws Exception {
        Target target = verifiedTarget(session, input.optString("base"));
        HttpResult result = getWithRetry(session, target.url("/capture"), REQUEST_TIMEOUT_MS, MAX_CAPTURE_BYTES);
        if (result.body.length < 4 || (result.body[0] & 0xff) != 0xff || (result.body[1] & 0xff) != 0xd8) {
            throw new CameraException("INVALID_RESPONSE", "摄像头没有返回 JPEG 照片", 0);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            saveWithMediaStore(session.id, requestId, result.body);
        } else {
            requestLegacySave(session.id, requestId, result.body);
        }
    }

    private void handleStream(CameraSession session, String requestId, JSONObject input) throws Exception {
        Target target = verifiedTarget(session, input.optString("base"));
        String requested = input.optString("streamUrl");
        URL streamUrl = requested.isEmpty() ? new URL("http://" + target.host + ":81/stream") : validDeviceUrl(requested, target.host);
        session.streamUrl = streamUrl.toString();
        JSONObject output = new JSONObject();
        output.put("streamUrl", "https://" + ASSET_HOST + "/camera/" + session.id + "/stream");
        sendResult(session.id, requestId, true, output, null);
    }

    private void startDiscovery(CameraSession session) throws CameraException {
        Network network = wifiNetwork();
        Inet4Address address = wifiAddress(network);
        if (network == null || address == null) throw new CameraException("NO_WIFI", "未连接可用的 Wi-Fi 网络", 0);
        if (session.discovery != null) session.discovery.stop();
        DiscoveryWorker worker = new DiscoveryWorker(session, network, address);
        session.discovery = worker;
        submit(session, worker);
    }

    private void saveWithMediaStore(String sessionId, String requestId, byte[] bytes) {
        Uri uri = null;
        try {
            ContentValues values = new ContentValues();
            values.put(MediaStore.Images.Media.DISPLAY_NAME, "ESP32-CAM-" + new SimpleDateFormat("yyyyMMdd-HHmmss", Locale.US).format(new Date()) + ".jpg");
            values.put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg");
            values.put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/ESP32-CAM");
            values.put(MediaStore.Images.Media.IS_PENDING, 1);
            uri = activity.getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
            if (uri == null) throw new IOException("无法创建相册记录");
            try (OutputStream output = activity.getContentResolver().openOutputStream(uri)) {
                if (output == null) throw new IOException("无法写入相册");
                output.write(bytes);
                output.flush();
            }
            ContentValues complete = new ContentValues();
            complete.put(MediaStore.Images.Media.IS_PENDING, 0);
            activity.getContentResolver().update(uri, complete, null, null);
            JSONObject result = new JSONObject();
            result.put("uri", uri.toString());
            sendResult(sessionId, requestId, true, result, null);
        } catch (Exception e) {
            if (uri != null) activity.getContentResolver().delete(uri, null, null);
            sendResult(sessionId, requestId, false, null, error("SAVE_FAILED", "保存照片失败：" + safeMessage(e), 0));
        }
    }

    private void requestLegacySave(String sessionId, String requestId, byte[] bytes) {
        activity.runOnUiThread(() -> {
            try {
                pendingLegacyPhoto = new PendingLegacyPhoto(sessionId, requestId, bytes);
                Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("image/jpeg");
                intent.putExtra(Intent.EXTRA_TITLE, "ESP32-CAM.jpg");
                activity.startActivityForResult(intent, LEGACY_SAVE_PHOTO_REQUEST);
            } catch (Exception e) {
                pendingLegacyPhoto = null;
                sendResult(sessionId, requestId, false, null, error("SAVE_FAILED", "无法打开照片保存窗口", 0));
            }
        });
    }

    private HttpResult getWithRetry(CameraSession session, URL url, int timeoutMs, int maxBytes) throws CameraException {
        CameraException last = null;
        for (int attempt = 0; attempt < 2; attempt += 1) {
            if (session.cancelled) throw new CameraException("CANCELLED", "摄像头会话已取消", 0);
            try {
                HttpResult result = requestOnce(session, url, timeoutMs, maxBytes);
                if (result.statusCode >= 200 && result.statusCode < 300) return result;
                last = new CameraException("HTTP_ERROR", "摄像头返回 HTTP " + result.statusCode, result.statusCode);
                if (result.statusCode < 500) throw last;
            } catch (IOException e) {
                last = new CameraException("NETWORK_ERROR", "网络请求失败：" + safeMessage(e), 0);
            }
        }
        throw last == null ? new CameraException("NETWORK_ERROR", "网络请求失败", 0) : last;
    }

    private HttpResult requestOnce(CameraSession session, URL url, int timeoutMs, int maxBytes) throws IOException, CameraException {
        HttpURLConnection connection = openConnection(session, url, timeoutMs);
        session.connections.add(connection);
        try {
            int status = connection.getResponseCode();
            InputStream input = status >= 400 ? connection.getErrorStream() : connection.getInputStream();
            return new HttpResult(status, input == null ? new byte[0] : readLimited(input, maxBytes), connection.getContentType());
        } finally {
            session.connections.remove(connection);
            connection.disconnect();
        }
    }

    private HttpURLConnection openConnection(CameraSession session, URL url, int timeoutMs) throws IOException {
        Network network = wifiNetwork();
        HttpURLConnection connection = (HttpURLConnection) (network == null ? url.openConnection() : network.openConnection(url));
        connection.setRequestMethod("GET");
        connection.setConnectTimeout(timeoutMs);
        connection.setReadTimeout(timeoutMs);
        connection.setUseCaches(false);
        connection.setRequestProperty("Connection", "close");
        return connection;
    }

    private Target target(String base) throws CameraException {
        try {
            URI uri = new URI(base);
            if (!"http".equalsIgnoreCase(uri.getScheme()) || uri.getHost() == null || !isIpv4(uri.getHost())
                    || (uri.getPath() != null && !uri.getPath().isEmpty() && !"/".equals(uri.getPath()))
                    || uri.getQuery() != null || uri.getUserInfo() != null) {
                throw new CameraException("INVALID_ADDRESS", "无效的摄像头地址", 0);
            }
            int port = uri.getPort() == -1 ? 80 : uri.getPort();
            if (port < 1 || port > 65535) throw new CameraException("INVALID_ADDRESS", "无效的摄像头端口", 0);
            return new Target("http", uri.getHost(), port);
        } catch (URISyntaxException e) {
            throw new CameraException("INVALID_ADDRESS", "无效的摄像头地址", 0);
        }
    }

    private Target verifiedTarget(CameraSession session, String base) throws CameraException {
        Target target = target(base);
        if (!session.verifiedBases.contains(target.base())) throw new CameraException("UNVERIFIED_DEVICE", "请先成功读取摄像头状态", 0);
        return target;
    }

    private URL validDeviceUrl(String raw, String expectedHost) throws CameraException {
        try {
            URL url = new URL(raw);
            if (!"http".equalsIgnoreCase(url.getProtocol()) || !expectedHost.equals(url.getHost()) || !isIpv4(url.getHost())
                    || url.getUserInfo() != null || (url.getPort() != -1 && (url.getPort() < 1 || url.getPort() > 65535))) {
                throw new CameraException("INVALID_ADDRESS", "无效的摄像头直播地址", 0);
            }
            return url;
        } catch (MalformedURLException e) {
            throw new CameraException("INVALID_ADDRESS", "无效的摄像头直播地址", 0);
        }
    }

    private Network wifiNetwork() {
        if (connectivityManager == null) return null;
        Network network = connectivityManager.getActiveNetwork();
        NetworkCapabilities capabilities = network == null ? null : connectivityManager.getNetworkCapabilities(network);
        return capabilities != null && capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) ? network : null;
    }

    private Inet4Address wifiAddress(Network network) {
        if (network == null || connectivityManager == null || connectivityManager.getLinkProperties(network) == null) return null;
        for (LinkAddress linkAddress : connectivityManager.getLinkProperties(network).getLinkAddresses()) {
            if (linkAddress.getAddress() instanceof Inet4Address && !linkAddress.getAddress().isLoopbackAddress()) {
                return (Inet4Address) linkAddress.getAddress();
            }
        }
        return null;
    }

    private void submit(CameraSession session, Runnable work) {
        Future<?> future = requestExecutor.submit(() -> {
            try {
                work.run();
            } finally {
                // Futures are also cancelled as a group; retaining a completed one is harmless but unnecessary.
            }
        });
        session.tasks.add(future);
    }

    private void handleNetworkChange(Network network) {
        if (sameNetwork(lastNetwork, network)) return;
        lastNetwork = network;
        cancelAll();
        sendEvent(new JSONObject(), "networkChanged");
    }

    private void sendResult(String sessionId, String requestId, boolean ok, JSONObject data, JSONObject error) {
        JSONObject event = new JSONObject();
        try {
            event.put("event", "result");
            event.put("sessionId", sessionId);
            event.put("requestId", requestId);
            event.put("ok", ok);
            if (data != null) event.put("data", data);
            if (error != null) event.put("error", error);
        } catch (JSONException ignored) {}
        sendEvent(event, "result");
    }

    private void sendDevice(CameraSession session, JSONObject device) {
        if (session.cancelled) return;
        JSONObject event = new JSONObject();
        try {
            event.put("event", "device");
            event.put("sessionId", session.id);
            event.put("device", device);
        } catch (JSONException ignored) {}
        sendEvent(event, "device");
    }

    private void sendScanProgress(CameraSession session, boolean scanning, int checked, int total) {
        JSONObject event = new JSONObject();
        try {
            event.put("event", "scanProgress");
            event.put("sessionId", session.id);
            event.put("scanning", scanning);
            event.put("checked", checked);
            event.put("total", total);
        } catch (JSONException ignored) {}
        sendEvent(event, "scanProgress");
    }

    private void sendEvent(JSONObject detail, String ignored) {
        String script = "window.dispatchEvent(new CustomEvent(" + JSONObject.quote(EVENT_NAME) + ",{detail:" + detail.toString() + "}));";
        activity.runOnUiThread(() -> {
            if (webView != null) webView.evaluateJavascript(script, null);
        });
    }

    private static JSONObject error(String code, String message, int status) {
        JSONObject error = new JSONObject();
        try {
            error.put("code", code);
            error.put("message", message);
            if (status > 0) error.put("statusCode", status);
        } catch (JSONException ignored) {}
        return error;
    }

    private static boolean isCameraStatus(JSONObject status) {
        return status.has("framesize") && status.has("quality");
    }

    private static boolean isOperation(String operation) {
        return "discover".equals(operation) || "status".equals(operation) || "control".equals(operation)
                || "capture".equals(operation) || "stream".equals(operation);
    }

    private static boolean isSafeId(String id) {
        return id != null && id.matches("[A-Za-z0-9-]{8,96}");
    }

    private static boolean isIpv4(String host) {
        String[] pieces = host == null ? new String[0] : host.split("\\.");
        if (pieces.length != 4) return false;
        for (String piece : pieces) {
            try {
                if (piece.isEmpty() || (piece.length() > 1 && piece.charAt(0) == '0')) return false;
                int value = Integer.parseInt(piece);
                if (value < 0 || value > 255) return false;
            } catch (NumberFormatException e) {
                return false;
            }
        }
        return true;
    }

    private static boolean sameNetwork(Network left, Network right) {
        return left == null ? right == null : left.equals(right);
    }

    private static String safeMessage(Exception exception) {
        String message = exception.getMessage();
        return message == null || message.isEmpty() ? exception.getClass().getSimpleName() : message;
    }

    private static byte[] readLimited(InputStream input, int maxBytes) throws IOException, CameraException {
        try (InputStream stream = input; ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[8192];
            int count;
            while ((count = stream.read(buffer)) != -1) {
                if (output.size() + count > maxBytes) throw new CameraException("RESPONSE_TOO_LARGE", "摄像头响应过大", 0);
                output.write(buffer, 0, count);
            }
            return output.toByteArray();
        }
    }

    private static WebResourceResponse errorResponse(int status, String message) {
        Map<String, String> headers = new HashMap<>();
        headers.put("Cache-Control", "no-store");
        return new WebResourceResponse("text/plain", "UTF-8", status, message, headers,
                new ByteArrayInputStream(message.getBytes(StandardCharsets.UTF_8)));
    }

    private final class DiscoveryWorker implements Runnable {
        private final CameraSession session;
        private final Network network;
        private final Inet4Address localAddress;
        private volatile boolean stopped;
        private volatile DatagramSocket socket;
        private volatile boolean foundUdp;
        private volatile boolean scanStarted;

        DiscoveryWorker(CameraSession session, Network network, Inet4Address localAddress) {
            this.session = session;
            this.network = network;
            this.localAddress = localAddress;
        }

        @Override
        public void run() {
            long startedAt = System.currentTimeMillis();
            long nextBroadcast = 0;
            try {
                DatagramSocket datagramSocket = new DatagramSocket(null);
                socket = datagramSocket;
                datagramSocket.setReuseAddress(true);
                datagramSocket.setBroadcast(true);
                datagramSocket.bind(new InetSocketAddress(DISCOVERY_PORT));
                network.bindSocket(datagramSocket);
                datagramSocket.setSoTimeout(250);
                byte[] buffer = new byte[1024];
                while (!stopped && !session.cancelled) {
                    long now = System.currentTimeMillis();
                    if (now >= nextBroadcast) {
                        sendDiscover(datagramSocket);
                        nextBroadcast = now + 2000;
                    }
                    if (!foundUdp && !scanStarted && now - startedAt >= 3000) {
                        scanStarted = true;
                        submitScan(session, network, localAddress);
                    }
                    try {
                        DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
                        datagramSocket.receive(packet);
                        JSONObject device = parseDiscovery(packet);
                        if (device != null) {
                            foundUdp = true;
                            sendDevice(session, device);
                        }
                    } catch (java.net.SocketTimeoutException ignored) {
                        // Timeouts are used to service broadcast and cancellation.
                    }
                }
            } catch (IOException ignored) {
                if (!session.cancelled) sendScanProgress(session, false, 0, 0);
            } finally {
                stop();
            }
        }

        void stop() {
            stopped = true;
            if (socket != null) socket.close();
            socket = null;
        }

        private void sendDiscover(DatagramSocket datagramSocket) {
            byte[] bytes = "DISCOVER_ESP32CAM".getBytes(StandardCharsets.UTF_8);
            try {
                datagramSocket.send(new DatagramPacket(bytes, bytes.length, broadcastAddress(localAddress), DISCOVERY_PORT));
                datagramSocket.send(new DatagramPacket(bytes, bytes.length, InetAddress.getByName("255.255.255.255"), DISCOVERY_PORT));
            } catch (IOException ignored) {}
        }
    }

    private void submitScan(CameraSession session, Network network, Inet4Address localAddress) {
        Future<?> scanFuture = requestExecutor.submit(() -> {
            final int total = 254;
            int checked = 0;
            sendScanProgress(session, true, checked, total);
            byte[] address = localAddress.getAddress();
            for (int base = 1; base <= 254 && !session.cancelled; base += 16) {
                List<Future<?>> batch = new ArrayList<>();
                for (int last = Math.min(254, base + 15), part = base; part <= last; part += 1) {
                    final int host = part;
                    batch.add(scanExecutor.submit(() -> probeStatus(session, network, address, host)));
                }
                for (Future<?> future : batch) {
                    try { future.get(SCAN_TIMEOUT_MS + 300L, TimeUnit.MILLISECONDS); } catch (Exception ignored) {}
                    checked += 1;
                    sendScanProgress(session, true, checked, total);
                }
            }
            if (!session.cancelled) sendScanProgress(session, false, checked, total);
        });
        session.tasks.add(scanFuture);
    }

    private void probeStatus(CameraSession session, Network network, byte[] prefix, int host) {
        if (session.cancelled) return;
        try {
            String ip = (prefix[0] & 0xff) + "." + (prefix[1] & 0xff) + "." + (prefix[2] & 0xff) + "." + host;
            Target target = new Target("http", ip, 80);
            HttpResult result = requestOnce(session, target.url("/status"), SCAN_TIMEOUT_MS, 64 * 1024);
            JSONObject status = new JSONObject(new String(result.body, StandardCharsets.UTF_8));
            if (!isCameraStatus(status)) return;
            session.verifiedBases.add(target.base());
            JSONObject device = new JSONObject();
            device.put("IP", ip);
            device.put("PORT", "80");
            device.put("BASE", target.base());
            device.put("STREAM", "http://" + ip + ":81/stream");
            device.put("CAPTURE", "http://" + ip + "/capture");
            device.put("NAME", "esp32cam");
            device.put("source", "http");
            sendDevice(session, device);
        } catch (Exception ignored) {}
    }

    private JSONObject parseDiscovery(DatagramPacket packet) {
        String text = new String(packet.getData(), packet.getOffset(), packet.getLength(), StandardCharsets.UTF_8).trim();
        if (!text.startsWith("ESP32CAM|")) return null;
        Map<String, String> values = new HashMap<>();
        String[] sections = text.split("\\|");
        for (int index = 1; index < sections.length; index += 1) {
            int equals = sections[index].indexOf('=');
            if (equals <= 0) continue;
            values.put(sections[index].substring(0, equals).trim().toUpperCase(Locale.US), sections[index].substring(equals + 1).trim());
        }
        String ip = values.get("IP");
        if (!isIpv4(ip)) return null;
        int port = 80;
        try { if (values.containsKey("PORT")) port = Integer.parseInt(values.get("PORT")); } catch (NumberFormatException ignored) { return null; }
        if (port < 1 || port > 65535) return null;
        String stream = values.get("STREAM");
        String capture = values.get("CAPTURE");
        try {
            if (stream != null) validDeviceUrl(stream, ip);
            if (capture != null) validDeviceUrl(capture, ip);
            JSONObject device = new JSONObject();
            String base = "http://" + ip + (port == 80 ? "" : ":" + port);
            device.put("IP", ip);
            device.put("PORT", String.valueOf(port));
            device.put("BASE", base);
            device.put("STREAM", stream == null ? "http://" + ip + ":81/stream" : stream);
            device.put("CAPTURE", capture == null ? base + "/capture" : capture);
            device.put("MAC", values.getOrDefault("MAC", ""));
            device.put("NAME", values.getOrDefault("NAME", "esp32cam"));
            device.put("source", "udp");
            return device;
        } catch (CameraException | JSONException e) {
            return null;
        }
    }

    private static InetAddress broadcastAddress(Inet4Address address) throws IOException {
        byte[] bytes = address.getAddress();
        bytes[3] = (byte) 255;
        return InetAddress.getByAddress(bytes);
    }

    private static final class DisconnectingInputStream extends InputStream {
        private final InputStream delegate;
        private final CameraSession session;
        private final HttpURLConnection connection;

        DisconnectingInputStream(InputStream delegate, CameraSession session, HttpURLConnection connection) {
            this.delegate = delegate;
            this.session = session;
            this.connection = connection;
        }

        @Override public int read() throws IOException { return delegate.read(); }
        @Override public int read(byte[] buffer, int offset, int length) throws IOException { return delegate.read(buffer, offset, length); }
        @Override public void close() throws IOException {
            try { delegate.close(); } finally {
                session.connections.remove(connection);
                connection.disconnect();
            }
        }
    }

    private static final class CameraException extends Exception {
        final String code;
        final int statusCode;

        CameraException(String code, String message, int statusCode) {
            super(message);
            this.code = code;
            this.statusCode = statusCode;
        }
    }
}
