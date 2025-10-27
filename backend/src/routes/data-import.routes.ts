import { Router } from 'express';
import multer from 'multer';
import * as XLSX from 'xlsx';
import { db } from '../lib/db.js';
import { authenticate, authorize } from '../lib/auth.js';
import { sharepointService } from '../services/sharepoint.service.js';
import { logger } from '../lib/logger.js';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only Excel and CSV files are allowed.'));
    }
  },
});

// All routes require authentication
router.use(authenticate);

// Get import history
router.get('/history', async (req, res) => {
  try {
    const { source, limit = 50 } = req.query;

    const imports = await db.dataImport.findMany({
      where: source ? { source: source as string } : undefined,
      orderBy: {
        importedAt: 'desc',
      },
      take: parseInt(limit as string),
    });

    res.json(imports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch import history' });
  }
});

// Upload and import Excel file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { dataType } = req.body; // sales, inventory, etc.

    if (!dataType) {
      return res.status(400).json({ error: 'Data type is required' });
    }

    // Parse Excel file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    logger.info(`Processing ${data.length} records from ${req.file.originalname}`);

    let imported = 0;
    let errors: any[] = [];

    // Process based on data type
    switch (dataType) {
      case 'sales':
        for (const row of data as any[]) {
          try {
            await db.sale.create({
              data: {
                branchId: row.branchId || row.branch_id,
                saleDate: new Date(row.date || row.saleDate),
                amount: parseFloat(row.amount),
                items: parseInt(row.items || row.itemCount || 0),
                category: row.category || 'General',
              },
            });
            imported++;
          } catch (error: any) {
            errors.push({ row, error: error.message });
          }
        }
        break;

      case 'inventory':
        for (const row of data as any[]) {
          try {
            await db.inventory.upsert({
              where: {
                id: row.id || `${row.branchId}-${row.itemName}-${Date.now()}`,
              },
              update: {
                quantity: parseFloat(row.quantity),
                status: row.status || 'IN_STOCK',
                lastUpdated: new Date(),
              },
              create: {
                itemName: row.itemName || row.item_name,
                quantity: parseFloat(row.quantity),
                unit: row.unit,
                location: row.location || 'Main Storage',
                branchId: row.branchId || row.branch_id,
                status: row.status || 'IN_STOCK',
              },
            });
            imported++;
          } catch (error: any) {
            errors.push({ row, error: error.message });
          }
        }
        break;

      default:
        return res.status(400).json({ error: 'Unsupported data type' });
    }

    // Log import
    const importRecord = await db.dataImport.create({
      data: {
        source: 'Manual Upload',
        fileName: req.file.originalname,
        records: imported,
        status: errors.length > 0 ? 'PARTIAL' : 'SUCCESS',
        errors: errors.length > 0 ? errors : undefined,
      },
    });

    res.json({
      success: true,
      imported,
      totalRows: data.length,
      errors: errors.length,
      importRecord,
    });
  } catch (error: any) {
    logger.error('File upload failed:', error);
    res.status(500).json({ error: 'Failed to process file' });
  }
});

// Trigger SharePoint sync (admin only)
router.post('/sharepoint/sync', authorize('ADMIN', 'HEAD_OFFICE'), async (req, res) => {
  try {
    const result = await sharepointService.syncAllData();

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: 'SharePoint sync failed', details: error.message });
  }
});

// Sync specific data source
router.post('/sharepoint/sync/:source', authorize('ADMIN', 'HEAD_OFFICE'), async (req, res) => {
  try {
    const { source } = req.params;

    let result;

    switch (source) {
      case 'sales':
        await sharepointService.syncSalesData();
        result = { success: true, message: 'Sales data synced' };
        break;

      case 'inventory':
        await sharepointService.syncInventoryData();
        result = { success: true, message: 'Inventory data synced' };
        break;

      default:
        return res.status(400).json({ error: 'Unsupported data source' });
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: 'Sync failed', details: error.message });
  }
});

// Get sync status
router.get('/sharepoint/status', async (req, res) => {
  try {
    const recentImports = await db.dataImport.findMany({
      where: {
        source: 'SharePoint',
      },
      orderBy: {
        importedAt: 'desc',
      },
      take: 7, // Last 7 sources
    });

    // Group by file name/source
    const statusBySource = recentImports.reduce((acc: any, imp) => {
      const sourceName = imp.fileName.split('/').pop()?.replace('.xlsx', '') || imp.fileName;
      if (!acc[sourceName]) {
        acc[sourceName] = imp;
      }
      return acc;
    }, {});

    res.json(statusBySource);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sync status' });
  }
});

export const dataImportRoutes = router;
