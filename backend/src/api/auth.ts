import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';
import { generateAccessToken, generateRefreshToken } from '../utils/token';
import { BadRequestError, UnauthorizedError, ConflictError } from '../utils/errors';
import { authLimiter } from '../middleware/rateLimiter';
import { createAuditLog } from '../utils/auditLogger';
import { Role } from '@prisma/client';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

// Register
router.post('/register', authLimiter, validateBody(registerSchema), async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      throw new ConflictError('Email or username already in use');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          username,
          passwordHash,
          role: Role.PLAYER,
        },
      });

      // Automatically create a wallet for the user
      await tx.wallet.create({
        data: {
          userId: newUser.id,
          balance: 0.00,
        },
      });

      return newUser;
    });

    await createAuditLog(user.id, 'USER_REGISTERED', `User registered: ${user.username}`, req.ip);

    const payload = { userId: user.id, email: user.email, role: user.role, username: user.username };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.status(201).json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', authLimiter, validateBody(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw new UnauthorizedError('Invalid credentials');
    }

    await createAuditLog(user.id, 'USER_LOGIN', `User logged in: ${user.username}`, req.ip);

    const payload = { userId: user.id, email: user.email, role: user.role, username: user.username };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Refresh Tokens
router.post('/refresh', validateBody(refreshSchema), async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    // In production, you would verify this key using JWT refresh key
    // We import verify from jsonwebtoken and check
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'super-secret-jwt-refresh-key-replace-in-production') as any;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const newPayload = { userId: user.id, email: user.email, role: user.role, username: user.username };
    const accessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    res.json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(new UnauthorizedError('Invalid refresh token'));
  }
});

export default router;
