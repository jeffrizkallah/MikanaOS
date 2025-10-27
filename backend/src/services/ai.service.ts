import OpenAI from 'openai';
import { env } from '../config/env.js';
import { db } from '../lib/db.js';
import { logger } from '../lib/logger.js';

class AIService {
  private client: OpenAI | null = null;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    if (!env.OPENAI_API_KEY) {
      logger.warn('OpenAI API key not configured. AI features will be disabled.');
      return;
    }

    this.client = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });

    logger.info('OpenAI client initialized successfully');
  }

  async generateChatResponse(
    message: string,
    userId: string,
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<string> {
    if (!this.client) {
      return 'AI service is not configured. Please set up OpenAI API key.';
    }

    try {
      const systemPrompt = `You are an AI assistant for MikanaOS, a catering management system.
You help users with inventory management, sales forecasting, order optimization, and business insights.
Be concise, helpful, and provide actionable advice based on catering business operations.`;

      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        ...(conversationHistory || []).map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
        { role: 'user', content: message },
      ];

      const response = await this.client.chat.completions.create({
        model: env.OPENAI_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 500,
      });

      const aiResponse = response.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';

      // Save chat message
      await db.chatMessage.create({
        data: {
          userId,
          content: message,
          isBot: false,
        },
      });

      await db.chatMessage.create({
        data: {
          userId,
          content: aiResponse,
          isBot: true,
        },
      });

      return aiResponse;
    } catch (error: any) {
      logger.error('Failed to generate AI response:', error);
      return 'I apologize, but I encountered an error. Please try again.';
    }
  }

  async generateInsights(): Promise<void> {
    if (!this.client) {
      logger.warn('AI service not configured, skipping insight generation');
      return;
    }

    try {
      logger.info('Generating AI insights...');

      // Fetch recent sales data
      const recentSales = await db.sale.findMany({
        take: 100,
        orderBy: { saleDate: 'desc' },
      });

      // Fetch inventory data
      const lowStock = await db.inventory.findMany({
        where: { status: 'LOW_STOCK' },
      });

      // Generate insights based on data
      const dataContext = `
Recent Sales Summary:
- Total sales: ${recentSales.length}
- Average amount: $${(recentSales.reduce((sum, s) => sum + s.amount, 0) / recentSales.length).toFixed(2)}

Low Stock Items: ${lowStock.length} items
${lowStock.slice(0, 5).map(item => `- ${item.itemName}: ${item.quantity} ${item.unit}`).join('\n')}
      `;

      const prompt = `Based on this catering business data, generate 3-4 actionable insights:
${dataContext}

Format each insight as:
Type: [RECOMMENDATION/PREDICTION/ALERT]
Title: [Brief title]
Description: [2-3 sentences]
Impact: [HIGH/MEDIUM/LOW]
Confidence: [0-100]`;

      const response = await this.client.chat.completions.create({
        model: env.OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a business intelligence analyst specializing in catering operations.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.8,
      });

      const insightsText = response.choices[0]?.message?.content;

      if (insightsText) {
        // Parse and save insights (simplified - you'd want better parsing)
        const insights = this.parseInsights(insightsText);

        for (const insight of insights) {
          await db.aIInsight.create({
            data: insight,
          });
        }

        logger.info(`Generated ${insights.length} new insights`);
      }
    } catch (error) {
      logger.error('Failed to generate insights:', error);
    }
  }

  private parseInsights(text: string): Array<{
    type: 'RECOMMENDATION' | 'PREDICTION' | 'ALERT' | 'OPTIMIZATION';
    title: string;
    description: string;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    confidence: number;
  }> {
    // Simplified parsing - in production, you'd want more robust parsing
    const insights = [];
    const sections = text.split('\n\n');

    for (const section of sections) {
      if (section.includes('Type:')) {
        const typeMatch = section.match(/Type:\s*(\w+)/);
        const titleMatch = section.match(/Title:\s*(.+)/);
        const descMatch = section.match(/Description:\s*(.+)/);
        const impactMatch = section.match(/Impact:\s*(\w+)/);
        const confidenceMatch = section.match(/Confidence:\s*(\d+)/);

        if (typeMatch && titleMatch && descMatch) {
          insights.push({
            type: (typeMatch[1] as any) || 'RECOMMENDATION',
            title: titleMatch[1].trim(),
            description: descMatch[1].trim(),
            impact: (impactMatch?.[1] as any) || 'MEDIUM',
            confidence: parseInt(confidenceMatch?.[1] || '75'),
          });
        }
      }
    }

    return insights;
  }

  async generateSalesForecast(branchId?: string): Promise<any[]> {
    if (!this.client) {
      logger.warn('AI service not configured, returning empty forecast');
      return [];
    }

    try {
      // Fetch historical sales data
      const historicalSales = await db.sale.findMany({
        where: branchId ? { branchId } : undefined,
        orderBy: { saleDate: 'desc' },
        take: 90, // Last 90 days
      });

      if (historicalSales.length === 0) {
        return [];
      }

      // Prepare data for forecasting
      const salesByDay = historicalSales.reduce((acc, sale) => {
        const date = sale.saleDate.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + sale.amount;
        return acc;
      }, {} as Record<string, number>);

      // Use AI to generate forecast (simplified approach)
      const dataString = Object.entries(salesByDay)
        .slice(0, 30)
        .map(([date, amount]) => `${date}: $${amount}`)
        .join('\n');

      const prompt = `Given these daily sales for a catering business:
${dataString}

Predict sales for the next 7 days. Consider trends, day of week patterns, and seasonality.
Format: YYYY-MM-DD: $amount, confidence: [high/medium/low]`;

      const response = await this.client.chat.completions.create({
        model: env.OPENAI_MODEL,
        messages: [
          { role: 'system', content: 'You are a data scientist specializing in sales forecasting.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.5,
      });

      const forecastText = response.choices[0]?.message?.content || '';
      const forecasts = this.parseForecast(forecastText);

      // Save forecasts to database
      for (const forecast of forecasts) {
        await db.forecast.create({
          data: {
            date: forecast.date,
            predictedSales: forecast.amount,
            confidence: forecast.confidence,
            branchId: branchId || null,
          },
        });
      }

      return forecasts;
    } catch (error) {
      logger.error('Failed to generate sales forecast:', error);
      return [];
    }
  }

  private parseForecast(text: string): Array<{
    date: Date;
    amount: number;
    confidence: string;
  }> {
    const forecasts = [];
    const lines = text.split('\n');

    for (const line of lines) {
      const match = line.match(/(\d{4}-\d{2}-\d{2}):\s*\$?([\d,]+).*confidence:\s*(\w+)/i);
      if (match) {
        forecasts.push({
          date: new Date(match[1]),
          amount: parseFloat(match[2].replace(',', '')),
          confidence: match[3].toLowerCase(),
        });
      }
    }

    return forecasts;
  }
}

export const aiService = new AIService();
