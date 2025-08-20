import { getApps, initializeApp } from '@firebase/app';
import { EventParams, getAnalytics, logEvent, setAnalyticsCollectionEnabled } from '@firebase/analytics';
import { getAuth } from '@firebase/auth';
import { FirebaseClient } from '@/firebase/types';

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

export default {
  auth,
  analytics,
  crashlytics: () => ({
    log: () => {},
    setAttribute: () => {},
    recordError: () => {},
    crash: () => {},
  }),
} as unknown as FirebaseClient;
