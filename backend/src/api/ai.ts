import { Router } from 'express';
import { authenticateJwt } from '../middleware/auth';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';
import { env } from '../config/env';

const router = Router();

const descriptionSchema = z.object({
  gameName: z.string(),
  prizePool: z.number(),
});

const rulesSchema = z.object({
  gameName: z.string(),
  gameMode: z.string(),
});

// AI Description Generator (Configurable stub wrapper)
router.post('/generate-description', authenticateJwt, validateBody(descriptionSchema), async (req, res, next) => {
  try {
    const { gameName, prizePool } = req.body;
    
    // In production, instantiate OpenAI client or Claude client based on config
    // const response = await openai.chat.completions.create({...})
    const generatedText = `Welcome to the ultimate ${gameName} arena! Battle against elite teams for a massive prize pool of ₹${prizePool}. Register your squad now, dominate the leaderboards, and claim your share of the glory in ArenaVerse!`;

    res.json({
      success: true,
      description: generatedText,
    });
  } catch (error) {
    next(error);
  }
});

// AI Rules Generator (Configurable stub wrapper)
router.post('/generate-rules', authenticateJwt, validateBody(rulesSchema), async (req, res, next) => {
  try {
    const { gameName, gameMode } = req.body;

    const generatedRules = `Official ArenaVerse rules for ${gameName} (${gameMode}):\n1. All players must check in 15 minutes before match start.\n2. Standard map pools and esports competitive settings will be enforced.\n3. Hacking, cheating, or toxic behaviors will result in immediate disqualification and account ban.`;

    res.json({
      success: true,
      rules: generatedRules,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
