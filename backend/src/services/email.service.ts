import { Resend } from 'resend';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';

class EmailService {
  private client: Resend | null = null;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    if (!env.RESEND_API_KEY) {
      logger.warn('Resend API key not configured. Email features will be disabled.');
      return;
    }

    this.client = new Resend(env.RESEND_API_KEY);
    logger.info('Email service initialized successfully');
  }

  async sendOrderNotification(
    to: string,
    orderDetails: {
      orderNumber: string;
      branchName: string;
      dispatchDate: Date;
      totalAmount: number;
    }
  ): Promise<boolean> {
    if (!this.client) {
      logger.warn('Email service not configured, notification not sent');
      return false;
    }

    try {
      const { orderNumber, branchName, dispatchDate, totalAmount } = orderDetails;

      await this.client.emails.send({
        from: env.EMAIL_FROM,
        to,
        subject: `Order Confirmation - ${orderNumber}`,
        html: `
          <h2>Order Confirmation</h2>
          <p>Your order has been successfully placed:</p>
          <ul>
            <li><strong>Order Number:</strong> ${orderNumber}</li>
            <li><strong>Branch:</strong> ${branchName}</li>
            <li><strong>Dispatch Date:</strong> ${dispatchDate.toLocaleDateString()}</li>
            <li><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</li>
          </ul>
          <p>You will receive another notification when your order is dispatched.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            This is an automated message from MikanaOS Catering Management System.
          </p>
        `,
      });

      logger.info(`Order notification sent to ${to} for order ${orderNumber}`);
      return true;
    } catch (error) {
      logger.error('Failed to send order notification:', error);
      return false;
    }
  }

  async sendDispatchNotification(
    to: string,
    dispatchDetails: {
      orderNumber: string;
      branchName: string;
      estimatedArrival: Date;
      trackingInfo?: string;
    }
  ): Promise<boolean> {
    if (!this.client) {
      logger.warn('Email service not configured, notification not sent');
      return false;
    }

    try {
      const { orderNumber, branchName, estimatedArrival, trackingInfo } = dispatchDetails;

      await this.client.emails.send({
        from: env.EMAIL_FROM,
        to,
        subject: `Order Dispatched - ${orderNumber}`,
        html: `
          <h2>Order Dispatched</h2>
          <p>Your order has been dispatched and is on its way!</p>
          <ul>
            <li><strong>Order Number:</strong> ${orderNumber}</li>
            <li><strong>Branch:</strong> ${branchName}</li>
            <li><strong>Estimated Arrival:</strong> ${estimatedArrival.toLocaleDateString()}</li>
            ${trackingInfo ? `<li><strong>Tracking:</strong> ${trackingInfo}</li>` : ''}
          </ul>
          <p>Please ensure someone is available to receive the delivery.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            This is an automated message from MikanaOS Catering Management System.
          </p>
        `,
      });

      logger.info(`Dispatch notification sent to ${to} for order ${orderNumber}`);
      return true;
    } catch (error) {
      logger.error('Failed to send dispatch notification:', error);
      return false;
    }
  }

  async sendLowStockAlert(
    to: string[],
    lowStockItems: Array<{
      itemName: string;
      quantity: number;
      unit: string;
      branchName: string;
    }>
  ): Promise<boolean> {
    if (!this.client) {
      logger.warn('Email service not configured, alert not sent');
      return false;
    }

    try {
      const itemsList = lowStockItems
        .map(
          (item) =>
            `<li>${item.itemName} - ${item.quantity} ${item.unit} (${item.branchName})</li>`
        )
        .join('');

      await this.client.emails.send({
        from: env.EMAIL_FROM,
        to,
        subject: '⚠️ Low Stock Alert - MikanaOS',
        html: `
          <h2>Low Stock Alert</h2>
          <p>The following items are running low in stock and need attention:</p>
          <ul>
            ${itemsList}
          </ul>
          <p>Please review inventory levels and place orders as needed.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            This is an automated alert from MikanaOS Catering Management System.
          </p>
        `,
      });

      logger.info(`Low stock alert sent to ${to.length} recipients`);
      return true;
    } catch (error) {
      logger.error('Failed to send low stock alert:', error);
      return false;
    }
  }

  async sendWeeklyReport(
    to: string,
    reportData: {
      weekStart: Date;
      weekEnd: Date;
      totalSales: number;
      totalOrders: number;
      topItems: Array<{ name: string; quantity: number }>;
    }
  ): Promise<boolean> {
    if (!this.client) {
      logger.warn('Email service not configured, report not sent');
      return false;
    }

    try {
      const { weekStart, weekEnd, totalSales, totalOrders, topItems } = reportData;

      const topItemsList = topItems
        .map((item, idx) => `<li>${idx + 1}. ${item.name} - ${item.quantity} units</li>`)
        .join('');

      await this.client.emails.send({
        from: env.EMAIL_FROM,
        to,
        subject: `Weekly Report - ${weekStart.toLocaleDateString()} to ${weekEnd.toLocaleDateString()}`,
        html: `
          <h2>Weekly Performance Report</h2>
          <p><strong>Week:</strong> ${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}</p>

          <h3>Summary</h3>
          <ul>
            <li><strong>Total Sales:</strong> $${totalSales.toFixed(2)}</li>
            <li><strong>Total Orders:</strong> ${totalOrders}</li>
            <li><strong>Average Order Value:</strong> $${(totalSales / totalOrders).toFixed(2)}</li>
          </ul>

          <h3>Top Items</h3>
          <ol>
            ${topItemsList}
          </ol>

          <p>For more detailed analytics, please log in to MikanaOS.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            This is an automated report from MikanaOS Catering Management System.
          </p>
        `,
      });

      logger.info(`Weekly report sent to ${to}`);
      return true;
    } catch (error) {
      logger.error('Failed to send weekly report:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
