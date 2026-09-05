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

Tests use `node:test` and `node:assert/strict`, with descriptive cases in colocated `*.test.mjs` files. Run all suites from the repository root in PowerShell:

```powershell
$testFiles = Get-ChildItem src,scripts -Recurse -Filter *.test.mjs
node --test $testFiles.FullName
```

No coverage threshold is configured. Add regression cases for changed logic; check affected UI flows in mock mode and validate relevant platform builds.

## Commit & Pull Request Guidelines

Recent commits use `feat:`, `fix:`, `docs:`, and `refactor:` with concise Chinese or English summaries. When submitting changes, default to committing directly to `master` unless a branch/PR is requested. For PRs, describe behavior changes, validation, related issues, and screenshots for UI changes. Pushes to `master` deploy GitHub Pages.

## Security & Agent Instructions

Copy `.env.example` to `.env` for release configuration. Keep credentials, device tokens, and sensitive exported configurations out of commits. Only package APKs when explicitly requested. Release scripts upload artifacts and send email; run them only when authorized.
