import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserPayload } from '../middleware/auth';

export const generateAccessToken = (user: UserPayload): string => {
  return jwt.sign(
    { userId: user.userId, email: user.email, role: user.role, username: user.username },
    env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

export const generateRefreshToken = (user: UserPayload): string => {
  return jwt.sign(
    { userId: user.userId, email: user.email, role: user.role, username: user.username },
    env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};
