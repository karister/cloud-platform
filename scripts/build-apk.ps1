param(
  [ValidateSet("Debug")]
  [string]$Variant = "Debug"
)

$ErrorActionPreference = "Stop"

$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$AndroidProject = Join-Path $ProjectRoot "android-webview"
$H5Dist = Join-Path $ProjectRoot "dist\build\h5"
$AssetsWww = Join-Path $AndroidProject "app\src\main\assets\www"
$BuildToolsRoot = Join-Path $ProjectRoot "work\android-build-tools"
$AndroidSdk = Join-Path $BuildToolsRoot "android-sdk"
$GradleBat = Join-Path $BuildToolsRoot "gradle-8.10.2\bin\gradle.bat"
$JavaHome = "C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
$OutputDir = Join-Path $ProjectRoot "apks"

function Assert-PathExists($Path, $Hint) {
  if (!(Test-Path $Path)) {
    throw "$Hint Missing path: $Path"
  }
}

Assert-PathExists $GradleBat "Local Gradle was not found."
Assert-PathExists (Join-Path $AndroidSdk "platforms\android-35") "Android SDK Platform 35 was not found."
Assert-PathExists (Join-Path $AndroidSdk "build-tools\35.0.0") "Android Build Tools 35.0.0 was not found."
Assert-PathExists $JavaHome "JDK 17 was not found."

Write-Host "1/5 Build uni-app H5 assets..."
Push-Location $ProjectRoot
try {
  & npm.cmd run build:h5
} finally {
  Pop-Location
}

Assert-PathExists $H5Dist "H5 build output was not found."

Write-Host "2/5 Sync H5 assets into Android assets..."
if (Test-Path $AssetsWww) {
  Remove-Item -Recurse -Force -LiteralPath $AssetsWww
}
New-Item -ItemType Directory -Force $AssetsWww | Out-Null
Copy-Item -Recurse -Force (Join-Path $H5Dist "*") $AssetsWww

Write-Host "3/5 Build Android APK..."
$env:ANDROID_HOME = $AndroidSdk
$env:ANDROID_SDK_ROOT = $AndroidSdk
$env:JAVA_HOME = $JavaHome
$env:GRADLE_USER_HOME = Join-Path $BuildToolsRoot "gradle-home"
$JavaBin = Join-Path $env:JAVA_HOME "bin"
$PlatformTools = Join-Path $env:ANDROID_HOME "platform-tools"
$BuildTools = Join-Path $env:ANDROID_HOME "build-tools\35.0.0"
$env:Path = [string]::Join(";", @($JavaBin, $PlatformTools, $BuildTools, $env:Path))

Push-Location $AndroidProject
try {
  & $GradleBat --no-daemon "assemble$Variant"
} finally {
  Pop-Location
}

$variantLower = $Variant.ToLowerInvariant()
$BuiltApk = Join-Path $AndroidProject "app\build\outputs\apk\$variantLower\app-$variantLower.apk"
Assert-PathExists $BuiltApk "APK build failed."

Write-Host "4/5 Copy APK into project apks directory..."
New-Item -ItemType Directory -Force $OutputDir | Out-Null
$OutputApk = Join-Path $OutputDir "cloud-platform.apk"
Copy-Item -Force $BuiltApk $OutputApk

Write-Host "5/5 Verify APK signature..."
$ApkSigner = Join-Path $AndroidSdk "build-tools\35.0.0\apksigner.bat"
if (Test-Path $ApkSigner) {
  & $ApkSigner verify --verbose $OutputApk
}

Write-Host ""
Write-Host "APK build complete: $OutputApk"
