package com.example.cloudplatformcomm;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class MainActivity extends Activity {
    private static final String LOCAL_ASSET_HOST = "appassets.androidplatform.net";
    private static final int FILE_CHOOSER_REQUEST = 1001;
    private static final int SAVE_FILE_REQUEST = 1002;
    private WebView webView;
    private ValueCallback<Uri[]> pendingFileChooser;
    private String pendingSaveContent;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        webView.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        if (BuildConfig.DEBUG) {
            // 真机调试：允许通过 chrome://inspect / CDP 检查与驱动 WebView
            WebView.setWebContentsDebuggingEnabled(true);
        }

        // 前端导出配置走此桥接（blob: 下载在 WebView 中不生效）
        webView.addJavascriptInterface(new FileBridge(), "AndroidBridge");

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback,
                    FileChooserParams params) {
                android.util.Log.d("MainActivity", "onShowFileChooser accept="
                        + java.util.Arrays.toString(params.getAcceptTypes()));
                if (pendingFileChooser != null) {
                    // WebView 同一时刻只允许一个待处理的选择器，先结束旧的
                    pendingFileChooser.onReceiveValue(null);
                }
                pendingFileChooser = callback;
                try {
                    Intent intent = params.createIntent();
                    // 部分文件管理器把 .json 标记为 application/octet-stream，
                    // 按 accept 过滤会选不到文件，故放宽为任意文件，由前端校验 JSON
                    intent.setType("*/*");
                    intent.removeExtra(Intent.EXTRA_MIME_TYPES);
                    startActivityForResult(intent, FILE_CHOOSER_REQUEST);
                } catch (ActivityNotFoundException e) {
                    pendingFileChooser = null;
                    callback.onReceiveValue(null);
                    return false;
                }
                return true;
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                if (!LOCAL_ASSET_HOST.equals(request.getUrl().getHost())) {
                    return null;
                }
                return serveAsset(request.getUrl().getPath());
            }
        });
        setContentView(webView);
        // 通过本地 HTTPS 域名加载，而不是 file://。Android WebView 会阻止 file://
        // 页面加载 ES Module 资源，导致页面脚本无法执行并白屏。
        webView.loadUrl("https://" + LOCAL_ASSET_HOST + "/index.html");
    }

    private WebResourceResponse serveAsset(String path) {
        if (path == null || path.equals("/")) {
            path = "/index.html";
        }

        if (!path.startsWith("/assets/")
                && !path.startsWith("/static/")
                && !path.equals("/index.html")) {
            return null;
        }

        try {
            InputStream stream = getAssets().open("www" + path);
            return new WebResourceResponse(mimeType(path), "UTF-8", stream);
        } catch (IOException ignored) {
            return null;
        }
    }

    private String mimeType(String path) {
        if (path.endsWith(".html")) return "text/html";
        if (path.endsWith(".js")) return "application/javascript";
        if (path.endsWith(".css")) return "text/css";
        if (path.endsWith(".png")) return "image/png";
        if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
        if (path.endsWith(".svg")) return "image/svg+xml";
        if (path.endsWith(".json")) return "application/json";
        if (path.endsWith(".woff2")) return "font/woff2";
        return "application/octet-stream";
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == SAVE_FILE_REQUEST) {
            String content = pendingSaveContent;
            pendingSaveContent = null;
            if (resultCode != RESULT_OK || data == null || data.getData() == null
                    || content == null) {
                Toast.makeText(this, "已取消保存", Toast.LENGTH_SHORT).show();
                return;
            }
            try (OutputStream os = getContentResolver().openOutputStream(data.getData())) {
                if (os == null) {
                    throw new IOException("无法打开目标文件");
                }
                os.write(content.getBytes(StandardCharsets.UTF_8));
                os.flush();
                Toast.makeText(this, "配置已保存", Toast.LENGTH_SHORT).show();
            } catch (IOException | SecurityException e) {
                Toast.makeText(this, "保存失败：" + e.getMessage(), Toast.LENGTH_LONG).show();
            }
            return;
        }
        if (requestCode != FILE_CHOOSER_REQUEST) {
            super.onActivityResult(requestCode, resultCode, data);
            return;
        }
        if (pendingFileChooser == null) {
            return;
        }
        Uri[] result = null;
        if (resultCode == RESULT_OK && data != null && data.getData() != null) {
            result = new Uri[]{ data.getData() };
        }
        // 取消也必须回调 null，否则 WebView 认为选择器仍在进行，后续点击不再响应
        pendingFileChooser.onReceiveValue(result);
        pendingFileChooser = null;
    }

    /**
     * 暴露给页面的保存桥接：Android WebView 不支持 blob: URL 下载，
     * 由原生弹出系统“另存为”（SAF）把内容写入用户选择的位置。
     */
    private class FileBridge {
        @JavascriptInterface
        public boolean saveJsonFile(final String filename, final String content) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        pendingSaveContent = content;
                        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                        intent.addCategory(Intent.CATEGORY_OPENABLE);
                        intent.setType("application/json");
                        intent.putExtra(Intent.EXTRA_TITLE,
                                filename != null && !filename.isEmpty() ? filename : "config.json");
                        startActivityForResult(intent, SAVE_FILE_REQUEST);
                    } catch (ActivityNotFoundException e) {
                        pendingSaveContent = null;
                        Toast.makeText(MainActivity.this, "无法打开保存窗口", Toast.LENGTH_SHORT).show();
                    }
                }
            });
            return true;
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
