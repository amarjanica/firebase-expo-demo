import { Socket } from 'socket.io-client';

export type ConnectionInfo = {
  socketId: string;
  userId: string;
  ip: string;
  userAgent: string;
  createdAt: Date;
};
