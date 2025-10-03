import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Server } from 'socket.io';
import { FirebaseService } from '../firebase/firebase.service';
import { io, Socket } from 'socket.io-client';
import { EventAdapter } from './event.adapter';
import * as net from 'net';

function connectClient(port: number, token?: string): Promise<Socket> {
  return new Promise((resolve, reject) => {
    const client = io(`http://localhost:${port}`, {
      auth: { token },
      transports: ['websocket'],
    });

    client.on('connect', () => resolve(client));
    client.on('connect_error', (err) => reject(err));
  });
}

describe('EventAdapter', () => {
  let app: INestApplication;
  let server: Server;
  let port: number;
  const verifyIdToken = jest.fn();
  const mockFirebaseService = {
    auth: () => ({
      verifyIdToken,
    }),
  };

  beforeAll(async () => {
    port = await getPort();
    const moduleRef = await Test.createTestingModule({
      providers: [{ provide: FirebaseService, useValue: mockFirebaseService }],
    }).compile();

    app = moduleRef.createNestApplication();
    const adapter = new EventAdapter(app, app.get(FirebaseService));
    app.useWebSocketAdapter(adapter);

    await app.init();

    const httpServer = app.getHttpServer();
    server = adapter.createIOServer(httpServer);
    server.listen(port);
  });

  it('should reject connection without token', async () => {
    await expect(connectClient(port)).rejects.toThrow('Unauthorized');
  });

  it('should reject connection with invalid token', async () => {
    verifyIdToken.mockRejectedValueOnce(new Error('bad token'));
    await expect(connectClient(port, 'fake')).rejects.toThrow('Unauthorized');
  });

  it('should allow connection with valid token', async () => {
    verifyIdToken.mockResolvedValueOnce({ uid: 'user1' });
    const client = await connectClient(port, 'valid');
    expect(client.connected).toBe(true);
    client.disconnect();
  });

  it('should reject when exceeding max connections', async () => {
    verifyIdToken.mockResolvedValue({ uid: 'user1' });

    const client1 = await connectClient(port, 'valid');
    const client2 = await connectClient(port, 'valid');
    await expect(connectClient(port, 'valid')).rejects.toThrow('Too many connections');

    client1.disconnect();
    client2.disconnect();
  });

  afterAll(async () => {
    await app.close();
    await server.close();
  });
});

export async function getPort(start = 3000, end = 3100): Promise<number> {
  for (let port = start; port <= end; port++) {
    const isFree = await checkPort(port);
    if (isFree) return port;
  }
  throw new Error(`No available ports between ${start} and ${end}`);
}

function checkPort(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net
      .createServer()
      .once('error', () => resolve(false))
      .once('listening', () => {
        server.close(() => resolve(true));
      })
      .listen(port, 'localhost');
  });
}
