import { Router } from 'express';
import { prisma } from '../config/db';

const router = Router();

// GET Leaderboards (Global Player Rankings)
router.get('/players', async (req, res, next) => {
  try {
    const players = await prisma.user.findMany({
      orderBy: [
        { wins: 'desc' },
        { kdRatio: 'desc' },
      ],
      take: 50,
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        country: true,
        wins: true,
        losses: true,
        kdRatio: true,
      },
    });

    res.json({
      success: true,
      players,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
