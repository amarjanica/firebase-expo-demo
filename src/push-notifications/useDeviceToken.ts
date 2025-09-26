import { useCallback, useEffect, useState } from 'react';

import useNotificationPermission from './useNotificationPermission';
import firebase from '@/firebase';
const useDeviceToken = () => {
  const permission = useNotificationPermission();
  const [token, setToken] = useState<string | null>(null);
  const prepare = useCallback(async () => {
    if (permission.status !== 'granted') {
      console.warn('Notification permission not granted, cannot fetch FCM token');
      return;
    }
    try {
      const fcm = await firebase.getDevicePushToken();
      console.log(`Calling ${process.env.EXPO_PUBLIC_API_URL}/device-token/register`);
      await fetch(`${process.env.EXPO_PUBLIC_API_URL}/device-token/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await firebase.auth().currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({ token: fcm }),
      })
        .then(() => console.log('Registered!'))
        .catch((e) => {
          console.warn('Failed to register device token with backend:', e);
        });
      console.debug('FCM token:', fcm);
      setToken(fcm);
    } catch (e) {
      console.warn('FCM init failed:', e);
    }
  }, [permission]);

  useEffect(() => {
    void prepare().catch((err) => console.debug('Failed to prepare FCM', err));
    return firebase.onTokenRefresh(setToken);
  }, [prepare]);

  return token;
};

export default useDeviceToken;
