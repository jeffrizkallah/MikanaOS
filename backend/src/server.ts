import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cron from 'node-cron';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { db } from './lib/db.js';

// Import routes
import { authRoutes } from './routes/auth.routes.js';
import { inventoryRoutes } from './routes/inventory.routes.js';
import { ordersRoutes } from './routes/orders.routes.js';
import { chatRoutes } from './routes/chat.routes.js';
import { dataImportRoutes } from './routes/data-import.routes.js';
import { aiRoutes } from './routes/ai.routes.js';
import { analyticsRoutes } from './routes/analytics.routes.js';

// Import services for cron jobs
import { sharepointService } from './services/sharepoint.service.js';
import { aiService } from './services/ai.service.js';
import { emailService } from './services/email.service.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/data-import', dataImportRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.status(500).json({
    error: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// Schedule automated tasks
function setupCronJobs() {
  // Daily SharePoint sync at midnight
  cron.schedule(env.SYNC_SCHEDULE, async () => {
    logger.info('Starting scheduled SharePoint sync...');
    try {
      await sharepointService.syncAllData();
      logger.info('Scheduled SharePoint sync completed');
    } catch (error) {
      logger.error('Scheduled SharePoint sync failed:', error);
    }
  });

  // Generate AI insights every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    logger.info('Generating AI insights...');
    try {
      await aiService.generateInsights();
      logger.info('AI insights generated successfully');
    } catch (error) {
      logger.error('AI insights generation failed:', error);
    }
  });

  // Check low stock and send alerts daily at 9 AM
  cron.schedule('0 9 * * *', async () => {
    logger.info('Checking for low stock items...');
    try {
      const lowStockItems = await db.inventory.findMany({
        where: { status: 'LOW_STOCK' },
        include: {
          branch: {
            select: { name: true },
          },
        },
      });

      if (lowStockItems.length > 0) {
        // Get admin/manager emails
        const managers = await db.user.findMany({
          where: {
            role: { in: ['ADMIN', 'HEAD_OFFICE'] },
            isActive: true,
          },
          select: { email: true },
        });

        const emails = managers.map((m) => m.email);

        if (emails.length > 0) {
          await emailService.sendLowStockAlert(
            emails,
            lowStockItems.map((item) => ({
              itemName: item.itemName,
              quantity: item.quantity,
              unit: item.unit,
              branchName: item.branch.name,
            }))
          );
        }

        logger.info(`Low stock alert sent for ${lowStockItems.length} items`);
      }
    } catch (error) {
      logger.error('Low stock check failed:', error);
    }
  });

  // Send weekly reports every Monday at 8 AM
  cron.schedule('0 8 * * 1', async () => {
    logger.info('Generating weekly reports...');
    try {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      const weekEnd = new Date();

      const sales = await db.sale.findMany({
        where: {
          saleDate: {
            gte: weekStart,
            lte: weekEnd,
          },
        },
      });

      const orders = await db.order.findMany({
        where: {
          orderDate: {
            gte: weekStart,
            lte: weekEnd,
          },
        },
        include: {
          items: true,
        },
      });

      // Calculate top items
      const itemCounts = orders
        .flatMap((o) => o.items)
        .reduce((acc: any, item) => {
          acc[item.itemName] = (acc[item.itemName] || 0) + item.quantity;
          return acc;
        }, {});

      const topItems = Object.entries(itemCounts)
        .map(([name, quantity]) => ({ name, quantity: quantity as number }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      const totalSales = sales.reduce((sum, s) => sum + s.amount, 0);

      // Send to all active users
      const users = await db.user.findMany({
        where: { isActive: true },
        select: { email: true },
      });

      for (const user of users) {
        await emailService.sendWeeklyReport(user.email, {
          weekStart,
          weekEnd,
          totalSales,
          totalOrders: orders.length,
          topItems,
        });
      }

      logger.info('Weekly reports sent successfully');
    } catch (error) {
      logger.error('Weekly report generation failed:', error);
    }
  });

  logger.info('Cron jobs scheduled successfully');
}

// Start server
async function startServer() {
  try {
    // Test database connection
    await db.$connect();
    logger.info('Database connected successfully');

    // Setup cron jobs
    setupCronJobs();

    // Start listening
    const port = parseInt(env.PORT);
    app.listen(port, () => {
      logger.info(`🚀 Server running on port ${port}`);
      logger.info(`📝 Environment: ${env.NODE_ENV}`);
      logger.info(`🔗 API: http://localhost:${port}/api`);
      logger.info(`❤️  Health check: http://localhost:${port}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  await db.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  await db.$disconnect();
  process.exit(0);
});

// Start the server
startServer();
