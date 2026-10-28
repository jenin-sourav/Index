@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo   Apex International School - Automated GitHub Deploy
echo ========================================================
echo.

:: Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in your system PATH.
    echo Please download and install Git from: https://git-scm.com/download/win
    echo (Or use GitHub Desktop: https://desktop.github.com/)
    echo.
    pause
    exit /b 1
)

echo [1/4] Initializing Git repository...
if not exist .git (
    git init
)

echo [2/4] Staging and committing files...
git config user.name "Apex Admin"
git config user.email "admin@apex-intl.edu.bd"
git add .
git commit -m "feat: complete apex international school website and management system"

echo [3/4] Configure GitHub Remote
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/YourUsername/apex-school.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] Repository URL cannot be empty.
    pause
    exit /b 1
)

git remote remove origin >nul 2>nul
git remote add origin %REPO_URL%
git branch -M main

echo [4/4] Pushing code to GitHub main branch...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo   SUCCESS! Code pushed to GitHub successfully!
    echo ========================================================
    echo.
    echo Opening Vercel New Project page in your browser...
    start https://vercel.com/new
    echo.
    echo In Vercel:
    echo 1. Click "Import" next to your GitHub repository.
    echo 2. Add Environment Variable: SESSION_SECRET = apex_intl_school_super_secret_session_key_2026_bd_asia_dhaka
    echo 3. Click "Deploy"!
) else (
    echo.
    echo [NOTE] If git push asked for credentials, please sign in with your GitHub Personal Access Token.
)

echo.
pause
