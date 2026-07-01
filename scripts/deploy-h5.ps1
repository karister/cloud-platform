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
$EnvFile = Join-Path $ProjectRoot ".env"

function Write-Step($Step, $Total, $Message) {
  Write-Host "$Step/$Total $Message"
}

function Import-DotEnv($Path) {
  if (-not (Test-Path $Path)) {
    return
  }

  Get-Content $Path | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith("#")) {
      return
    }

    $idx = $line.IndexOf("=")
    if ($idx -le 0) {
      return
    }

    $key = $line.Substring(0, $idx).Trim()
    $value = $line.Substring($idx + 1).Trim()
    if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
      $value = $value.Substring(1, $value.Length - 2)
    }

    if (-not [Environment]::GetEnvironmentVariable($key, "Process")) {
      [Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
  }
}

function Ensure-HBuilderXRunning() {
  if (-not (Test-Path $CliExe)) {
    Write-Host "HBuilderX CLI not found at: $CliExe"
    Write-Host "Download HBuilderX zip and extract to: $HBuilderXRoot"
    Start-Process "https://www.dcloud.io/hbuilderx.html"
    exit 1
  }

  if (-not (Get-Process -Name "HBuilderX" -ErrorAction SilentlyContinue)) {
    Write-Host "Starting HBuilderX..."
    & $CliExe open
    Write-Host "Waiting for HBuilderX to initialize..."
    Start-Sleep -Seconds 10
  }
}

function Ensure-HBuilderXPlugin($Name) {
  $pluginPath = Join-Path $HBuilderXRoot "plugins\$Name"
  if (Test-Path $pluginPath) {
    return
  }

  Write-Host "Installing HBuilderX plugin: $Name..."
  & $CliExe installPlugin --name $Name --force true
  if ($LASTEXITCODE -ne 0 -or -not (Test-Path $pluginPath)) {
    throw "Failed to install HBuilderX plugin: $Name"
  }
}

Import-DotEnv $EnvFile

if (-not $Username) {
  $Username = $env:DCLOUD_USERNAME
}
if (-not $Password) {
  $Password = $env:DCLOUD_PASSWORD
}
if ($env:DCLOUD_SPACE_ID) {
  $Space = $env:DCLOUD_SPACE_ID
}
if ($env:DCLOUD_PROVIDER) {
  $Provider = $env:DCLOUD_PROVIDER
}

$url = "https://static-mp-70459e72-3958-42a0-9743-4e80b54716cd.next.bspapp.com"

# --- Login mode ---
if ($Login) {
  if (-not $Username -or -not $Password) {
    Write-Host "Usage: .\deploy-h5.ps1 -Login -Username YOUR_ACCOUNT -Password YOUR_PASSWORD"
    Write-Host "  Or set DCLOUD_USERNAME and DCLOUD_PASSWORD in .env."
    exit 1
  }

  Ensure-HBuilderXRunning

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

  Ensure-HBuilderXRunning
  Ensure-HBuilderXPlugin "unicloud"
  if ($Username -and $Password) {
    Write-Host "Logging into DCloud from local credentials..."
    & $CliExe user login --username $Username --password $Password
  }

  Push-Location $ProjectRoot
  try {
    & $CliExe project open --path $ProjectRoot
    $publishOutput = & $CliExe publish web --project $ProjectRoot --platform Web --webTitle "云平台数据通信" --webHosting true --provider $Provider --spaceId $Space 2>&1
    $publishExitCode = $LASTEXITCODE
    $publishOutput | ForEach-Object { Write-Host $_ }
    $publishText = $publishOutput -join "`n"
    if ($publishExitCode -eq 0 -and $publishText.Contains($url)) {
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

Write-Host ""
if ($useCli) {
  Write-Host "Deploy complete!"
}
else {
  Write-Host "Build ready for manual upload."
}
Write-Host "URL: $url"

if ($useCli) {
  Start-Process $url
}
