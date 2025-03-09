import { getApp, getApps } from '@react-native-firebase/app';
import { logEvent, setAnalyticsCollectionEnabled, getAnalytics } from '@react-native-firebase/analytics';

const app = getApp()
const analytics = getAnalytics(app);

export default {
  app: getApp(),
  analytics: () => {
    return {
      logScreenView: (params: { [key: string]: any; firebase_screen: any; firebase_screen_class: any; } | undefined) => logEvent(analytics, 'screen_view', params),
      setAnalyticsCollectionEnabled: (enabled: boolean) => setAnalyticsCollectionEnabled(analytics, enabled),
      logEvent: (event: string, params: Record<string, any>) => logEvent(analytics, event, params),
    };
  },
  running: getApps().length > 0,
};
