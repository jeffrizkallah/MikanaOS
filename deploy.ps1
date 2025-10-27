# MikanaOS Deployment Script for Windows
# This script helps you deploy from Cursor to GitHub

Write-Host "🚀 MikanaOS Deployment Script" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (git rev-parse --git-dir 2>$null)) {
    Write-Host "❌ Git repository not initialized" -ForegroundColor Red
    Write-Host "Please initialize git first: git init" -ForegroundColor Yellow
    exit 1
}

# Check for uncommitted changes
$changes = git status --porcelain
if ($changes) {
    Write-Host "⚠️  You have uncommitted changes" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Current status:"
    git status --short
    Write-Host ""
    $response = Read-Host "Do you want to commit and push? (y/n)"
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "Cancelled" -ForegroundColor Yellow
        exit 0
    }
    
    # Add all changes
    Write-Host "📦 Staging all changes..." -ForegroundColor Green
    git add .
    
    # Commit with custom message
    Write-Host ""
    $commitMsg = Read-Host "Enter commit message"
    
    if ([string]::IsNullOrWhiteSpace($commitMsg)) {
        $commitMsg = "chore: update project files"
    }
    
    Write-Host "💾 Committing changes..." -ForegroundColor Green
    git commit -m $commitMsg
} else {
    Write-Host "✅ No uncommitted changes" -ForegroundColor Green
}

# Get current branch
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host ""
Write-Host "Current branch: $currentBranch" -ForegroundColor Yellow

# Push to GitHub
Write-Host ""
$pushResponse = Read-Host "Push to GitHub? (y/n)"
if ($pushResponse -eq "y" -or $pushResponse -eq "Y") {
    Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Green
    git push origin $currentBranch
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "1. Go to your GitHub repository"
    Write-Host "2. Check the Actions tab to see the CI/CD pipeline"
    Write-Host "3. Configure deployment in your hosting platform"
    Write-Host ""
    Write-Host "📖 See DEPLOYMENT_GUIDE.md for detailed instructions" -ForegroundColor Cyan
} else {
    Write-Host "Cancelled push" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✨ Done!" -ForegroundColor Green

