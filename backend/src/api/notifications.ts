import { Router } from 'express';
import { prisma } from '../config/db';
import { authenticateJwt } from '../middleware/auth';
import { sendNotification } from '../services/notificationService';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';

const router = Router();

// GET all notifications for logged in user
router.get('/', authenticateJwt, async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    next(error);
  }
});

// MARK notification as read
router.patch('/:id/read', authenticateJwt, async (req, res, next) => {
  try {
    const notification = await prisma.notification.update({
      where: { id: req.params.id, userId: req.user!.userId },
      data: { isRead: true },
    });

    res.json({
      success: true,
      notification,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
