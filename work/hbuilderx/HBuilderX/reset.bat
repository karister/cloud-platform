

@echo off
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (goto UACPrompt) else ( goto gotAdmin )
:UACPrompt
echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"
"%temp%\getadmin.vbs"
exit /B
:gotAdmin
if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
pushd "%CD%"
CD /D "%~dp0"

set /p r="确认清除HBuilder X的所有配置吗? 按任意键回车继续，或输入N回车退出..."
if "%r%"=="" goto :nextstep
if /i %r%==n exit;
if /i %r%==N exit;

:nextstep
setlocal enabledelayedexpansion
echo 删除注册表信息

reg query HKEY_CURRENT_USER\SOFTWARE\Classes\*\shell\HBuilderX >nul 2>nul&&reg delete HKEY_CURRENT_USER\SOFTWARE\Classes\*\shell\HBuilderX /F
reg query HKEY_CURRENT_USER\SOFTWARE\Classes\Directory\shell\HBuilderX >nul 2>nul&&reg delete HKEY_CURRENT_USER\SOFTWARE\Classes\Directory\shell\HBuilderX /F

for /f "skip=2 delims=: tokens=1,*" %%i in ('reg query "HKEY_CURRENT_USER\SOFTWARE\Classes\.md" /ve') do ( 
    set str=%%i 
    for /f "tokens=3," %%a in ("%str%") do (
		@echo %%a
		if %%a == hbuilder.edit.md reg delete "HKEY_CURRENT_USER\SOFTWARE\Classes\.md" /ve /F;
	)
) 
for /f "skip=2 delims=: tokens=1,*" %%i in ('reg query "HKEY_CURRENT_USER\SOFTWARE\Classes\.txt" /ve') do ( 
    set str=%%i 
    for /f "tokens=3," %%a in ("%str%") do (
		if %%a == hbuilder.edit.txt reg delete "HKEY_CURRENT_USER\SOFTWARE\Classes\.txt" /ve /F;
	)
)




for %%A in (md txt json uvue css vue uts nvue) do (    
	
    	reg query HKEY_CURRENT_USER\SOFTWARE\Classes\hbuilder.edit.%%A >nul 2>nul && reg delete HKEY_CURRENT_USER\SOFTWARE\Classes\hbuilder.edit.%%A /F
    	
	reg query HKEY_CURRENT_USER\SOFTWARE\Classes\Applications\hbuilder.edit.%%A >nul 2>nul && reg delete HKEY_CURRENT_USER\SOFTWARE\Classes\Applications\hbuilder.edit.%%A /F
	
	reg query HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\FileExts\.%%A\OpenWithProgids\hbuilder.edit.%%A >nul 2>nul && reg delete HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\FileExts\.%%A\OpenWithProgids\hbuilder.edit.%%A /F
	
    	reg query HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\FileExts\.%%A\UserChoice >nul 2>nul && reg delete HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\FileExts\.%%A\UserChoice /F
    	
	reg query HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\Roaming\OpenWith\FileExts\.%%A\UserChoice >nul 2>nul && reg delete HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\Roaming\OpenWith\FileExts\.%%A\UserChoice /F
    	
	reg query HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\Roaming\OpenWith\FileExts\.%%A\OpenWithProgids\hbuilder.edit.%%A >nul 2>nul && reg delete HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\Roaming\OpenWith\FileExts\.%%A\OpenWithProgids\hbuilder.edit.%%A /F
	
    	reg query HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\FileExts\.%%A\OpenWithList >nul 2>&1
    	if !errorlevel! == 1 (	
        	for /f "tokens=*" %%a in ('reg query HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\FileExts\.%%A\OpenWithList ^| find "HBuilder X"') do (
            		reg delete "HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\FileExts\.%%A\OpenWithList" /v "%%a" /f
        	)
    	)
)

assoc .txt=txtfile  >nul 2
assoc .md=md_auto_file  >nul 2

echo 删除用户配置文件
if exist "%appdata%\HBuilder X" (rd /s /q "%appdata%\HBuilder X")


echo 重置完毕...
pause;

