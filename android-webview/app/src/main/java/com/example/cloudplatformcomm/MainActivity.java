package com.example.cloudplatformcomm;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.view.ViewGroup;
import android.webkit.WebSettings;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.IOException;
import java.io.InputStream;

public class MainActivity extends Activity {
    private static final String LOCAL_ASSET_HOST = "appassets.androidplatform.net";
    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        webView.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

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
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
