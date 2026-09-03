# ESP32-CAM 摄像头测试模块设计（settings 内嵌弹窗 / B方案）

日期：2026-09-03
范围：后台配置页新增摄像头测试模块，H5 先行可用，APP 联调预留。

## 1. ESP32 侧协议（App 按此对接，不改固件）

- 配网：DHCP，ssid="esp8266"，不断广播，不填网关
- UDP 发现端口：4210，每 2s 广播到 getBroadcastIP():4210（算不出用 255.255.255.255）
- App 发 `DISCOVER_ESP32CAM` 到广播地址，ESP32 单播回包 + 再广播一次
- 消息格式（`|` 分隔，`=` 取值）：

```text
ESP32CAM|IP=192.168.223.102|PORT=80|STREAM=http://192.168.223.102:81/stream|CAPTURE=http://192.168.223.102/capture|MAC=XX:XX|NAME=esp32cam
```

- TCP：80 控制+拍照，81 视频流
- `GET http://IP/` 网页，`GET http://IP:81/stream` MJPEG，`GET http://IP/capture` 单张 JPG，`GET http://IP/status` JSON，`GET http://IP/control?var=framesize&val=8`

## 2. 架构（B 轻量：settings 内嵌 modal）

- `src/pages/settings/settings.vue`：admin 区新增「摄像头测试」menu-card，点击 `activeModal='camera'`，modal 内三段：发现 / 直播 / 设置。不新增 tab，不改 `pages.json` 路由。
- `src/utils/cameraProtocol.js`：纯函数，可 `node:test` 单测
  - `parseEsp32CamMessage(msg)` → `{IP, PORT, STREAM, CAPTURE, MAC, NAME}` 或 null
  - `normalizeManualIp(input)` → `http://IP` 基址
  - `buildControlUrl(base, variable, value)` / `buildCaptureUrl(base)` / `buildStreamUrl(base)` / `buildStatusUrl(base)`
  - `guessBroadcastAddresses()` → `['255.255.255.255','192.168.223.255','192.168.43.255','192.168.4.255']`
  - `FRAMESIZE_MAP`：8=SVGA / 10=UXGA 等（第一版只暴露 framesize + quality + flash）
- `src/utils/cameraDiscovery.js`：APP-PLUS 用 `uni.createUDPSocket()` bind(4210) + 轮发 `DISCOVER_ESP32CAM` + onMessage 解析去重；H5/小程序直接返回 `{ supported:false }` 降级手动输入。
- `src/services/esp32cam.js`：`fetchStatus/capturePhoto/sendControl`，`uni.request/downloadFile`，超时 5s，失败重试 1 次。
- `src/stores/cameraStore.js`：响应式设备列表 `{MAC,IP,STREAM,CAPTURE,NAME,lastSeen}`，`upsert(prune 5s无广播判离线)`。
- H5 直播：modal 内 `<img :src="streamUrl">`（H5 img 支持 MJPEG）；拍照用 `uni.downloadFile(CAPTURE)` 存相册，H5 降级为新窗口打开。
- 第二步（真机联调时再做）：`hybrid/html/stream.html` 中转页 + App `web-view` 播流 + `plus` 保持亮屏 + `MulticastLock.acquire()` + AP 直连提示（192.168.4.1）。

## 3. manifest 权限（第一版）

- Android：保留 INTERNET，新增 `ACCESS_WIFI_STATE`、`CHANGE_WIFI_MULTICAST_STATE`、`ACCESS_FINE_LOCATION`，`usesCleartextTraffic=true`
- iOS：`NSAppTransportSecurity.NSAllowsArbitraryLoads=true`
- MulticastLock（plus.android 调 WifiManager）放到第二步。

## 4. 错误与兜底

- 发现页永远保留手动输入 `http://IP` 入口；解析失败 toast 提示；热点客户端隔离时提示切 ESP32-AP 直连。
- 控制/拍照失败 toast + 重试一次；直播 img 加 `onError` 提示检查同热点。

## 5. 验收

- `node --test src/utils/cameraProtocol.test.mjs` 通过
- H5（5175）：后台配置 → 摄像头测试 → 手动输入 IP → 2s 内出画面 → /capture 存图 → 切分辨率生效
- APP 真机：同热点 3s 内发现设备（第二步联调）
