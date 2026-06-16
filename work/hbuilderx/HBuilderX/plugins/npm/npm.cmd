:: Created by npm, please don't edit manually.
@ECHO OFF

SETLOCAL
:: Modify for used by HBuilderX
SET "NPM_PLUGIN_DIR=%~dp0"
SET "PLUGIN_DIR=%NPM_PLUGIN_DIR:~0,-4%"
SET "NODE_PLUGIN_DIR=%PLUGIN_DIR%\node\"
SET "PATH=%PATH%;%NODE_PLUGIN_DIR%"

if "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
    set "NODE_EXE=%~dp0\node.exe"
) else (
    set "NODE_EXE=%PLUGIN_DIR%\node32\node.exe"
)
IF NOT EXIST "%NODE_EXE%" (
  SET "NODE_EXE=node"
)

SET "NPM_CLI_JS=%~dp0\node_modules\npm\bin\npm-cli.js"
FOR /F "delims=" %%F IN ('CALL "%NODE_EXE%" "%NPM_CLI_JS%" prefix -g') DO (
  SET "NPM_PREFIX_NPM_CLI_JS=%%F\node_modules\npm\bin\npm-cli.js"
)
IF EXIST "%NPM_PREFIX_NPM_CLI_JS%" (
  SET "NPM_CLI_JS=%NPM_PREFIX_NPM_CLI_JS%"
)

"%NODE_EXE%" "%NPM_CLI_JS%" %*
