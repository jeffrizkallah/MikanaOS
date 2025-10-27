import { Router } from 'express';
import { db } from '../lib/db.js';
import { hashPassword, comparePassword, generateToken } from '../lib/auth.js';
import { z } from 'zod';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
  role: z.enum(['BRANCH_MANAGER', 'HEAD_OFFICE', 'ADMIN']),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);

    // Check if user already exists
    const existing = await db.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await db.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
      },
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({ user, token });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);

    // Find user
    const user = await db.user.findUnique({
      where: { email: data.email },
      include: {
        branches: {
          include: {
            branch: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const valid = await comparePassword(data.password, user.password);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Return user data without password
    const { password, ...userWithoutPassword } = user;
    const userData = {
      ...userWithoutPassword,
      branches: user.branches.map((ub) => ub.branch.name),
    };

    res.json({ user: userData, token });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to login' });
  }
});

export const authRoutes = router;
