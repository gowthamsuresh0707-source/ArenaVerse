import { Router } from 'express';
import { prisma } from '../config/db';
import { authenticateJwt } from '../middleware/auth';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';
import { NotFoundError } from '../utils/errors';

const router = Router();

const updateProfileSchema = z.object({
  bio: z.string().max(250).optional(),
  country: z.string().max(100).optional(),
  age: z.number().int().min(12).max(100).optional(),
  avatarUrl: z.string().url().optional(),
});

// GET profile
router.get('/me', authenticateJwt, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: { wallet: true },
    });

    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        bio: user.bio,
        country: user.country,
        age: user.age,
        avatarUrl: user.avatarUrl,
        matchesPlayed: user.matchesPlayed,
        wins: user.wins,
        losses: user.losses,
        kdRatio: user.kdRatio,
        walletBalance: user.wallet?.balance || 0,
      },
    });
  } catch (error) {
    next(error);
  }
});

// UPDATE profile
router.put('/me', authenticateJwt, validateBody(updateProfileSchema), async (req, res, next) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user!.userId },
      data: req.body,
    });

    res.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
