# Repository Guidelines

## Project Structure & Module Organization

This Vue 3/uni-app application connects to OneNET devices and targets H5, WeChat mini programs, and Android.

- `src/pages/<name>/<name>.vue`: dashboard, history, threshold, and settings screens; register routes in `src/pages.json`.
- `src/components/`: reusable Vue components; `src/custom-tab-bar/`: mini-program navigation.
- `src/services/`: OneNET and email integrations. `src/stores/dataStore.js` owns shared device values and polling; reuse it across pages.
- `src/utils/`: configuration, storage, themes, formatting, and token helpers.
- `src/static/`: icons and backgrounds; `public/import.html`: configuration-copy landing page.
- `scripts/`: APK build/release tooling and tests; `android-webview/`: native Android wrapper; `docs/`: design specifications.

## Build, Test, and Development Commands

Use Node.js 18+ and npm; CI uses Node.js 20.

- `npm ci`: install dependencies from `package-lock.json`.
- `npm run dev:h5`: start H5 development at `http://127.0.0.1:5173`.
- `npm run build:h5`: generate production assets in `dist/build/h5/`.
- `npm run dev:mp-weixin` / `npm run build:mp-weixin`: develop/build the WeChat target.
- `npm run dev:app` / `npm run build:app`: develop/build the uni-app native target.
- `npm run build:apk`: package the Android WebView wrapper; requires Windows PowerShell and the local JDK/SDK/Gradle paths specified in `scripts/build-apk.ps1`.

## Coding Style & Naming Conventions

Follow existing two-space indentation, single-quoted JavaScript strings, ES modules, and semicolon-free JavaScript. Use Vue `<script setup>`, PascalCase component filenames, camelCase helpers, and lowercase page directories. Reuse theme CSS variables and existing `rpx` sizing conventions. No formatter or lint script is configured.

## Testing Guidelines

当前项目以实操验收为主，不强制要求单元测试。仅在涉及具体且相对复杂的业务逻辑时才考虑新增测试用例。所有功能修改或开发均通过浏览器测试或真机调试进行验收。

## Commit & Pull Request Guidelines

Recent commits use `feat:`, `fix:`, `docs:`, and `refactor:` with concise Chinese or English summaries. When submitting changes, default to committing directly to `master` unless a branch/PR is requested. For PRs, describe behavior changes, validation, related issues, and screenshots for UI changes. Pushes to `master` deploy GitHub Pages.

## Security & Agent Instructions

Copy `.env.example` to `.env` for release configuration. Keep credentials, device tokens, and sensitive exported configurations out of commits. Only package APKs when explicitly requested. Release scripts upload artifacts and send email; run them only when authorized.

Before finishing any task, clean up the temporary files produced while working on it — scratch images, screenshots, helper scripts, and anything else that was only useful for that specific task — so that only the intended code changes remain in the workspace.
