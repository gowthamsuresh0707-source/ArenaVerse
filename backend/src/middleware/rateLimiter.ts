import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { redis } from '../config/redis';
import { TooManyRequestsError } from '../utils/errors'; // We can map this to AppError with 429 status code or define below.

// Custom TooManyRequestsError (inline or mapping helper)
class RateLimitError extends Error {
  statusCode = 429;
  constructor(message: string = 'Too many requests. Please try again later.') {
    super(message);
    this.name = 'RateLimitError';
  }
}

interface RateLimitOptions {
  windowMs: number;
  max: number;
  keyPrefix: string;
}

export const rateLimiter = (options: RateLimitOptions) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `ratelimit:${options.keyPrefix}:${ip}`;

    try {
      const current = await redis.incr(key);

      if (current === 1) {
        await redis.pexpire(key, options.windowMs);
      }

      if (current > options.max) {
        next(new RateLimitError());
        return;
      }
      next();
    } catch (err) {
      // In case Redis fails, we log and fall through to let requests process
      console.error('Rate limit error:', err);
      next();
    }
  };
};

// Preset limits from requirements
export const authLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  keyPrefix: 'auth',
});

export const publicLimiter = rateLimiter({
  windowMs: 60 * 1000,
  max: 100,
  keyPrefix: 'public',
});

export const walletLimiter = rateLimiter({
  windowMs: 60 * 1000,
  max: 20,
  keyPrefix: 'wallet',
});

export const adminLimiter = rateLimiter({
  windowMs: 60 * 1000,
  max: 200,
  keyPrefix: 'admin',
});
