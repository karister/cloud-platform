# 云平台数据通信 uni-app

这是一个基于 uni-app + Vue 3 的云平台数据通信应用，用于连接 OneNET / 物联网云平台设备，展示设备属性、下发开关指令、设置阈值并查看本地历史数据。

项目同时包含 H5、小程序、App 构建脚本，以及 APK 内测发布、蒲公英上传、EmailJS 邮件通知和 uniCloud 前端网页托管部署脚本。

## 功能概览

- 数据看板：展示已配置数据点的实时值，支持异常阈值提示。
- 开关控制：向云平台下发期望属性，控制设备开关类数据点。
- 阈值设置：用滑条和数字输入调整阈值，并同步到云端。
- 历史数据：按配置的轮询间隔采样本地历史，展示曲线和记录列表。
- 后台配置：配置应用名、云平台连接、展示点、开关点、阈值点、主题和轮询间隔。
- 配置导入导出：支持导出 JSON 配置文件；导入时支持粘贴 JSON 内容或选择本地 `.json` 文件。

## 环境要求

- Node.js 18+
- npm
- HBuilderX / DCloud CLI：用于 App 和 uniCloud 托管部署，项目已内置便携版到 `work/hbuilderx/`
- Windows PowerShell：用于 `build:apk` 和 `deploy:h5` 脚本

## 安装与本地运行

```bash
npm install
npm run dev:h5
```

常用开发命令：

```bash
npm run build:h5
npm run dev:mp-weixin
npm run build:mp-weixin
npm run dev:app
npm run build:app
```

## 应用内配置

进入应用「后台配置」页面后，可以配置：

- 云平台连接：`Product ID`、`Device Name`、GET/POST URL、Token / Authorization、模拟数据模式。
- 数据点：展示点、开关点、阈值点。
- 物模型导入：粘贴云平台物模型 JSON 后自动提取展示 / 开关 / 阈值候选点。
- 配置导入导出：导出当前配置为 JSON；导入时可直接粘贴 JSON，也可选择配置文件。
- 邮件配置：配置导出功能使用前端内置的 EmailJS 配置导出模板。

默认启用模拟数据模式，便于没有真实设备时预览应用。切换到真实云平台前，请先确认云平台连接和数据点标识符正确。

## 本地 `.env` 配置

发布 APK、发送邮件和部署 H5 使用项目根目录的 `.env`。先复制示例文件：

```bash
cp .env.example .env
```

`.env` 已被 `.gitignore` 忽略，不要提交真实账号、密码或密钥。

### APK 发布配置

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `PGYER_API_KEY` | 是 | 蒲公英 API Key |
| `PGYER_INSTALL_PASSWORD` | 推荐 | 下载页安装密码 |
| `PGYER_BUILD_INSTALL_TYPE` | 否 | 默认 `1`，`1` = 密码安装，`2` = 邀请安装 |
| `PGYER_BUILD_UPDATE_DESCRIPTION` | 否 | 默认更新说明，可被 `--desc` 覆盖 |
| `APK_OUTPUT_PATH` | 否 | 默认 `apks/cloud-platform.apk` |
| `DOWNLOAD_LINK_EXPIRE_DAYS` | 否 | 邮件中的有效期提示，默认 `7` |
| `APP_NAME` / `VERSION_NAME` / `VERSION_CODE` | 否 | 发布邮件和记录中显示的应用元数据 |

### APK 邮件通知配置

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `EMAILJS_PUBLIC_KEY` | 是 | EmailJS Public Key |
| `EMAILJS_SERVICE_ID` | 是 | EmailJS Service ID |
| `EMAILJS_TEMPLATE_ID` | 是 | APK 发布通知模板 ID |
| `RECEIVER_EMAIL` | 推荐 | 默认收件人，可被 `--email` 覆盖 |

APK 发布通知模板需要支持以下变量：

```text
to_email
subject
app_name
version_name
version_code
file_size
download_url
install_password
update_description
expire_days
body_html
body_text
```

注意：APK 发布通知模板不要复用「配置导出」邮件模板。配置导出模板用于应用内导出配置，APK 发布通知模板用于发送蒲公英下载链接。

### H5 部署配置

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `DCLOUD_USERNAME` | 是 | DCloud 登录账号 |
| `DCLOUD_PASSWORD` | 是 | DCloud 登录密码 |
| `DCLOUD_PROVIDER` | 否 | 默认 `aliyun` |
| `DCLOUD_SPACE_ID` | 是 | uniCloud 服务空间 ID |

## APK 构建与发布

只构建 APK：

```bash
npm run build:apk
```

输出文件：

```text
apks/cloud-platform.apk
```

构建 APK 后上传蒲公英、发送邮件并写入发布记录：

```bash
npm run release:apk -- --email qa@example.com --desc "修复已知问题"
```

仅发送已有 APK，不重新打包：

```bash
npm run send:apk -- --email qa@example.com --desc "修复已知问题"
```

查看本地发布记录：

```bash
npm run release:history
```

发布记录会写入项目根目录的 `release-history.json`，该文件只保留在本地。

常用参数：

```text
--apk <path>            指定 APK 路径
--email <addr>          指定收件人
--desc <text>           指定更新说明
--app-name <name>       指定应用名
--version-name <v>      指定版本名
--version-code <n>      指定版本号
--variant <Debug|Release>
--skip-build            跳过重新打包
--list                  查看发布记录
--help                  查看帮助
```

## H5 托管部署

首次使用时登录 DCloud：

```bash
.\scripts\deploy-h5.ps1 -Login -Username <DCloud账号> -Password <密码>
```

之后可直接部署：

```bash
npm run deploy:h5
```

脚本会构建 H5 产物，调用 HBuilderX CLI 上传到 uniCloud 前端网页托管，并在完成后打开托管地址。

当前托管地址：

```text
https://static-mp-70459e72-3958-42a0-9743-4e80b54716cd.next.bspapp.com
```

## 常见问题

| 问题 | 处理方式 |
| --- | --- |
| `Missing required env vars` | 检查 `.env` 是否存在，必填变量是否为空 |
| `APK not found` | 先执行 `npm run build:apk`，或用 `--apk` 指定已有 APK |
| EmailJS 返回 400 / 401 / 403 | 核对 Public Key、Service ID、Template ID 和模板变量 |
| 邮件按钮无法下载 | 确认使用的是 APK 发布通知模板，脚本会把蒲公英短码转换为完整下载链接 |
| H5 没有上传最新产物 | 确认 `npm run deploy:h5` 成功执行，并检查 DCloud 账号、空间 ID 和 HBuilderX CLI |

## 开发验证

当前项目包含部分 Node 测试，可用于验证配置导入、发布脚本和邮件链接渲染：

```bash
node --test src\utils\configImportExport.test.mjs scripts\package-scripts.test.mjs scripts\lib\config.test.mjs scripts\lib\email-sender.test.mjs
```
