# 云平台数据通信 uni-app

这是一个基于 uni-app Vue 3 的可配置云平台数据通信应用，目标目录：

```text
D:\Code\vibe_coding\cloud-platform-comm-app
```

## 功能

- 数据展示：读取已配置的数据点并展示当前值，支持开关数据点指令下发。
- 阈值设置：以滑条和数字输入调整阈值，并下发到下位机对应属性。
- 历史数据：对展示数据点进行本地采样，使用曲线和列表展示历史记录。
- 后台配置：配置应用名称、云平台连接参数、展示数据点、开关数据点、阈值数据点。

## 云平台配置

默认参数来自需求示例：

- Product ID: `85zH3LlDLF`
- Device Name: `device`
- GET URL: `https://iot-api.heclouds.com/thingmodel/query-device-property?product_id=85zH3LlDLF&device_name=device`
- POST URL: `https://iot-api.heclouds.com/thingmodel/set-device-desired-property`
- Authorization: 已按需求示例填入默认值

默认开启“模拟数据模式”，用于无设备时直接预览应用。进入“后台配置 - 云平台连接配置”关闭模拟数据模式后，会使用真实云平台接口。

## 运行

```bash
npm install
npm run dev:h5
```

当前已验证：

```bash
npm run build:h5
```

小程序和 App 侧脚本：

```bash
npm run dev:mp-weixin
npm run build:mp-weixin
npm run dev:app
npm run build:app
```

App 打包通常还需要 HBuilderX 或 DCloud 相关打包环境配合。

## 本地生成 APK

当前项目额外提供了一个 Android WebView 壳打包脚本，会把 H5 产物内置到 APK 中：

```bash
npm run build:apk
```

APK 输出目录：

```text
apks/
```

固定输出文件名：

```text
apks/cloud-platform.apk
```

每次执行脚本都会覆盖上一次生成的同名 APK。

脚本依赖项目内的本地 Android 构建工具目录：

```text
work/android-build-tools/
```

如果删除了 `work/android-build-tools/`，需要重新安装 Android SDK command line tools、Platform 35、Build Tools 35.0.0 和 Gradle 8.10.2。

## uniCloud 前端网页托管部署

项目支持通过脚本自动部署到 uniCloud 前端网页托管。

**首次使用（登录一次即可）：**

```bash
.\scripts\deploy-h5.ps1 -Login -Username <你的DCloud账号> -Password <密码>
```

**日常部署：**

```bash
npm run deploy:h5
```

脚本自动完成：
1. 构建 H5 产物
2. 调用 HBuilderX CLI 上传到 uniCloud
3. 浏览器打开托管链接

> HBuilderX 便携版已内置在 `work/hbuilderx/` 目录中，无需额外安装。没有 HBuilderX CLI 时，脚本会打开 uniCloud 控制台和产物文件夹，引导手动上传。

托管地址：

```
https://static-mp-70459e72-3958-42a0-9743-4e80b54716cd.next.bspapp.com
```

## 数据说明

需求中提供的是当前属性查询和期望属性设置接口，没有单独的历史数据查询接口。因此当前历史数据实现为：每次进入数据展示页刷新或在历史页点击“采样”，都会把当前展示数据点记录到本地历史中，用于曲线和列表展示。
