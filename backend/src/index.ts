import http from 'http';
import app from './app';
import { env } from './config/env';
import { initSocket } from './infra/socket';

const port = env.PORT;

const server = http.createServer(app);

// Initialize Socket.io Server alongside http listener
initSocket(server);

server.listen(port, () => {
  console.log(`ArenaVerse real-time backend active on port ${port}`);
});
