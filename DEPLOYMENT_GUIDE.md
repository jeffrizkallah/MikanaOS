# MikanaOS Deployment Guide

Complete guide for deploying MikanaOS to production from Cursor to GitHub.

## 🚀 Quick Deploy from Cursor

### Prerequisites
1. Ensure your code is ready to commit
2. Make sure all `.env` files are properly configured (never commit them)
3. Verify your GitHub repository is set up

### Step-by-Step Deployment

#### 1. Check Git Status
```bash
git status
```

#### 2. Add All Changes
```bash
git add .
```

#### 3. Commit Changes
```bash
git commit -m "feat: your descriptive commit message"
```

#### 4. Push to GitHub
```bash
git push origin master
```

Or if using main branch:
```bash
git push origin main
```

## 📁 Environment Files Setup

### Required Files
Create these files with your actual credentials:

**Root `.env.example`**:
```env
# Frontend Configuration
VITE_API_URL=http://localhost:3001
```

**Backend `.env`** (in `backend/` directory):
```env
# Database (Required)
DATABASE_URL="postgresql://user:password@localhost:5432/mikanaos?schema=public"

# Server (Required)
PORT=3001
NODE_ENV=production
JWT_SECRET=your-strong-secret-32-chars-minimum
FRONTEND_URL=https://your-frontend-domain.com

# SharePoint (Optional)
SHAREPOINT_TENANT_ID=your-tenant-id
SHAREPOINT_CLIENT_ID=your-client-id
SHAREPOINT_CLIENT_SECRET=your-client-secret
SHAREPOINT_SITE_URL=https://yourdomain.sharepoint.com/sites/yoursite

# OpenAI (Optional)
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4-turbo-preview

# Resend (Optional)
RESEND_API_KEY=re_your-resend-api-key
EMAIL_FROM=noreply@yourdomain.com
```

## 🔧 GitHub Actions CI/CD

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:
- ✅ Builds and tests the frontend on every push
- ✅ Builds and tests the backend on every push
- ✅ Provides manual deployment trigger
- ✅ Uploads build artifacts

### Enabling GitHub Actions

1. Go to your GitHub repository
2. Navigate to: **Settings > Secrets and variables > Actions**
3. Add these secrets:
   - `DATABASE_URL` - Your production PostgreSQL connection string
   - `JWT_SECRET` - Your secret key for JWT tokens
   - `FRONTEND_URL` - Your production frontend URL

### Triggering Deployment

The workflow runs automatically on:
- Push to `main` or `master` branches
- Pull requests to `main` or `master`
- Manual trigger via GitHub Actions UI

## 🎯 Production Deployment Options

### Frontend Deployment

#### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd .
vercel --prod

# Configure environment
vercel env add VITE_API_URL production
```

#### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist

# Configure environment variables in Netlify dashboard
```

#### Option 3: Cloudflare Pages
```bash
# Install Wrangler
npm i -g wrangler

# Deploy
npx wrangler pages deploy dist --project-name=mikanaos
```

### Backend Deployment

#### Option 1: Railway (Recommended)
1. Connect your GitHub repo to Railway
2. Railway auto-detects Node.js projects
3. Add environment variables in Railway dashboard
4. Deploy automatically on push

#### Option 2: Render
1. Connect your GitHub repo to Render
2. Create new Web Service
3. Set build command: `cd backend && npm install && npm run build`
4. Set start command: `cd backend && npm start`
5. Add environment variables

#### Option 3: Fly.io
```bash
# Install Fly CLI
fly auth login

# Create app
cd backend
fly launch

# Set secrets
fly secrets set DATABASE_URL="..."
fly secrets set JWT_SECRET="..."

# Deploy
fly deploy
```

## 🗄️ Database Setup

### Production Database Options

1. **Supabase** (Free tier available)
   - Go to https://supabase.com
   - Create new project
   - Copy connection string to `DATABASE_URL`

2. **Neon** (Serverless PostgreSQL)
   - Go to https://neon.tech
   - Create project
   - Get connection string

3. **Railway PostgreSQL**
   - Add PostgreSQL service in Railway
   - Use provided connection string

4. **AWS RDS / Google Cloud SQL / Azure**
   - Set up managed PostgreSQL
   - Enable SSL connections
   - Get connection string

### Run Migrations in Production
```bash
# In your backend deployment
cd backend
npm run db:generate
npm run db:push
npm run db:seed
```

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change all default passwords in database seed
- [ ] Use strong `JWT_SECRET` (minimum 32 characters, random)
- [ ] Enable HTTPS for frontend and backend
- [ ] Configure CORS properly with `FRONTEND_URL`
- [ ] Use environment-specific database URLs
- [ ] Enable database SSL connections
- [ ] Set up proper backup strategy
- [ ] Configure rate limiting
- [ ] Remove or secure admin endpoints
- [ ] Add monitoring and logging

## 📊 Monitoring

### Recommended Tools
- **Sentry** - Error tracking
- **LogRocket** - Session replay and logging
- **PostHog** - Analytics
- **UptimeRobot** - Uptime monitoring

### Health Check Endpoints
- Frontend: Your deployed domain
- Backend: `https://your-api.com/health`

## 🔄 Automated CI/CD Pipeline

The GitHub Actions workflow:
1. Runs on every push to `main`/`master`
2. Builds frontend and backend
3. Runs tests (add your test commands)
4. Uploads artifacts
5. Ready for manual deployment trigger

### Customizing the Workflow

Edit `.github/workflows/deploy.yml` to add:
- Linting
- Unit tests
- E2E tests
- Automatic deployment on merge

## 🐛 Troubleshooting

### Build Fails
- Check Node.js version (requires 18+)
- Verify all dependencies are in `package.json`
- Check for TypeScript errors

### Database Connection Fails
- Verify `DATABASE_URL` is correct
- Check SSL requirements
- Ensure database is accessible from hosting platform

### Environment Variables Missing
- Add all required variables to your hosting platform
- Check variable names match exactly
- Restart after adding variables

### Frontend Can't Connect to Backend
- Verify `VITE_API_URL` is correct
- Check CORS configuration in backend
- Ensure backend is deployed and accessible

## 📝 Deployment Checklist

### Before First Deployment
- [ ] Set up production database
- [ ] Configure all environment variables
- [ ] Update `FRONTEND_URL` in backend `.env`
- [ ] Update `VITE_API_URL` in frontend `.env`
- [ ] Build and test locally
- [ ] Commit and push to GitHub

### Deployment Steps
- [ ] Push code to GitHub
- [ ] Set up hosting platforms
- [ ] Configure environment variables
- [ ] Deploy backend first
- [ ] Test backend health endpoint
- [ ] Deploy frontend
- [ ] Test full application

### After Deployment
- [ ] Verify all features work
- [ ] Test authentication
- [ ] Check database connections
- [ ] Monitor logs for errors
- [ ] Set up backups
- [ ] Configure monitoring

## 🎉 Success!

Your MikanaOS deployment is complete. Monitor logs and performance to ensure smooth operation.

---

For issues or questions, refer to the main README or backend README.

