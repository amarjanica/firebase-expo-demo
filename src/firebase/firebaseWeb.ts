import { getApps, initializeApp } from '@firebase/app';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
}

/**
 * If Firebase is initialized multiple times, it throws an error.
 * To prevent this, check for existing apps before initializing
 */
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export default {
  app,
  running: getApps().length > 0,
};
