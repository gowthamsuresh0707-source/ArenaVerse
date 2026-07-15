import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

export const initSocket = (server: HttpServer): SocketIOServer => {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connection established: ${socket.id}`);

    // Join room for real-time notifications
    socket.on('join_user_notifications', (userId: string) => {
      socket.join(`user_notifications:${userId}`);
      console.log(`Socket ${socket.id} joined notification room for user: ${userId}`);
    });

    // Join room for live match bracket updates
    socket.on('join_match_bracket', (tournamentId: string) => {
      socket.join(`bracket:${tournamentId}`);
      console.log(`Socket ${socket.id} joined live bracket updates for tournament: ${tournamentId}`);
    });

    // Join room for live chat (Private/Team)
    socket.on('join_chat_room', (roomId: string) => {
      socket.join(`chat:${roomId}`);
      console.log(`Socket ${socket.id} joined chat room: ${roomId}`);
    });

    // Handle outgoing message events
    socket.on('send_message', (data: { roomId: string; sender: string; content: string }) => {
      io?.to(`chat:${data.roomId}`).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
      console.log(`Socket client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io server was not initialized.');
  }
  return io;
};
