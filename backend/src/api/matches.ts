import { Router } from 'express';
import { prisma } from '../config/db';
import { authenticateJwt } from '../middleware/auth';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';
import { MatchStatus } from '@prisma/client';
import { getIO } from '../infra/socket';

const router = Router();

const updateScoreSchema = z.object({
  score1: z.number().int().min(0),
  score2: z.number().int().min(0),
  winnerId: z.string(),
});

// Update Match score and update the bracket tree (live broadcast)
router.patch('/:id/score', authenticateJwt, validateBody(updateScoreSchema), async (req, res, next) => {
  try {
    const { score1, score2, winnerId } = req.body;
    const matchId = req.params.id;

    const match = await prisma.match.findUnique({ where: { id: matchId } });
    if (!match) throw new NotFoundError('Match not found');

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        score1,
        score2,
        winnerId,
        status: MatchStatus.COMPLETED,
      },
    });

    // Broadcast live match score update via Socket.io
    const io = getIO();
    io.to(`bracket:${match.tournamentId}`).emit('match_score_updated', updatedMatch);

    res.json({
      success: true,
      match: updatedMatch,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
