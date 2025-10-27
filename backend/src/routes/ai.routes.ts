import { Router } from 'express';
import { db } from '../lib/db.js';
import { authenticate, authorize } from '../lib/auth.js';
import { aiService } from '../services/ai.service.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all AI insights
router.get('/insights', async (req, res) => {
  try {
    const { type, isActive = 'true', limit = 20 } = req.query;

    const insights = await db.aIInsight.findMany({
      where: {
        type: type ? (type as any) : undefined,
        isActive: isActive === 'true',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: parseInt(limit as string),
    });

    res.json(insights);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

// Generate new insights (admin only)
router.post('/insights/generate', authorize('ADMIN', 'HEAD_OFFICE'), async (req, res) => {
  try {
    await aiService.generateInsights();

    const newInsights = await db.aIInsight.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    res.json({
      success: true,
      message: 'Insights generated successfully',
      insights: newInsights,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

// Mark insight as applied
router.patch('/insights/:id/apply', async (req, res) => {
  try {
    const insight = await db.aIInsight.update({
      where: { id: req.params.id },
      data: { isApplied: true },
    });

    res.json(insight);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update insight' });
  }
});

// Dismiss insight
router.patch('/insights/:id/dismiss', async (req, res) => {
  try {
    const insight = await db.aIInsight.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });

    res.json(insight);
  } catch (error) {
    res.status(500).json({ error: 'Failed to dismiss insight' });
  }
});

// Get sales forecast
router.get('/forecast', async (req, res) => {
  try {
    const { branchId, days = 7 } = req.query;

    const forecasts = await db.forecast.findMany({
      where: {
        branchId: branchId ? (branchId as string) : undefined,
        date: {
          gte: new Date(),
        },
      },
      orderBy: {
        date: 'asc',
      },
      take: parseInt(days as string),
    });

    // If no forecasts exist or they're outdated, generate new ones
    if (forecasts.length === 0) {
      await aiService.generateSalesForecast(branchId as string | undefined);

      const newForecasts = await db.forecast.findMany({
        where: {
          branchId: branchId ? (branchId as string) : undefined,
          date: {
            gte: new Date(),
          },
        },
        orderBy: {
          date: 'asc',
        },
        take: parseInt(days as string),
      });

      return res.json(newForecasts);
    }

    res.json(forecasts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch forecast' });
  }
});

// Generate new forecast (admin only)
router.post('/forecast/generate', authorize('ADMIN', 'HEAD_OFFICE'), async (req, res) => {
  try {
    const { branchId } = req.body;

    const forecasts = await aiService.generateSalesForecast(branchId);

    res.json({
      success: true,
      message: 'Forecast generated successfully',
      forecasts,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate forecast' });
  }
});

export const aiRoutes = router;
