# MikanaOS Complete Setup Guide

This guide will walk you through setting up the complete MikanaOS system with all integrations.

## Overview

MikanaOS consists of two parts:
1. **Frontend** - React + TypeScript application
2. **Backend** - Express API with database, AI, SharePoint, and email integrations

## Prerequisites

Before starting, ensure you have:

- ✅ **Node.js 18+** and npm
- ✅ **PostgreSQL 14+** database
- ✅ **Git** installed
- ⚠️ **API Keys** (optional but recommended for full functionality):
  - OpenAI API key
  - Resend email API key
  - SharePoint credentials

## Quick Start (5 Minutes)

### 1. Clone & Install

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Setup Backend

```bash
cd backend

# Copy environment template
cp .env.example .env

# Edit .env with your database URL (minimum required):
# DATABASE_URL="postgresql://user:password@localhost:5432/mikanaos?schema=public"
# JWT_SECRET="your-super-secret-key-minimum-32-characters-long-please"
# FRONTEND_URL="http://localhost:5173"

# Setup database
npm run db:generate
npm run db:push
npm run db:seed

# Start backend server
npm run dev
```

Backend will run on `http://localhost:3001`

### 3. Setup Frontend

```bash
# In the root directory
cp .env.example .env

# Start frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Login

Open `http://localhost:5173` and login with:
- **Email**: `admin@mikanaos.com`
- **Password**: `admin123`

🎉 **You're done!** The system is now running with demo data.

---

## Complete Setup (with All Integrations)

### Step 1: Database Setup

#### Option A: Local PostgreSQL

```bash
# Install PostgreSQL
# Ubuntu/Debian:
sudo apt-get install postgresql

# macOS:
brew install postgresql@14

# Start PostgreSQL
sudo service postgresql start  # Linux
brew services start postgresql@14  # macOS

# Create database
createdb mikanaos
```

Your `DATABASE_URL`:
```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/mikanaos?schema=public"
```

#### Option B: Docker PostgreSQL

```bash
docker run --name mikanaos-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=mikanaos \
  -p 5432:5432 \
  -d postgres:14-alpine
```

Your `DATABASE_URL`:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/mikanaos?schema=public"
```

#### Option C: Cloud Database (Recommended)

**Supabase** (Free tier):
1. Go to https://supabase.com
2. Create new project
3. Copy connection string from Settings > Database
4. Update `DATABASE_URL` in `.env`

**Neon** (Serverless):
1. Go to https://neon.tech
2. Create project
3. Copy connection string
4. Update `DATABASE_URL` in `.env`

### Step 2: Backend Configuration

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
# Database (REQUIRED)
DATABASE_URL="postgresql://user:password@localhost:5432/mikanaos?schema=public"

# Server (REQUIRED)
PORT=3001
NODE_ENV=development
JWT_SECRET="generate-a-random-32-character-string-here-please!"
FRONTEND_URL=http://localhost:5173

# OpenAI (Optional - enables AI features)
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# Resend Email (Optional - enables email notifications)
RESEND_API_KEY=re_your-key-here
EMAIL_FROM=noreply@yourdomain.com

# SharePoint (Optional - enables automated data sync)
SHAREPOINT_TENANT_ID=your-tenant-id
SHAREPOINT_CLIENT_ID=your-client-id
SHAREPOINT_CLIENT_SECRET=your-secret
SHAREPOINT_SITE_URL=https://yourdomain.sharepoint.com/sites/yoursite

# SharePoint file paths
SHAREPOINT_SALES_PATH=/Shared Documents/Data/Sales.xlsx
SHAREPOINT_INVENTORY_PATH=/Shared Documents/Data/Inventory.xlsx
SHAREPOINT_MANUFACTURING_PATH=/Shared Documents/Data/Manufacturing.xlsx
SHAREPOINT_PURCHASES_PATH=/Shared Documents/Data/Purchases.xlsx
SHAREPOINT_RECIPES_PATH=/Shared Documents/Data/Recipes.xlsx
SHAREPOINT_TRANSFERS_PATH=/Shared Documents/Data/Transfers.xlsx
SHAREPOINT_WASTE_PATH=/Shared Documents/Data/Waste.xlsx
```

### Step 3: Initialize Database

```bash
cd backend

# Generate Prisma client
npm run db:generate

# Create database schema
npm run db:push

# Seed with initial data
npm run db:seed
```

You should see:
```
✅ Created branches
✅ Created users
✅ Created suppliers
✅ Created inventory items
✅ Created sales data
...
🎉 Seeding completed successfully!
```

### Step 4: Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 3001
📝 Environment: development
🔗 API: http://localhost:3001/api
❤️  Health check: http://localhost:3001/health
```

Test the API:
```bash
curl http://localhost:3001/health
```

### Step 5: Frontend Configuration

```bash
# In root directory
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

### Step 6: Start Frontend

```bash
# In root directory
npm run dev
```

Frontend will open at `http://localhost:5173`

---

## Setting Up Integrations

### OpenAI Integration (AI Features)

**What it enables**:
- AI-powered chat assistant
- Automated business insights
- Sales forecasting

**Setup**:

1. Get API key:
   - Go to https://platform.openai.com/api-keys
   - Create new secret key
   - Copy the key

2. Update `backend/.env`:
   ```env
   OPENAI_API_KEY=sk-your-key-from-openai
   OPENAI_MODEL=gpt-4-turbo-preview
   ```

3. Restart backend server

4. Test in frontend:
   - Go to Chat page
   - Send a message
   - AI should respond

**Cost**: ~$0.01 per chat message with GPT-4

### Resend Email Integration

**What it enables**:
- Order confirmation emails
- Dispatch notifications
- Low stock alerts
- Weekly reports

**Setup**:

1. Sign up at https://resend.com (Free tier: 100 emails/day)

2. Get API key from dashboard

3. Update `backend/.env`:
   ```env
   RESEND_API_KEY=re_your_key_here
   EMAIL_FROM=noreply@yourdomain.com
   ```

4. (Optional) Add custom domain:
   - Add domain in Resend dashboard
   - Add DNS records
   - Update `EMAIL_FROM` to use your domain

5. Restart backend server

**Test**:
```bash
# Create an order via API to trigger email
curl -X POST http://localhost:3001/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "branchId": "BRANCH_ID",
    "dispatchDate": "2024-11-01",
    "items": [{"itemName": "Test", "quantity": 10, "unit": "kg", "price": 5}]
  }'
```

### SharePoint Integration

**What it enables**:
- Automated daily data sync
- Import Excel files from SharePoint
- Keep data always up-to-date

**Setup**:

1. **Register Azure AD Application**:

   a. Go to https://portal.azure.com

   b. Navigate to: Azure Active Directory > App registrations

   c. Click "New registration"
   - Name: "MikanaOS Data Sync"
   - Supported account types: "Single tenant"
   - Click "Register"

   d. Copy **Application (client) ID** and **Directory (tenant) ID**

2. **Create Client Secret**:

   a. Go to: Certificates & secrets

   b. Click "New client secret"

   c. Description: "MikanaOS Backend"

   d. Expiry: 24 months

   e. Copy the **secret value** (shown only once!)

3. **Set API Permissions**:

   a. Go to: API permissions

   b. Click "Add a permission"

   c. Choose "Microsoft Graph"

   d. Choose "Application permissions"

   e. Add these permissions:
      - `Sites.Read.All`
      - `Files.Read.All`

   f. Click "Grant admin consent"

4. **Get Site URL**:
   - Go to your SharePoint site
   - Copy the URL (e.g., `https://yourdomain.sharepoint.com/sites/yoursite`)

5. **Update backend/.env**:
   ```env
   SHAREPOINT_TENANT_ID=your-tenant-id-from-step-1
   SHAREPOINT_CLIENT_ID=your-client-id-from-step-1
   SHAREPOINT_CLIENT_SECRET=your-secret-from-step-2
   SHAREPOINT_SITE_URL=https://yourdomain.sharepoint.com/sites/yoursite

   # Update file paths to match your SharePoint structure
   SHAREPOINT_SALES_PATH=/Shared Documents/Data/Sales.xlsx
   SHAREPOINT_INVENTORY_PATH=/Shared Documents/Data/Inventory.xlsx
   # ... etc
   ```

6. **Prepare Excel Files**:

   Create folders and upload your Excel files to SharePoint:
   ```
   Site > Shared Documents > Data/
   ├── Sales.xlsx
   ├── Inventory.xlsx
   ├── Manufacturing.xlsx
   ├── Purchases.xlsx
   ├── Recipes.xlsx
   ├── Transfers.xlsx
   └── Waste.xlsx
   ```

   **Excel Format Requirements**:

   Sales.xlsx:
   ```
   | branchId | date       | amount | items | category     |
   |----------|------------|--------|-------|--------------|
   | BR001    | 2024-01-15 | 4200   | 12    | Main Courses |
   ```

   Inventory.xlsx:
   ```
   | branchId | itemName       | quantity | unit | status   | location     |
   |----------|----------------|----------|------|----------|--------------|
   | BR001    | Chicken Breast | 450      | kg   | IN_STOCK | Cold Storage |
   ```

7. **Test Sync**:
   ```bash
   # Via API
   curl -X POST http://localhost:3001/api/data-import/sharepoint/sync \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

8. **Automated Sync**:
   - Sync runs automatically daily at midnight
   - Configure schedule in `backend/.env`:
     ```env
     SYNC_SCHEDULE="0 0 * * *"  # Cron format
     ```

---

## Default Users

After seeding, you can login with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@mikanaos.com | admin123 |
| Head Office | office@mikanaos.com | office123 |
| Branch Manager | manager1@mikanaos.com | manager123 |
| Branch Manager | manager2@mikanaos.com | manager123 |

**⚠️ IMPORTANT**: Change these passwords in production!

To change a password:
```bash
# Using Prisma Studio
cd backend
npm run db:studio

# Or via API (when authenticated)
curl -X PATCH http://localhost:3001/api/users/me/password \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"oldPassword": "admin123", "newPassword": "NewSecure123!"}'
```

---

## Production Deployment

### Frontend (Vercel/Netlify)

```bash
# Build
npm run build

# Preview build
npm run preview
```

Deploy to:
- **Vercel**: Connect GitHub repo
- **Netlify**: Connect GitHub repo
- **Cloudflare Pages**: Connect GitHub repo

Environment variables to set:
```
VITE_API_URL=https://your-backend-api.com/api
```

### Backend (Railway/Render)

**Railway** (Recommended):

1. Create account at https://railway.app
2. New Project > Deploy from GitHub
3. Select backend directory
4. Add PostgreSQL service
5. Set environment variables (copy from `.env`)
6. Deploy

**Render**:

1. Create account at https://render.com
2. New > Web Service
3. Connect GitHub repo
4. Root Directory: `backend`
5. Build Command: `npm install && npm run build`
6. Start Command: `npm start`
7. Add PostgreSQL database
8. Set environment variables
9. Deploy

---

## Troubleshooting

### Backend won't start

```bash
# Check if PostgreSQL is running
pg_isready

# Check database connection
cd backend
npx prisma studio

# Check logs
tail -f backend/logs/all.log
```

### Frontend can't connect to backend

1. Check backend is running: `curl http://localhost:3001/health`
2. Check CORS settings in `backend/src/server.ts`
3. Check `VITE_API_URL` in frontend `.env`
4. Check browser console for errors

### Database errors

```bash
# Reset database (⚠️ deletes all data)
cd backend
npx prisma migrate reset

# Or recreate from scratch
npm run db:push
npm run db:seed
```

### SharePoint sync not working

1. Verify Azure AD permissions are granted
2. Check client secret hasn't expired
3. Test manually:
   ```bash
   curl -X POST http://localhost:3001/api/data-import/sharepoint/sync \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```
4. Check backend logs: `tail -f backend/logs/all.log`

### OpenAI not responding

1. Verify API key is correct
2. Check OpenAI dashboard for usage/limits
3. Try switching to `gpt-3.5-turbo` model
4. Check backend logs for error messages

---

## Next Steps

Once everything is running:

1. **Customize Branches**:
   - Update branch names/locations
   - Assign managers to branches

2. **Import Real Data**:
   - Upload your Excel files
   - Or set up SharePoint sync

3. **Configure Email Templates**:
   - Customize email content in `backend/src/services/email.service.ts`

4. **Adjust AI Prompts**:
   - Modify system prompts in `backend/src/services/ai.service.ts`

5. **Set Up Monitoring**:
   - Add error tracking (Sentry)
   - Set up uptime monitoring

6. **Backup Strategy**:
   - Configure database backups
   - Export data regularly

---

## Support

### Check System Health

```bash
# Backend health
curl http://localhost:3001/health

# Database GUI
cd backend && npm run db:studio

# View logs
tail -f backend/logs/all.log
```

### Getting Help

- **Documentation**: See `backend/README.md` for API details
- **Database**: Use Prisma Studio (`npm run db:studio`)
- **Logs**: Check `backend/logs/` directory

### Common Commands

```bash
# Backend
cd backend
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run db:studio    # Open database GUI
npm run db:seed      # Reset and seed database

# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## Security Checklist

Before going to production:

- [ ] Change all default passwords
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS
- [ ] Set `NODE_ENV=production`
- [ ] Use environment variables for all secrets
- [ ] Enable database SSL
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Enable database backups
- [ ] Set up monitoring and alerts

---

## Architecture

```
MikanaOS/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Page components
│   │   ├── lib/             # Utilities (API client)
│   │   └── store/           # State management
│   └── package.json
│
└── backend/                  # Express API
    ├── src/
    │   ├── routes/          # API endpoints
    │   ├── services/        # Business logic
    │   ├── lib/             # Utilities
    │   ├── config/          # Configuration
    │   └── prisma/          # Database schema
    ├── logs/                # Application logs
    └── package.json
```

---

Good luck with your MikanaOS deployment! 🚀
