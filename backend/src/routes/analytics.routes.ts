import { Router } from 'express';
import { db } from '../lib/db.js';
import { authenticate } from '../lib/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const { branchId, startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    const where: any = {
      saleDate: {
        gte: start,
        lte: end,
      },
    };

    if (branchId) {
      where.branchId = branchId as string;
    }

    // Total sales
    const sales = await db.sale.findMany({ where });
    const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
    const totalItems = sales.reduce((sum, sale) => sum + sale.items, 0);

    // Orders statistics
    const orders = await db.order.findMany({
      where: {
        ...where,
        orderDate: where.saleDate,
      },
    });

    // Inventory alerts
    const lowStock = await db.inventory.count({
      where: { status: 'LOW_STOCK' },
    });

    const outOfStock = await db.inventory.count({
      where: { status: 'OUT_OF_STOCK' },
    });

    res.json({
      totalSales,
      totalOrders: orders.length,
      averageOrderValue: orders.length > 0 ? totalSales / orders.length : 0,
      totalItems,
      lowStockItems: lowStock,
      outOfStockItems: outOfStock,
      period: {
        start,
        end,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Get sales by branch
router.get('/sales/by-branch', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    const sales = await db.sale.findMany({
      where: {
        saleDate: {
          gte: start,
          lte: end,
        },
      },
      include: {
        branch: {
          select: {
            name: true,
            code: true,
          },
        },
      },
    });

    // Group by branch
    const byBranch = sales.reduce((acc: any, sale) => {
      const branchName = sale.branch.name;
      if (!acc[branchName]) {
        acc[branchName] = {
          branchName,
          branchCode: sale.branch.code,
          totalSales: 0,
          orderCount: 0,
        };
      }
      acc[branchName].totalSales += sale.amount;
      acc[branchName].orderCount += 1;
      return acc;
    }, {});

    res.json(Object.values(byBranch));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales by branch' });
  }
});

// Get sales by category
router.get('/sales/by-category', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    const sales = await db.sale.findMany({
      where: {
        saleDate: {
          gte: start,
          lte: end,
        },
      },
    });

    // Group by category
    const byCategory = sales.reduce((acc: any, sale) => {
      const category = sale.category;
      if (!acc[category]) {
        acc[category] = {
          category,
          totalSales: 0,
          count: 0,
        };
      }
      acc[category].totalSales += sale.amount;
      acc[category].count += 1;
      return acc;
    }, {});

    res.json(Object.values(byCategory));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales by category' });
  }
});

// Get sales trends (daily)
router.get('/sales/trends', async (req, res) => {
  try {
    const { branchId, days = 30 } = req.query;

    const start = new Date(Date.now() - parseInt(days as string) * 24 * 60 * 60 * 1000);

    const sales = await db.sale.findMany({
      where: {
        branchId: branchId ? (branchId as string) : undefined,
        saleDate: {
          gte: start,
        },
      },
      orderBy: {
        saleDate: 'asc',
      },
    });

    // Group by day
    const byDay = sales.reduce((acc: any, sale) => {
      const day = sale.saleDate.toISOString().split('T')[0];
      if (!acc[day]) {
        acc[day] = {
          date: day,
          totalSales: 0,
          count: 0,
        };
      }
      acc[day].totalSales += sale.amount;
      acc[day].count += 1;
      return acc;
    }, {});

    res.json(Object.values(byDay));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales trends' });
  }
});

// Get top performing items
router.get('/items/top', async (req, res) => {
  try {
    const { limit = 10, startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    const orders = await db.order.findMany({
      where: {
        orderDate: {
          gte: start,
          lte: end,
        },
      },
      include: {
        items: true,
      },
    });

    // Aggregate items
    const itemStats = orders
      .flatMap((order) => order.items)
      .reduce((acc: any, item) => {
        if (!acc[item.itemName]) {
          acc[item.itemName] = {
            itemName: item.itemName,
            totalQuantity: 0,
            totalRevenue: 0,
            orderCount: 0,
          };
        }
        acc[item.itemName].totalQuantity += item.quantity;
        acc[item.itemName].totalRevenue += item.total;
        acc[item.itemName].orderCount += 1;
        return acc;
      }, {});

    const topItems = Object.values(itemStats)
      .sort((a: any, b: any) => b.totalRevenue - a.totalRevenue)
      .slice(0, parseInt(limit as string));

    res.json(topItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top items' });
  }
});

// Get inventory turnover rate
router.get('/inventory/turnover', async (req, res) => {
  try {
    const { branchId } = req.query;

    const inventory = await db.inventory.findMany({
      where: branchId ? { branchId: branchId as string } : undefined,
    });

    // Calculate turnover (simplified - in production you'd track actual usage)
    const turnover = inventory.map((item) => ({
      itemName: item.itemName,
      currentStock: item.quantity,
      unit: item.unit,
      status: item.status,
      // Turnover calculation would go here based on historical data
    }));

    res.json(turnover);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory turnover' });
  }
});

export const analyticsRoutes = router;
