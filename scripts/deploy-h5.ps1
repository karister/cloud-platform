param(
  [switch]$Login,
  [string]$Username,
  [string]$Password,
  [string]$Space = "cloud-app",
  [string]$Provider = "aliyun"
)

$ErrorActionPreference = "Stop"

$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$H5Dist = Join-Path $ProjectRoot "dist\build\h5"
$HBuilderXRoot = Join-Path $ProjectRoot "work\hbuilderx\HBuilderX"
$CliExe = Join-Path $HBuilderXRoot "cli.exe"
$HBuilderXExe = Join-Path $HBuilderXRoot "HBuilderX.exe"

function Write-Step($Step, $Total, $Message) {
  Write-Host "$Step/$Total $Message"
}

# --- Login mode ---
if ($Login) {
  if (-not $Username -or -not $Password) {
    Write-Host "Usage: .\deploy-h5.ps1 -Login -Username YOUR_ACCOUNT -Password YOUR_PASSWORD"
    Write-Host "  First-time setup: login once, then deploy anytime."
    exit 1
  }

  if (-not (Test-Path $CliExe)) {
    Write-Host "HBuilderX CLI not found at: $CliExe"
    Write-Host "Download HBuilderX zip and extract to: $HBuilderXRoot"
    Start-Process "https://www.dcloud.io/hbuilderx.html"
    exit 1
  }

  # Start HBuilderX first, then login
  if (-not (Get-Process -Name "HBuilderX" -ErrorAction SilentlyContinue)) {
    Write-Host "Starting HBuilderX..."
    Start-Process -FilePath $HBuilderXExe -WindowStyle Minimized
    Write-Host "Waiting for HBuilderX to initialize..."
    Start-Sleep -Seconds 10
  }

  Write-Host "Logging into DCloud..."
  & $CliExe user login --username $Username --password $Password
  Write-Host "Login complete! Run .\deploy-h5.ps1 to deploy."
  exit 0
}

# --- Deploy mode ---
Write-Step 1 3 "Build uni-app H5 assets..."
Push-Location $ProjectRoot
try {
  & npm.cmd run build:h5
  if ($LASTEXITCODE -ne 0) {
    throw "H5 build failed"
  }
}
finally {
  Pop-Location
}

if (-not (Test-Path $H5Dist)) {
  throw "H5 build output not found: $H5Dist"
}

# Check if HBuilderX CLI is available for full automation
$useCli = $false
if (Test-Path $CliExe) {
  Write-Step 2 3 "Deploy to uniCloud hosting via HBuilderX CLI..."

  # Start HBuilderX if not running
  if (-not (Get-Process -Name "HBuilderX" -ErrorAction SilentlyContinue)) {
    Write-Host "Starting HBuilderX in background..."
    Start-Process -FilePath $HBuilderXExe -WindowStyle Minimized
    Write-Host "Waiting for HBuilderX to initialize (10s)..."
    Start-Sleep -Seconds 10
  }

  Push-Location $ProjectRoot
  try {
    & $CliExe hosting deploy --provider $Provider --space $Space --source $H5Dist --prefix /
    if ($LASTEXITCODE -eq 0) {
      $useCli = $true
    }
    else {
      Write-Host "CLI deploy failed, falling back to manual upload."
    }
  }
  finally {
    Pop-Location
  }
}
else {
  Write-Host "HBuilderX CLI not found. Install it for full automation:"
  Write-Host "  1. Download HBuilderX: https://www.dcloud.io/hbuilderx.html"
  Write-Host "  2. Extract to: $HBuilderXRoot"
  Write-Host "  3. Login: .\deploy-h5.ps1 -Login -Username YOUR_ACCOUNT -Password YOUR_PASSWORD"
  Write-Host ""
}

if (-not $useCli) {
  Write-Step 2 3 "Open uniCloud console for manual upload..."
  Write-Step 3 3 "Complete the upload"

  Write-Host ""
  Write-Host "=== Manual upload steps ==="
  Write-Host "1. uniCloud hosting page opened in browser"
  Write-Host "2. File explorer opened at dist\build\h5\"
  Write-Host "3. Drag all files/folders into the web upload area:"
  Write-Host "   - index.html"
  Write-Host "   - assets/"
  Write-Host "   - static/"
  Write-Host ""

  Start-Process "https://unicloud.dcloud.net.cn/"
  Start-Process "explorer.exe" -ArgumentList $H5Dist
}

$url = "https://static-mp-70459e72-3958-42a0-9743-4e80b54716cd.next.bspapp.com"
Write-Host ""
Write-Host "Deploy ready!"
Write-Host "URL: $url"

if ($useCli) {
  Start-Process $url
}
