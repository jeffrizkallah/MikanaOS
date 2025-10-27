import { Router } from 'express';
import { db } from '../lib/db.js';
import { authenticate } from '../lib/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const { branchId, status, search } = req.query;

    const where: any = {};

    if (branchId) {
      where.branchId = branchId as string;
    }

    if (status) {
      where.status = status as string;
    }

    if (search) {
      where.itemName = {
        contains: search as string,
        mode: 'insensitive',
      };
    }

    const items = await db.inventory.findMany({
      where,
      include: {
        branch: {
          select: {
            name: true,
            code: true,
          },
        },
      },
      orderBy: {
        lastUpdated: 'desc',
      },
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// Get single inventory item
router.get('/:id', async (req, res) => {
  try {
    const item = await db.inventory.findUnique({
      where: { id: req.params.id },
      include: {
        branch: true,
      },
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Create inventory item
router.post('/', async (req, res) => {
  try {
    const item = await db.inventory.create({
      data: req.body,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Update inventory item
router.patch('/:id', async (req, res) => {
  try {
    const item = await db.inventory.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        lastUpdated: new Date(),
      },
    });

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete inventory item
router.delete('/:id', async (req, res) => {
  try {
    await db.inventory.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Get low stock items
router.get('/alerts/low-stock', async (req, res) => {
  try {
    const items = await db.inventory.findMany({
      where: {
        status: 'LOW_STOCK',
      },
      include: {
        branch: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch low stock items' });
  }
});

export const inventoryRoutes = router;
