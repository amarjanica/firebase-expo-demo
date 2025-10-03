import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ConnectionInfo } from './types';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:8081'],
  },
  pingInterval: 25000,
  pingTimeout: 5000,
  maxHttpBufferSize: 1e6,
  transports: ['websocket'],
})
export class EventGateway {
  @WebSocketServer()
  server: Server;
  private userConnections = new Map<string, ConnectionInfo[]>();
  private readonly logger = new Logger(EventGateway.name);

  handleConnection(client: Socket) {
    try {
      const connection: ConnectionInfo = this.buildConnectionInfo(client);
      const connections = this.userConnections.get(connection.userId) || [];
      if (this.alreadyConnected(connection)) {
        this.logger.debug('[WebSocket] User already connected with socket', connection);
        return;
      }
      connections.push(connection);
      this.userConnections.set(connection.userId, connections);
      this.logger.debug(`[WebSocket] User ${connection.userId} connected. Active: ${connections.length}`);
      console.log(
        '[WebSocket] Current connections:',
        connections.map((c) => c.socketId),
      );
      this.notifyUserConnections(connection.userId);
    } catch (error) {
      client.disconnect(true);
      throw error;
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId as string;
    const userConnections = this.userConnections.get(userId) || [];
    const newUserConnections = userConnections.filter((conn) => conn.socketId !== client.id);
    this.userConnections.set(userId, newUserConnections);

    this.logger.debug(`[WebSocket] User ${userId} disconnected. Active: ${newUserConnections.length}`);
    this.notifyUserConnections(userId);
  }

  notifyUser<T>(userId: string, message: string, payload: T) {
    if (!userId) return;
    const connections = this.userConnections.get(userId) || [];
    this.logger.debug(
      `[WebSocket] Notifying user ${userId} on ${connections.length} connections with message ${message}`,
    );
    connections.forEach((conn) => {
      this.server.to(conn.socketId).emit(message, payload);
    });
  }

  private notifyUserConnections<T>(userId: string) {
    if (!userId) return;
    const connections = this.userConnections.get(userId) || [];
    connections.forEach((conn) => {
      this.server.to(conn.socketId).emit(
        'connections',
        connections.filter((c) => c.socketId !== conn.socketId),
      );
    });
  }

  private alreadyConnected(connection: ConnectionInfo): boolean {
    const connections = this.userConnections.get(connection.userId) || [];
    return connections.some((c) => c.socketId === connection.socketId);
  }

  private buildConnectionInfo(client: Socket) {
    const userId = client.data.userId as string;
    const ip: string =
      (client.handshake.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      client.conn.remoteAddress ||
      'unknown';
    const userAgent = client.handshake.headers['user-agent'] || 'unknown';
    return {
      socketId: client.id,
      userId,
      ip,
      userAgent,
      createdAt: new Date(),
    };
  }

  @SubscribeMessage('disconnectRequest')
  handleDisconnectRequest(@ConnectedSocket() client: Socket, @MessageBody() targetSocketId: string) {
    const userId = client.data.userId as string;
    const connections = this.userConnections.get(userId) || [];
    const isOwner = connections.some((c) => c.socketId === client.id);
    if (isOwner) {
      const target = this.server.sockets.sockets.get(targetSocketId);
      if (target) {
        target.disconnect(true);
        this.notifyUserConnections(userId);
      }
    }
  }
}
