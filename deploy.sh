#!/bin/bash

# MikanaOS Deployment Script
# This script helps you deploy from Cursor to GitHub

echo "🚀 MikanaOS Deployment Script"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if git is initialized
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Git repository not initialized${NC}"
    echo "Please initialize git first: git init"
    exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes${NC}"
    echo ""
    echo "Current status:"
    git status --short
    echo ""
    read -p "Do you want to commit and push? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Cancelled${NC}"
        exit 0
    fi
    
    # Add all changes
    echo -e "${GREEN}📦 Staging all changes...${NC}"
    git add .
    
    # Commit with custom message
    echo ""
    read -p "Enter commit message: " COMMIT_MSG
    
    if [ -z "$COMMIT_MSG" ]; then
        COMMIT_MSG="chore: update project files"
    fi
    
    echo -e "${GREEN}💾 Committing changes...${NC}"
    git commit -m "$COMMIT_MSG"
else
    echo -e "${GREEN}✅ No uncommitted changes${NC}"
fi

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo ""
echo -e "Current branch: ${YELLOW}$CURRENT_BRANCH${NC}"

# Push to GitHub
echo ""
read -p "Push to GitHub? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}🚀 Pushing to GitHub...${NC}"
    git push origin $CURRENT_BRANCH
    echo ""
    echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Go to your GitHub repository"
    echo "2. Check the Actions tab to see the CI/CD pipeline"
    echo "3. Configure deployment in your hosting platform"
    echo ""
    echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
else
    echo -e "${YELLOW}Cancelled push${NC}"
fi

echo ""
echo -e "${GREEN}✨ Done!${NC}"

