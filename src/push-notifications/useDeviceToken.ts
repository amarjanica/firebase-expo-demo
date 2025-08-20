import messaging from '@react-native-firebase/messaging';
import { useEffect, useState } from 'react';

import useNotificationPermission from './useNotificationPermission';

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
