import { prisma } from '../config/db';
import { getIO } from '../infra/socket';

export const sendNotification = async (userId: string, title: string, message: string) => {
  try {
    // 1. Persist notification in database
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
      },
    });

    // 2. Broadcast via Socket.io if active
    const io = getIO();
    io.to(`user_notifications:${userId}`).emit('new_notification', notification);
  } catch (error) {
    console.error('Failed to create or send real-time notification:', error);
  }
};
