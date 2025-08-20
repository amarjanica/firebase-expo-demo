import { getApp } from '@react-native-firebase/app';
import { logEvent, setAnalyticsCollectionEnabled, getAnalytics } from '@react-native-firebase/analytics';
import { getAuth } from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';

const app = getApp();

export default {
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
