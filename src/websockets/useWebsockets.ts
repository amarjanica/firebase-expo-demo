import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import firebase from '@/firebase';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Alert, AppState } from 'react-native';

type ConnectionInfo = {
  socketId: string;
  userId: string;
  ip: string;
  userAgent?: string;
  createdAt: string;
};
export default function useWebsockets(user: FirebaseAuthTypes.User) {
  const socketRef = useRef<Socket | null>(null);
  const [connections, setConnections] = useState<ConnectionInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const initSocket = useCallback(async () => {
    if (socketRef.current) {
      console.log('[Socket] Already connected, skipping init');
      return;
    }

    if (!user) {
      return;
    }

    const token = await firebase.getIdToken();
    if (!token) return;
    console.log('[Socket] Connecting to websocket with token');
    const socket = io(process.env.EXPO_PUBLIC_API_URL, {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 25000,
      randomizationFactor: 0.5,
      transports: ['websocket'],
    });
    socketRef.current = socket;

    socket.on('connections', (list: ConnectionInfo[]) => {
      console.log('[Socket] Connections list updated', list);
      setConnections(list);
    });
    socket.on('connect_error', async (err) => {
      console.error('[Socket] Connection error:', err.message);
      setError(err.message);
      if (err.message.includes('Unauthorized')) {
        const newToken = await firebase.getIdToken(true);
        socket.auth = { token: newToken };
        socket.connect();
      } else if (err.message.includes('Too many connections')) {
        console.error('[Socket] Too many connections. Disconnecting.');
        socket.disconnect();
      }
    });
    socket.on('connect', () => {
      console.log('[Socket] connected');
    });
    socket.on('greeting', (message: string) => {
      Alert.alert('Greeting from server', message);
    });
    socket.on('disconnect', () => {
      console.log('[Socket] disconnect');
      setConnections([]);
    });
  }, [user]);

  const requestDisconnect = (socketId: string) => {
    socketRef.current?.emit('disconnectRequest', socketId);
  };

  useEffect(() => {
    void initSocket();

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void initSocket();
      } else if (state === 'background') {
        socketRef.current?.disconnect();
        socketRef.current = null;
      }
    });

    return () => {
      sub.remove();
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [initSocket]);

  return {
    connections,
    error,
    requestDisconnect,
    isConnected: socketRef.current?.connected ?? false,
  };
}
