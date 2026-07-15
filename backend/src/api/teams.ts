import { Router } from 'express';
import { prisma } from '../config/db';
import { authenticateJwt } from '../middleware/auth';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { Role, TeamRole } from '@prisma/client';

const router = Router();

const createTeamSchema = z.object({
  name: z.string().min(3).max(50),
  logoUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
});

// Create Team
router.post('/', authenticateJwt, validateBody(createTeamSchema), async (req, res, next) => {
  try {
    const { name, logoUrl, bannerUrl } = req.body;
    const userId = req.user!.userId;

    const existingTeam = await prisma.team.findUnique({ where: { name } });
    if (existingTeam) {
      throw new BadRequestError('Team name already taken');
    }

    const team = await prisma.$transaction(async (tx) => {
      // Create team
      const newTeam = await tx.team.create({
        data: {
          name,
          logoUrl,
          bannerUrl,
          captainId: userId,
        },
      });

      // Add captain as a TeamMember
      await tx.teamMember.create({
        data: {
          teamId: newTeam.id,
          userId: userId,
          role: TeamRole.CAPTAIN,
        },
      });

      // Promote user role to CAPTAIN if currently player
      if (req.user!.role === Role.PLAYER) {
        await tx.user.update({
          where: { id: userId },
          data: { role: Role.TEAM_CAPTAIN },
        });
      }

      return newTeam;
    });

    res.status(201).json({
      success: true,
      team,
    });
  } catch (error) {
    next(error);
  }
});

// GET Team details
router.get('/:id', authenticateJwt, async (req, res, next) => {
  try {
    const team = await prisma.team.findUnique({
      where: { id: req.params.id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
                country: true,
              },
            },
          },
        },
      },
    });

    if (!team) {
      throw new NotFoundError('Team not found');
    }

    res.json({
      success: true,
      team,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
