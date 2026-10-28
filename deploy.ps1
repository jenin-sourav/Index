# Automated GitHub & Vercel Deploy Script for Apex International School

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Apex International School - Automated GitHub Deploy  " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Git is not installed or not in your system PATH." -ForegroundColor Red
    Write-Host "Please download Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Or install GitHub Desktop: https://desktop.github.com/" -ForegroundColor Yellow
    pause
    exit
}

Write-Host "[1/4] Initializing Git repository..." -ForegroundColor Green
if (-not (Test-Path ".git")) {
    git init
}

Write-Host "[2/4] Staging and committing files..." -ForegroundColor Green
git config user.name "Apex Admin"
git config user.email "admin@apex-intl.edu.bd"
git add .
git commit -m "feat: complete apex international school website and management system"

Write-Host "[3/4] Configure GitHub Remote" -ForegroundColor Green
$repoUrl = Read-Host "Enter your GitHub Repository URL (e.g. https://github.com/YourUsername/apex-school.git)"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "[ERROR] Repository URL cannot be empty." -ForegroundColor Red
    pause
    exit
}

git remote remove origin 2>$null
git remote add origin $repoUrl
git branch -M main

Write-Host "[4/4] Pushing code to GitHub main branch..." -ForegroundColor Green
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Code pushed to GitHub successfully!          " -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Opening Vercel in your browser..." -ForegroundColor Yellow
    Start-Process "https://vercel.com/new"
} else {
    Write-Host ""
    Write-Host "[NOTE] If git push asked for credentials, please sign in with your GitHub Personal Access Token." -ForegroundColor Yellow
}
