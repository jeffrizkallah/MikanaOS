# Quick Deploy from Cursor to GitHub

## 🎯 Three Ways to Deploy

### Option 1: PowerShell Script (Windows) ⚡ **EASIEST**
```powershell
.\deploy.ps1
```

### Option 2: Git Commands (Manual)
```powershell
git add .
git commit -m "feat: your changes"
git push origin master
```

### Option 3: Bash Script (If using WSL)
```bash
bash deploy.sh
```

## 🚀 What Happens Next?

After pushing to GitHub:

1. **GitHub Actions runs automatically** ✅
   - Builds your frontend
   - Tests your backend
   - Uploads build artifacts

2. **Deploy to hosting platforms**:
   - Frontend: Vercel, Netlify, or Cloudflare Pages
   - Backend: Railway, Render, or Fly.io

## 📋 Quick Checklist

Before deploying:
- [ ] All code is ready to commit
- [ ] `.env` files are **NOT** committed (they're in `.gitignore`)
- [ ] You have a GitHub repository at: https://github.com/jeffrizkallah/MikanaOS.git

To deploy:
- [ ] Run `.\deploy.ps1` OR `git add . && git commit -m "..." && git push`
- [ ] Check GitHub Actions tab for build status
- [ ] Configure production environment variables
- [ ] Deploy to your hosting platforms

## 🔧 Production Setup

After deploying to GitHub, set up:

### Frontend Hosting (Choose one)
- **Vercel** (easiest): Connect repo, auto-deploy
- **Netlify**: Connect repo, set build to `npm run build`
- **Cloudflare Pages**: Connect repo, auto-deploy

### Backend Hosting (Choose one)
- **Railway**: Connect repo, add PostgreSQL service
- **Render**: Connect repo, set start command to `cd backend && npm start`
- **Fly.io**: More control, great performance

### Environment Variables Needed

Add these to your hosting platforms:

#### Frontend:
```
VITE_API_URL=https://your-backend-url.com
```

#### Backend:
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-strong-secret
FRONTEND_URL=https://your-frontend.com
PORT=3001
NODE_ENV=production
```

## 📖 Full Guide

For detailed instructions, see: **DEPLOYMENT_GUIDE.md**

## ⚡ Need Help?

- GitHub Actions workflow: `.github/workflows/deploy.yml`
- Deployment guide: `DEPLOYMENT_GUIDE.md`
- Backend setup: `backend/README.md`

## 🎉 You're All Set!

The deployment workflow is configured. Just push your code and follow the steps above.

