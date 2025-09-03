import messaging from '@react-native-firebase/messaging';
import { useEffect, useState } from 'react';

import useNotificationPermission from './useNotificationPermission';
import firebase from '@/firebase';
const useDeviceToken = () => {
  const permission = useNotificationPermission();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (permission.status !== 'granted') {
      console.warn('Notification permission not granted, cannot fetch FCM token');
      return;
    }

    void (async () => {
      try {
        await messaging().registerDeviceForRemoteMessages();
        console.debug('APNs token:', await messaging().getAPNSToken());
        const fcm = await messaging().getToken();

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
    })();

    return messaging().onTokenRefresh(setToken);
  }, [permission.status]);

  return token;
};

export default useDeviceToken;
