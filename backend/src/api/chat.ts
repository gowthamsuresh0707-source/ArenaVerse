import { Router } from 'express';
import { prisma } from '../config/db';
import { authenticateJwt } from '../middleware/auth';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';
import { getIO } from '../infra/socket';

const router = Router();

const sendMessageSchema = z.object({
  receiverId: z.string().optional(),
  teamId: z.string().optional(),
  content: z.string().min(1),
});

// Send Chat Message (Real-Time delivery helper)
router.post('/', authenticateJwt, validateBody(sendMessageSchema), async (req, res, next) => {
  try {
    const { receiverId, teamId, content } = req.body;
    const senderId = req.user!.userId;

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        teamId,
        content,
      },
    });

    const io = getIO();
    // Broadcast message to recipients room (Private or Team channel)
    const activeRoomId = teamId ? `team_${teamId}` : `dm_${[senderId, receiverId].sort().join('_')}`;
    io.to(`chat:${activeRoomId}`).emit('receive_message', {
      id: message.id,
      senderId,
      senderUsername: req.user!.username,
      content,
      createdAt: message.createdAt,
    });

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
  }
});

// GET Chat history
router.get('/history', authenticateJwt, async (req, res, next) => {
  try {
    const { receiverId, teamId } = req.query;
    const senderId = req.user!.userId;

    let chatLogs = [];

    if (teamId) {
      chatLogs = await prisma.message.findMany({
        where: { teamId: String(teamId) },
        orderBy: { createdAt: 'asc' },
      });
    } else if (receiverId) {
      chatLogs = await prisma.message.findMany({
        where: {
          OR: [
            { senderId, receiverId: String(receiverId) },
            { senderId: String(receiverId), receiverId: senderId },
          ],
        },
        orderBy: { createdAt: 'asc' },
      });
    }

    res.json({
      success: true,
      messages: chatLogs,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
