import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

export type FirebaseClient = {
  auth: () => FirebaseAuthTypes.Module;
  analytics: () => {
    logScreenView: (
      params: { [key: string]: any; firebase_screen: any; firebase_screen_class: any } | undefined
    ) => void;
    setAnalyticsCollectionEnabled: (enabled: boolean) => void;
    logEvent: (event: string, params: Record<string, any>) => void;
  };
};
