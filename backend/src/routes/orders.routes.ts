import { Router } from 'express';
import { db } from '../lib/db.js';
import { authenticate } from '../lib/auth.js';
import { emailService } from '../services/email.service.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all orders
router.get('/', async (req, res) => {
  try {
    const { branchId, status, startDate, endDate } = req.query;

    const where: any = {};

    if (branchId) {
      where.branchId = branchId as string;
    }

    if (status) {
      where.status = status as string;
    }

    if (startDate || endDate) {
      where.orderDate = {};
      if (startDate) where.orderDate.gte = new Date(startDate as string);
      if (endDate) where.orderDate.lte = new Date(endDate as string);
    }

    const orders = await db.order.findMany({
      where,
      include: {
        branch: {
          select: {
            name: true,
            code: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: true,
      },
      orderBy: {
        orderDate: 'desc',
      },
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await db.order.findUnique({
      where: { id: req.params.id },
      include: {
        branch: true,
        user: true,
        items: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const { branchId, dispatchDate, items, notes } = req.body;
    const userId = (req as any).user.userId;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => {
      return sum + item.quantity * item.price;
    }, 0);

    // Create order with items
    const order = await db.order.create({
      data: {
        orderNumber,
        branchId,
        userId,
        dispatchDate: new Date(dispatchDate),
        totalAmount,
        notes,
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            itemName: item.itemName,
            quantity: item.quantity,
            unit: item.unit,
            price: item.price,
            total: item.quantity * item.price,
          })),
        },
      },
      include: {
        branch: true,
        items: true,
      },
    });

    // Send email notification
    const user = await db.user.findUnique({ where: { id: userId } });
    if (user?.email) {
      await emailService.sendOrderNotification(user.email, {
        orderNumber,
        branchName: order.branch.name,
        dispatchDate: order.dispatchDate,
        totalAmount: order.totalAmount,
      });
    }

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    const order = await db.order.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        branch: true,
        user: true,
      },
    });

    // Send dispatch notification if status changed to DISPATCHED
    if (status === 'DISPATCHED' && order.user.email) {
      const estimatedArrival = new Date(order.dispatchDate);
      estimatedArrival.setDate(estimatedArrival.getDate() + 1);

      await emailService.sendDispatchNotification(order.user.email, {
        orderNumber: order.orderNumber,
        branchName: order.branch.name,
        estimatedArrival,
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    await db.order.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// Get upcoming dispatch schedule
router.get('/schedule/upcoming', async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const orders = await db.order.findMany({
      where: {
        dispatchDate: {
          gte: today,
          lte: nextWeek,
        },
        status: {
          in: ['PENDING', 'APPROVED', 'IN_PROGRESS'],
        },
      },
      include: {
        branch: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        dispatchDate: 'asc',
      },
    });

    // Group by dispatch date
    const grouped = orders.reduce((acc: any, order) => {
      const date = order.dispatchDate.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(order);
      return acc;
    }, {});

    res.json(grouped);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dispatch schedule' });
  }
});

export const ordersRoutes = router;
