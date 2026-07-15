import { prisma } from '../config/db';

export async function createAuditLog(
  userId: string | null,
  action: string,
  details: string,
  ipAddress?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        details,
        ipAddress,
      },
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}
