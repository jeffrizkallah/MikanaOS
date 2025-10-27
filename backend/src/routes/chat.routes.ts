import { Router } from 'express';
import { db } from '../lib/db.js';
import { authenticate } from '../lib/auth.js';
import { aiService } from '../services/ai.service.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get chat history
router.get('/messages', async (req, res) => {
  try {
    const { limit = 50, before } = req.query;

    const messages = await db.chatMessage.findMany({
      where: before
        ? {
            createdAt: {
              lt: new Date(before as string),
            },
          }
        : undefined,
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: parseInt(limit as string),
    });

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send message and get AI response
router.post('/messages', async (req, res) => {
  try {
    const { message } = req.body;
    const userId = (req as any).user.userId;

    if (!message?.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Get recent conversation history for context
    const recentMessages = await db.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const conversationHistory = recentMessages
      .reverse()
      .map((msg) => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.content,
      }));

    // Generate AI response
    const aiResponse = await aiService.generateChatResponse(
      message,
      userId,
      conversationHistory
    );

    // Fetch the saved messages
    const savedMessages = await db.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 2,
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
            role: true,
          },
        },
      },
    });

    res.json({
      userMessage: savedMessages[1],
      aiMessage: savedMessages[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get online users
router.get('/users/online', async (req, res) => {
  try {
    // In a real application, you'd track online status via WebSocket connections
    // For now, return all active users
    const users = await db.user.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
      },
      take: 20,
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export const chatRoutes = router;
