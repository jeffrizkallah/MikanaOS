import { Client } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential } from '@azure/identity';
import * as XLSX from 'xlsx';
import { env } from '../config/env.js';
import { db } from '../lib/db.js';
import { logger } from '../lib/logger.js';

export class SharePointService {
  private client: Client | null = null;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    if (
      !env.SHAREPOINT_TENANT_ID ||
      !env.SHAREPOINT_CLIENT_ID ||
      !env.SHAREPOINT_CLIENT_SECRET
    ) {
      logger.warn('SharePoint credentials not configured. Sync features will be disabled.');
      return;
    }

    try {
      const credential = new ClientSecretCredential(
        env.SHAREPOINT_TENANT_ID,
        env.SHAREPOINT_CLIENT_ID,
        env.SHAREPOINT_CLIENT_SECRET
      );

      this.client = Client.initWithMiddleware({
        authProvider: {
          getAccessToken: async () => {
            const token = await credential.getToken(
              'https://graph.microsoft.com/.default'
            );
            return token?.token || '';
          },
        },
      });

      logger.info('SharePoint client initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize SharePoint client:', error);
    }
  }

  async downloadFile(filePath: string): Promise<Buffer> {
    if (!this.client) {
      throw new Error('SharePoint client not initialized');
    }

    try {
      // Extract site details from URL
      const siteUrl = env.SHAREPOINT_SITE_URL;
      if (!siteUrl) {
        throw new Error('SharePoint site URL not configured');
      }

      // Download file content
      const response = await this.client
        .api(`/sites/${siteUrl}/drive/root:${filePath}:/content`)
        .get();

      return Buffer.from(response);
    } catch (error) {
      logger.error(`Failed to download file ${filePath}:`, error);
      throw error;
    }
  }

  async syncSalesData(): Promise<void> {
    try {
      const filePath = process.env.SHAREPOINT_SALES_PATH || '/Shared Documents/Data/Sales.xlsx';
      const buffer = await this.downloadFile(filePath);

      // Parse Excel file
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet) as any[];

      logger.info(`Processing ${data.length} sales records`);

      let imported = 0;
      let errors = [];

      for (const row of data) {
        try {
          await db.sale.create({
            data: {
              branchId: row.branchId || row.branch_id,
              saleDate: new Date(row.date || row.saleDate),
              amount: parseFloat(row.amount),
              items: parseInt(row.items || row.itemCount),
              category: row.category || 'General',
            },
          });
          imported++;
        } catch (error: any) {
          errors.push({ row, error: error.message });
        }
      }

      await db.dataImport.create({
        data: {
          source: 'SharePoint',
          fileName: filePath,
          records: imported,
          status: errors.length > 0 ? 'PARTIAL' : 'SUCCESS',
          errors: errors.length > 0 ? errors : undefined,
        },
      });

      logger.info(`Sales sync completed: ${imported} records imported`);
    } catch (error) {
      logger.error('Sales sync failed:', error);
      throw error;
    }
  }

  async syncInventoryData(): Promise<void> {
    try {
      const filePath = process.env.SHAREPOINT_INVENTORY_PATH || '/Shared Documents/Data/Inventory.xlsx';
      const buffer = await this.downloadFile(filePath);

      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet) as any[];

      logger.info(`Processing ${data.length} inventory records`);

      let imported = 0;

      for (const row of data) {
        try {
          await db.inventory.upsert({
            where: {
              id: row.id || `${row.branchId}-${row.itemName}`,
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
        } catch (error) {
          logger.error(`Failed to import inventory row:`, error);
        }
      }

      await db.dataImport.create({
        data: {
          source: 'SharePoint',
          fileName: filePath,
          records: imported,
          status: 'SUCCESS',
        },
      });

      logger.info(`Inventory sync completed: ${imported} records imported`);
    } catch (error) {
      logger.error('Inventory sync failed:', error);
      throw error;
    }
  }

  async syncAllData(): Promise<{ success: boolean; message: string }> {
    try {
      logger.info('Starting full data sync from SharePoint');

      await Promise.allSettled([
        this.syncSalesData(),
        this.syncInventoryData(),
        // Add more sync methods as needed
      ]);

      logger.info('Full data sync completed');
      return { success: true, message: 'All data synced successfully' };
    } catch (error: any) {
      logger.error('Full data sync failed:', error);
      return { success: false, message: error.message };
    }
  }
}

export const sharepointService = new SharePointService();
