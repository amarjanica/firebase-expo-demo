import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, Socket } from 'socket.io';
import { INestApplicationContext } from '@nestjs/common';
import { z } from 'zod';
import { FirebaseService } from '../firebase/firebase.service';

const AuthSchema = z.object({
  token: z.string().min(1),
});

export class EventAdapter extends IoAdapter {
  private userConnections = new Map<string, Set<string>>();
  private readonly MAX_CONNECTIONS = 2;
  constructor(
    appOrHttpServer: INestApplicationContext,
    private readonly firebaseService: FirebaseService,
  ) {
    super(appOrHttpServer);
  }

  createIOServer(port: number, options?: any): any {
    const server: Server = super.createIOServer(port, options);

    server.use(async (socket: Socket, next) => {
      try {
        const { token } = this.parseAuth(socket);
        const userId = await this.verifyToken(token);
        socket.data.userId = userId;
        const connections = this.userConnections.get(userId) || new Set<string>();

        if (connections.size >= this.MAX_CONNECTIONS) {
          return next(new Error('Too many connections'));
        }
        connections.add(socket.id);
        this.userConnections.set(userId, connections);

        socket.on('disconnect', () => {
          connections.delete(socket.id);
          if (connections.size === 0) {
            this.userConnections.delete(userId);
          }
        });

        return next();
      } catch (err) {
        return next(new Error('Unauthorized'));
      }
    });
    return server;
  }

  private parseAuth(socket: Socket) {
    const result = AuthSchema.safeParse(socket.handshake.auth);
    if (!result.success) {
      throw new Error('Unauthorized');
    }
    return result.data;
  }

  private async verifyToken(idToken: string) {
    const verified = await this.firebaseService.auth().verifyIdToken(idToken);
    return verified.uid;
  }
}
