# MikanaOS Backend API

Complete backend API for the MikanaOS Catering Management System with database, authentication, AI integration, SharePoint sync, and email notifications.

## Features

### Core API
- ✅ RESTful API with Express + TypeScript
- ✅ PostgreSQL database with Prisma ORM
- ✅ JWT authentication & role-based access control
- ✅ Input validation with Zod
- ✅ Request rate limiting
- ✅ Security best practices (Helmet, CORS)
- ✅ Comprehensive logging with Winston

### Integrations
- 🤖 **OpenAI Integration** - AI-powered insights, chat, and sales forecasting
- 📧 **Email Service** - Automated notifications via Resend
- 📊 **SharePoint Sync** - Automated daily data import from SharePoint
- ⏰ **Cron Jobs** - Scheduled tasks for sync, insights, and alerts

### Modules
- **Authentication** - User registration, login, JWT tokens
- **Inventory Management** - Real-time stock tracking
- **Order Management** - Weekly orders with dispatch scheduling
- **AI Insights** - Intelligent recommendations and predictions
- **Sales Forecasting** - AI-powered sales predictions
- **Analytics** - Comprehensive business metrics
- **Chat** - Team communication with AI assistant
- **Data Import** - Excel file upload and SharePoint sync

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcryptjs
- **AI**: OpenAI GPT-4
- **Email**: Resend
- **File Processing**: XLSX, Multer
- **Scheduling**: node-cron
- **Logging**: Winston

## Prerequisites

1. **Node.js 18+** and npm
2. **PostgreSQL 14+** database
3. **API Keys** (optional but recommended):
   - OpenAI API key (for AI features)
   - Resend API key (for email notifications)
   - SharePoint credentials (for automated sync)

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database (Required)
DATABASE_URL="postgresql://user:password@localhost:5432/mikanaos?schema=public"

# Server (Required)
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
FRONTEND_URL=http://localhost:5173

# SharePoint (Optional - for automated sync)
SHAREPOINT_TENANT_ID=your-tenant-id
SHAREPOINT_CLIENT_ID=your-client-id
SHAREPOINT_CLIENT_SECRET=your-client-secret
SHAREPOINT_SITE_URL=https://yourdomain.sharepoint.com/sites/yoursite

# OpenAI (Optional - for AI features)
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4-turbo-preview

# Resend (Optional - for email notifications)
RESEND_API_KEY=re_your-resend-api-key
EMAIL_FROM=noreply@mikanaos.com
```

### 3. Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed initial data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## Database Setup

### Using PostgreSQL

#### Option 1: Local PostgreSQL

```bash
# Install PostgreSQL
# Ubuntu/Debian
sudo apt-get install postgresql

# macOS
brew install postgresql

# Start PostgreSQL
sudo service postgresql start  # Linux
brew services start postgresql # macOS

# Create database
createdb mikanaos
```

#### Option 2: Docker

```bash
docker run --name mikanaos-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=mikanaos \
  -p 5432:5432 \
  -d postgres:14
```

Update your `DATABASE_URL`:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/mikanaos?schema=public"
```

#### Option 3: Cloud (Recommended for Production)

Use managed PostgreSQL from:
- **Supabase** (Free tier available) - https://supabase.com
- **Neon** (Serverless PostgreSQL) - https://neon.tech
- **Railway** - https://railway.app
- **AWS RDS**, **Google Cloud SQL**, **Azure Database**

### Database Commands

```bash
# Generate Prisma Client
npm run db:generate

# Push schema changes (development)
npm run db:push

# Create and run migrations (production)
npm run db:migrate

# Seed database with initial data
npm run db:seed

# Open Prisma Studio (visual database editor)
npm run db:studio
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Inventory
- `GET /api/inventory` - List inventory items
- `GET /api/inventory/:id` - Get single item
- `POST /api/inventory` - Create item
- `PATCH /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item
- `GET /api/inventory/alerts/low-stock` - Get low stock items

### Orders
- `GET /api/orders` - List orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order
- `GET /api/orders/schedule/upcoming` - Get dispatch schedule

### Chat
- `GET /api/chat/messages` - Get chat history
- `POST /api/chat/messages` - Send message (AI responds automatically)
- `GET /api/chat/users/online` - Get online users

### Data Import
- `GET /api/data-import/history` - Get import history
- `POST /api/data-import/upload` - Upload Excel file
- `POST /api/data-import/sharepoint/sync` - Trigger full SharePoint sync
- `POST /api/data-import/sharepoint/sync/:source` - Sync specific source
- `GET /api/data-import/sharepoint/status` - Get sync status

### AI & Insights
- `GET /api/ai/insights` - Get AI insights
- `POST /api/ai/insights/generate` - Generate new insights
- `PATCH /api/ai/insights/:id/apply` - Mark insight as applied
- `PATCH /api/ai/insights/:id/dismiss` - Dismiss insight
- `GET /api/ai/forecast` - Get sales forecast
- `POST /api/ai/forecast/generate` - Generate new forecast

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard statistics
- `GET /api/analytics/sales/by-branch` - Sales by branch
- `GET /api/analytics/sales/by-category` - Sales by category
- `GET /api/analytics/sales/trends` - Sales trends
- `GET /api/analytics/items/top` - Top performing items
- `GET /api/analytics/inventory/turnover` - Inventory turnover

## SharePoint Integration

### Setup Steps

1. **Register Azure AD Application**:
   - Go to Azure Portal > Azure Active Directory > App registrations
   - Click "New registration"
   - Name: "MikanaOS Data Sync"
   - Supported account types: "Single tenant"
   - Register

2. **Configure API Permissions**:
   - Go to API permissions
   - Add permission > Microsoft Graph > Application permissions
   - Add: `Sites.Read.All`, `Files.Read.All`
   - Grant admin consent

3. **Create Client Secret**:
   - Go to Certificates & secrets
   - New client secret
   - Copy the secret value (you won't see it again)

4. **Get Tenant and Client IDs**:
   - Tenant ID: Azure AD > Overview
   - Client ID: Your app > Overview

5. **Update .env**:
   ```env
   SHAREPOINT_TENANT_ID=your-tenant-id
   SHAREPOINT_CLIENT_ID=your-client-id
   SHAREPOINT_CLIENT_SECRET=your-client-secret
   SHAREPOINT_SITE_URL=https://yourdomain.sharepoint.com/sites/yoursite
   ```

6. **Configure File Paths** in `.env`:
   ```env
   SHAREPOINT_SALES_PATH=/Shared Documents/Data/Sales.xlsx
   SHAREPOINT_INVENTORY_PATH=/Shared Documents/Data/Inventory.xlsx
   # ... etc
   ```

### Testing SharePoint

```bash
# Test sync via API
curl -X POST http://localhost:3001/api/data-import/sharepoint/sync \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## OpenAI Integration

### Setup

1. Get API key from https://platform.openai.com/api-keys
2. Add to `.env`:
   ```env
   OPENAI_API_KEY=sk-your-key-here
   OPENAI_MODEL=gpt-4-turbo-preview
   ```

### Features

- **AI Chat**: Contextual responses to user questions
- **Insights Generation**: Automated recommendations every 6 hours
- **Sales Forecasting**: Predictive analytics for planning

### Testing AI

```bash
# Chat with AI
curl -X POST http://localhost:3001/api/chat/messages \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "What are our best-selling items?"}'

# Generate insights
curl -X POST http://localhost:3001/api/ai/insights/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Email Notifications

### Setup Resend

1. Sign up at https://resend.com
2. Get API key
3. Add to `.env`:
   ```env
   RESEND_API_KEY=re_your_key_here
   EMAIL_FROM=noreply@yourdomain.com
   ```

### Email Types

- Order confirmations
- Dispatch notifications
- Low stock alerts
- Weekly reports

### Custom Domain (Optional)

1. Add your domain in Resend dashboard
2. Add DNS records
3. Update `EMAIL_FROM` to use your domain

## Automated Tasks (Cron Jobs)

The system runs automated tasks:

| Task | Schedule | Description |
|------|----------|-------------|
| SharePoint Sync | Daily at midnight | Import latest data from SharePoint |
| AI Insights | Every 6 hours | Generate new business insights |
| Low Stock Alerts | Daily at 9 AM | Check and alert for low inventory |
| Weekly Reports | Monday at 8 AM | Send performance reports |

Configure schedule in `.env`:
```env
SYNC_SCHEDULE="0 0 * * *"  # Daily at midnight
```

## Default Users (After Seeding)

| Email | Password | Role |
|-------|----------|------|
| admin@mikanaos.com | admin123 | Admin |
| office@mikanaos.com | office123 | Head Office |
| manager1@mikanaos.com | manager123 | Branch Manager |
| manager2@mikanaos.com | manager123 | Branch Manager |

**⚠️ Change these passwords in production!**

## Security Best Practices

1. **Strong JWT Secret**: Use a random 32+ character string
2. **HTTPS**: Always use HTTPS in production
3. **Rate Limiting**: Configured to 100 requests per 15 minutes
4. **Input Validation**: All inputs validated with Zod
5. **Environment Variables**: Never commit `.env` to git
6. **Database**: Use connection pooling and SSL in production
7. **CORS**: Configure `FRONTEND_URL` correctly

## Production Deployment

### Environment Variables

```env
NODE_ENV=production
DATABASE_URL="postgresql://..."  # Use SSL
JWT_SECRET="..." # Strong random string
FRONTEND_URL=https://yourdomain.com
```

### Build

```bash
npm run build
npm start
```

### Deploy Options

- **Railway**: Easy deployment with PostgreSQL
- **Render**: Free tier available
- **Fly.io**: Global edge deployment
- **Heroku**: Classic platform
- **AWS/GCP/Azure**: Full control

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql -h localhost -U postgres -d mikanaos

# Check Prisma schema
npm run db:generate

# Reset database (⚠️ destructive)
npx prisma migrate reset
```

### SharePoint Sync Failures

- Verify Azure AD app permissions
- Check file paths in `.env`
- Test with Postman/curl
- Check logs in `logs/` directory

### OpenAI Rate Limits

- Use `gpt-3.5-turbo` for lower costs
- Implement caching for common queries
- Monitor usage in OpenAI dashboard

## Development

### Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration (env validation)
│   ├── lib/             # Utilities (db, auth, logger)
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic (AI, email, SharePoint)
│   ├── prisma/          # Database schema and seed
│   └── server.ts        # Main server file
├── logs/                # Application logs
├── prisma/
│   └── schema.prisma    # Database schema
└── package.json
```

### Adding New Endpoints

1. Create route file in `src/routes/`
2. Import in `server.ts`
3. Add route: `app.use('/api/your-route', yourRoutes)`

### Logs

Logs are stored in `logs/` directory:
- `all.log` - All logs
- `error.log` - Errors only

## Support

For issues or questions:
- Check logs: `tail -f logs/all.log`
- Database GUI: `npm run db:studio`
- API health: `http://localhost:3001/health`

## License

MIT - MikanaOS
