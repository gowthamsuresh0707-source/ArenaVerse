import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import { publicLimiter } from './middleware/rateLimiter';
import authRoutes from './api/auth';
import userRoutes from './api/users';
import teamRoutes from './api/teams';
import tournamentRoutes from './api/tournaments';
import walletRoutes from './api/wallet';
import adminRoutes from './api/admin';
import notificationRoutes from './api/notifications';
import chatRoutes from './api/chat';
import leaderboardRoutes from './api/leaderboards';
import matchRoutes from './api/matches';
import aiRoutes from './api/ai';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// API health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/leaderboards', leaderboardRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/ai', aiRoutes);



// Global Error Handler
app.use(errorHandler);

export default app;
