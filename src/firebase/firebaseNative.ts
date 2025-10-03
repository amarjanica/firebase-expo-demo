import { getApp } from '@react-native-firebase/app';
import { logEvent, setAnalyticsCollectionEnabled, getAnalytics } from '@react-native-firebase/analytics';
import { getAuth, getIdToken } from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import { getMessaging } from '@react-native-firebase/messaging';

const app = getApp();

export default {
  getDevicePushToken: async (): Promise<string | null> => {
    await getMessaging().registerDeviceForRemoteMessages();
    console.debug('APNs token:', await getMessaging().getAPNSToken());
    const fcm = await getMessaging().getToken();
    return fcm;
  },
  getIdToken: async (forceRefresh = false): Promise<string> => {
    const user = getAuth(app).currentUser;
    if (!user) {
      throw new Error('No user is signed in');
    }
    return getIdToken(user, forceRefresh);
  },
  onTokenRefresh: (callback: (token: string) => void) => getMessaging().onTokenRefresh(callback),
  auth: () => getAuth(app),
  analytics: () => {
    const analytics = getAnalytics(app);
    return {
      logScreenView: (params: { [key: string]: any; firebase_screen: any; firebase_screen_class: any } | undefined) =>
        logEvent(analytics, 'screen_view', params),
      setAnalyticsCollectionEnabled: (enabled: boolean) => setAnalyticsCollectionEnabled(analytics, enabled),
      logEvent: (event: string, params: Record<string, any>) => logEvent(analytics, event, params),
    };
  },
  crashlytics,
};
