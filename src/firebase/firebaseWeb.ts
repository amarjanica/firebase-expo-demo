import { getApps, initializeApp } from 'firebase/app';
import { EventParams, getAnalytics, logEvent, setAnalyticsCollectionEnabled } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { FirebaseClient } from '@/firebase/types';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
};

/**
 * If Firebase is initialized multiple times, it throws an error.
 * To prevent this, check for existing apps before initializing
 */
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

const fbAuth = getAuth(app);

const auth: FirebaseClient['auth'] = () => {
  return fbAuth as unknown as ReturnType<FirebaseClient['auth']>;
};
const analytics: FirebaseClient['analytics'] = () => {
  const fbAnalytics = getAnalytics(app);
  return {
    logScreenView: (
      params:
        | {
            [key: string]: any;
            firebase_screen: EventParams['firebase_screen'];
            firebase_screen_class: EventParams['firebase_screen_class'];
          }
        | undefined
    ) => logEvent(fbAnalytics, 'screen_view', params),
    setAnalyticsCollectionEnabled: (enabled: boolean) => setAnalyticsCollectionEnabled(fbAnalytics, enabled),
    logEvent: (event: string, params: Record<string, any>) => logEvent(fbAnalytics, event, params),
  };
};

const messaging = () => {
  return getMessaging(app);
};

export default {
  getDevicePushToken: async (): Promise<string | null> => {
    const swRegistration = await navigator.serviceWorker.register('/fsw.js');
    await navigator.serviceWorker.ready;

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Service worker initialization timed out'));
      }, 5000);
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        if (event.data && event.data.type === 'FIREBASE_INITIALIZED') {
          clearTimeout(timeout);
          if (event.data.error) {
            console.error('Service worker failed to initialize Firebase:', event.data.error);
            reject(new Error(event.data.error));
          } else {
            console.log('Service worker initialized Firebase successfully');
            resolve();
          }
        } else {
          console.error('Unexpected message from service worker:', event.data);
        }
      };

      swRegistration.active.postMessage({ type: 'INIT_FIREBASE', config: firebaseConfig }, [channel.port2]);
    });

    return getToken(messaging(), {
      vapidKey: process.env.EXPO_PUBLIC_VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    });
  },
  onTokenRefresh: (callback: (token: string) => void) => {},
  auth,
  analytics,
  crashlytics: () => ({
    log: () => {},
    setAttribute: () => {},
    recordError: () => {},
    crash: () => {},
  }),
} as unknown as FirebaseClient;
