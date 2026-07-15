import { Router } from 'express';
import { prisma } from '../config/db';
import { authenticateJwt } from '../middleware/auth';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { Decimal } from '@prisma/client/runtime/library';

const router = Router();

const createTournamentSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string(),
  rules: z.string(),
  bannerUrl: z.string().url().optional(),
  entryFee: z.number().min(0),
  maxTeams: z.number().int().min(2),
  registrationDeadline: z.string().datetime(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  gameMode: z.string(),
  gameId: z.string(),
});

// Create Tournament
router.post('/', authenticateJwt, validateBody(createTournamentSchema), async (req, res, next) => {
  try {
    const { gameId, ...data } = req.body;

    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      throw new NotFoundError('Selected game not found');
    }

    const tournament = await prisma.tournament.create({
      data: {
        ...data,
        entryFee: new Decimal(data.entryFee),
        prizePool: new Decimal(0),
        gameId,
        organizerId: req.user!.userId,
      },
    });

    res.status(201).json({
      success: true,
      tournament,
    });
  } catch (error) {
    next(error);
  }
});

// Fetch Tournaments List
router.get('/', async (req, res, next) => {
  try {
    const tournaments = await prisma.tournament.findMany({
      include: { game: true },
      orderBy: { startDate: 'asc' },
    });

    res.json({
      success: true,
      tournaments,
    });
  } catch (error) {
    next(error);
  }
});

// Register Team to Tournament
router.post('/:id/register', authenticateJwt, validateBody(z.object({ teamId: z.string() })), async (req, res, next) => {
  try {
    const { teamId } = req.body;
    const tournamentId = req.params.id;

    const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } });
    if (!tournament) throw new NotFoundError('Tournament not found');

    if (tournament.currentTeamsCount >= tournament.maxTeams) {
      throw new BadRequestError('Tournament is already full');
    }

    // Check entry fee deduction
    const wallet = await prisma.wallet.findUnique({ where: { userId: req.user!.userId } });
    if (!wallet || wallet.balance.lessThan(tournament.entryFee)) {
      throw new BadRequestError('Insufficient wallet balance to pay entry fee');
    }

    const registration = await prisma.$transaction(async (tx) => {
      // 1. Deduct Entry Fee
      const updatedWallet = await tx.wallet.update({
        where: { userId: req.user!.userId },
        data: { balance: { decrement: tournament.entryFee } },
      });

      // 2. Create Wallet Transaction log
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'ENTRY_FEE',
          amount: tournament.entryFee,
          status: 'SUCCESS',
          referenceId: tournamentId,
        },
      });

      // 3. Register Team
      const reg = await tx.tournamentTeam.create({
        data: {
          tournamentId,
          teamId,
        },
      });

      // 4. Update tournament participants stats and recalculate prize pool
      // Calculate platform fee and prize pool dynamically:
      // entry fee * total collection, total collection * platform fee etc.
      // E.g. Prize pool = 85% of collection, fee = 15%. Custom configs can override.
      const newTeamCount = tournament.currentTeamsCount + 1;
      const totalCollection = tournament.entryFee.mul(newTeamCount);
      const prizePool = totalCollection.mul(0.85); // 85% goes to prize pool

      await tx.tournament.update({
        where: { id: tournamentId },
        data: {
          currentTeamsCount: newTeamCount,
          prizePool: prizePool,
        },
      });

      return reg;
    });

    res.status(201).json({
      success: true,
      registration,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
