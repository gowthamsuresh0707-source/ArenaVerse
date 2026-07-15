import { Router } from 'express';
import { prisma } from '../config/db';
import { authenticateJwt, authorizeRoles } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

// GET global platform status overview
router.get('/stats', authenticateJwt, authorizeRoles(Role.ADMIN), async (req, res, next) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalTournaments = await prisma.tournament.count();
    const totalTeams = await prisma.team.count();
    
    // Aggregation for wallet statistics
    const totalVolume = await prisma.walletTransaction.aggregate({
      where: { status: 'SUCCESS' },
      _sum: { amount: true },
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalTournaments,
        totalTeams,
        totalVolume: totalVolume._sum.amount || 0,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
