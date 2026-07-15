import { Router } from 'express';
import { prisma } from '../config/db';
import { authenticateJwt } from '../middleware/auth';
import { walletLimiter } from '../middleware/rateLimiter';
import { Decimal } from '@prisma/client/runtime/library';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';
import { BadRequestError } from '../utils/errors';

const router = Router();

// Retrieve current user wallet balance and details
router.get('/', authenticateJwt, async (req, res, next) => {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { userId: req.user!.userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    res.json({
      success: true,
      wallet,
    });
  } catch (error) {
    next(error);
  }
});

// Deposit Money (Simulate Razorpay API trigger)
const depositSchema = z.object({
  amount: z.number().positive(),
  paymentId: z.string().min(1),
  orderId: z.string().min(1),
});

router.post('/deposit', authenticateJwt, walletLimiter, validateBody(depositSchema), async (req, res, next) => {
  try {
    const { amount, paymentId, orderId } = req.body;
    const userId = req.user!.userId;

    // Verify duplicate transaction protection
    const duplicate = await prisma.walletTransaction.findFirst({
      where: { referenceId: paymentId },
    });

    if (duplicate) {
      throw new BadRequestError('Payment already processed.');
    }

    const txResult = await prisma.$transaction(async (tx) => {
      // Find user wallet
      const wallet = await tx.wallet.findUnique({
        where: { userId },
      });

      if (!wallet) throw new BadRequestError('Wallet not found');

      // Update wallet balance
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { increment: new Decimal(amount) },
        },
      });

      // Log wallet transaction
      const trans = await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'DEPOSIT',
          amount: new Decimal(amount),
          status: 'SUCCESS',
          referenceId: paymentId,
        },
      });

      return { wallet: updatedWallet, transaction: trans };
    });

    res.json({
      success: true,
      data: txResult,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
