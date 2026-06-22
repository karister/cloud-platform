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

## 内测包自动发布（蒲公英 + 邮件）

`npm run release:apk` 会在打包结束后自动把 APK 上传到 **蒲公英 (Pgyer)** 内测分发平台，
然后通过现有的 EmailJS 邮件服务把下载链接、安装密码、版本号、更新说明发给指定收件人。

整个流程拆分为四个独立的服务模块，方便单测与复用：

| 模块 | 文件 | 职责 |
|------|------|------|
| `PgyerUploadService` | `scripts/lib/pgyer-upload.mjs` | 上传 APK 到蒲公英，含 3 次重试与超时 |
| `EmailSender`        | `scripts/lib/email-sender.mjs` | EmailJS REST API（Node 端，无浏览器依赖） |
| `ReleaseHistory`     | `scripts/lib/release-history.mjs` | 追加 `release-history.json` 发布记录 |
| `BuildPublishService`| `scripts/lib/release-publisher.mjs` | 调度 build → upload → email → record |
| 命令入口             | `scripts/release-apk.mjs` | CLI 解析、配置校验、流程编排 |

### 1. 获取蒲公英 API Key

1. 打开 https://www.pgyer.com ，登录账号
2. 进入 **「我的 → 账户设置 → API 信息」** 或直接访问 https://www.pgyer.com/account/api
3. 拷贝 **API Key**（不是 App Key / Build Key）

### 2. 配置环境变量

复制示例文件并填写真实值：

```bash
cp .env.example .env
```

`.env` 已在 `.gitignore` 中，不会被提交。需要填写：

| 变量 | 必填 | 说明 |
|------|------|------|
| `PGYER_API_KEY` | ✅ | 蒲公英 API Key |
| `PGYER_INSTALL_PASSWORD` | ⛔ 推荐 | 用户打开下载页时输入的安装密码 |
| `PGYER_BUILD_INSTALL_TYPE` | 否，默认 `1` | `1` = 密码安装，`2` = 邀请安装 |
| `PGYER_BUILD_UPDATE_DESCRIPTION` | 否 | 默认更新说明，可被 `--desc` 覆盖 |
| `APK_OUTPUT_PATH` | 否 | 默认 `apks/cloud-platform.apk` |
| `DOWNLOAD_LINK_EXPIRE_DAYS` | 否，默认 `7` | 仅作为邮件中提示文案 |
| `APP_NAME` / `VERSION_NAME` / `VERSION_CODE` | 否 | 可被 CLI 参数覆盖 |
| `EMAILJS_PUBLIC_KEY` / `EMAILJS_SERVICE_ID` / `EMAILJS_TEMPLATE_ID` | ✅ | 现有邮件服务凭证 |
| `RECEIVER_EMAIL` | ⛔ 推荐 | 默认收件人，可被 `--email` 覆盖 |

> 真实 `.env` 不要提交到 Git。CI/CD 场景下，请把上述变量配置在 Secret / 环境变量中。

### 3. APK 打包命令（已有）

```bash
npm run build:apk          # PowerShell 脚本，会调用 Gradle assembleDebug
```

APK 输出：`apks/cloud-platform.apk`

### 4. 一键上传并发送邮件

```bash
# 最简形式（使用 .env 中的所有默认配置）
npm run release:apk

# 指定收件人与更新说明
npm run release:apk -- --email qa@example.com --desc "修复已知问题,优化页面显示"

# 跳过 Gradle 重新打包，仅上传已存在的 APK
npm run release:apk -- --skip-build --email qa@example.com

# 查看最近 20 条发布记录
npm run release:history

# 或直接调用
node scripts/release-apk.mjs --help
```

支持的所有参数：

```
--apk <path>            APK 文件路径（默认 apks/cloud-platform.apk）
--email <addr>          收件人邮箱
--desc <text>           更新说明
--app-name <name>       应用名称
--version-name <v>      版本名称（如 1.0.0）
--version-code <n>      构建版本号（如 1）
--variant <Debug|Release>
                        Gradle 变体（默认 Debug）
--skip-build            跳过 Gradle 重新打包
--list                  打印最近的发布记录并退出
--help                  显示帮助
```

### 5. 邮件内容示例

主题：`【应用内测包】云平台数据通信 v1.0.0 已生成`

正文（HTML）摘要：

- 应用名称、版本号、构建版本、包大小
- **下载地址按钮** + 完整下载链接（`${DOWNLOAD_LINK_EXPIRE_DAYS}` 天内有效提示）
- **安装密码**单独高亮显示
- 更新说明（保留换行）
- 提示语：请使用 Android 手机打开下载链接,按照页面提示下载安装。该链接仅用于内部测试,请不要转发给无关人员。

> 邮件正文不附带 APK 文件 — 只发送下载链接、安装密码、版本号、更新说明。
> 附件 APK 会显著拉长邮件体积、超过多数邮箱附件上限（通常 25MB）、
> 并被收件方反垃圾系统拒收或隔离，因此不采用。

### 6. 常见错误说明

| 现象 | 可能原因 | 解决 |
|------|---------|------|
| `Missing required env vars: ...` | `.env` 缺失或字段为空 | `cp .env.example .env` 并补全 |
| `APK not found` | 还没跑过 `npm run build:apk` | 先跑打包，或用 `--apk` 指定已有 APK |
| `HTTP 401 / 403` | EmailJS Public Key / Service ID / Template ID 错误 | 重新核对控制台 |
| `EmailJS returned HTTP 400: The Public Key is required` | 用了 form-encoded 而非 JSON body | 本仓库 `email-sender.mjs` 已切到 JSON,如果用第三方脚本务必用 `Content-Type: application/json` |
| `EmailJS returned HTTP 400` (其他) | 模板缺少必要变量 | 在模板里加上 `to_email / app_name / version_name / version_code / file_size / download_url / install_password / update_description / body_html / body_text` |
| 收到的是「配置导出」主题的邮件,内容是 `configJson` | EmailJS 账号下只有配置导出模板,没为发布通知建独立模板 | 在 https://dashboard.emailjs.com/admin/templates 新建模板,To Email 填 `{{to_email}}`,Subject 填 `{{subject}}`,Content 用代码里 `scripts/lib/email-sender.mjs` 渲染的字段(`download_url / install_password / version_name / version_code / file_size / update_description / app_name / expire_days`),然后把新模板 ID 写到 `.env` 的 `EMAILJS_TEMPLATE_ID` |
| `Request timed out` | 上传大 APK 超过 5 分钟 | 提升 `REQUEST_TIMEOUT_MS` 或减少 APK 体积 |
| `PGYER 4xx: invalid file` | APK 不合规(缺 `resources.arsc`、v2 签名、zipalign 等) | 用真 aapt2 打包,见下方「测试 APK」章节 |
| `PowerShell was not found` | Linux/macOS 没装 pwsh | 安装 PowerShell 7 (`brew install powershell`)；只想上传时可加 `--skip-build` |
| `aapt2 not found` | Android SDK build-tools 缺失 | `brew install --cask android-commandlinetools && sdkmanager "build-tools;35.0.0" "platforms;android-35"` |

### 7. 链路测试(无需 Android 项目)

`scripts/make-test-apk.mjs` 可以在**没有 Android 源码、没有 Gradle、没有 Windows** 的情况下生成一个 Pgyer 能接受的真合规 APK(13KB,v1+v2+v3 签名),用来端到端验证 Pgyer + EmailJS 链路。

要求:
- `ANDROID_HOME` (或 `ANDROID_SDK_ROOT`) 指向 Android SDK
- `build-tools;35.0.0` + `platforms;android-35` 已安装
- JDK 17(SDK manager 需要)

生成并发送:

```bash
node scripts/make-test-apk.mjs
npm run release:apk -- --skip-build --email your@email.com --desc "链路测试"
```

第一次运行会在 `work/test-release.keystore` 生成一个自签名 keystore,后续复用。`work/` 已在 `.gitignore`,不会提交。

### 7. 发布记录

每次执行 `release:apk` 后会在项目根目录追加一条记录到 `release-history.json`
（已被 `.gitignore` 忽略，本地保留即可）：

```json
{
  "id": "rel_20260622115225_c5176d",
  "app_name": "云平台数据通信",
  "version_name": "1.0.0",
  "version_code": "1",
  "apk_file_name": "cloud-platform.apk",
  "apk_file_size": 12345678,
  "pgyer_build_key": "...",
  "download_url": "https://www.pgyer.com/...",
  "shortcut_url": "https://pg.fun/...",
  "qr_code_url": "https://...",
  "install_password": "123456",
  "update_description": "...",
  "upload_status": "success",
  "email_status": "success",
  "receiver_email": "qa@example.com",
  "error_message": "",
  "created_at": "2026-06-22T03:52:25.819Z",
  "updated_at": "2026-06-22T03:52:25.819Z"
}
```

查询最近 20 条：

```bash
npm run release:history
```

> 设计原则：**APK 上传成功但邮件发送失败时不会回滚上传**，记录里 `upload_status=success`、
> `email_status=failed`，便于后续人工补发邮件。

### 8. 日志与密钥脱敏

- 所有步骤都有 `[INFO] / [STEP] / [WARN] / [ERROR] / [SUCCESS]` 前缀
- 任何敏感字段（API Key、Public Key、Service ID、Template ID、密码）仅显示前 4 + `****` + 后 4
- 不打印完整凭证，也不写入发布记录（install_password 之外的所有 secret 字段在 history 中也会被忽略）

## 数据说明

需求中提供的是当前属性查询和期望属性设置接口，没有单独的历史数据查询接口。因此当前历史数据实现为：每次进入数据展示页刷新或在历史页点击“采样”，都会把当前展示数据点记录到本地历史中，用于曲线和列表展示。
