import { ExpoConfig } from '@expo/config-types';

const config: ExpoConfig = {
  name: 'firebase-expo-demo',
  slug: process.env.EAS_SLUG || 'firebase-expo-demo',
  scheme: process.env.EAS_SLUG || 'firebase-expo-demo',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  owner: process.env.EAS_PROJECT_OWNER,
  extra: {
    eas: {
      projectId: process.env.EAS_PROJECT_ID,
    },
  },
  ios: {
    googleServicesFile: './GoogleService-Info.plist',
    bundleIdentifier: 'com.amarjanica.firebaseexpodemo',
    supportsTablet: true,
    entitlements: {
      'aps-environment': process.env.NODE_ENV !== 'production' ? 'development' : 'production',
    },
    infoPlist: {
      UIBackgroundModes: ['remote-notification'],
    },
  },
  android: {
    package: 'com.amarjanica.firebasexpodemo',
    googleServicesFile: './google-services.json',
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    permissions: ['android.permission.POST_NOTIFICATIONS'],
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
    '@react-native-firebase/app',
    '@react-native-firebase/crashlytics',
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
        },
      },
    ],
    [
      '@sentry/react-native/expo',
      {
        url: 'https://sentry.io/',
        organization: process.env.SENTRY_ORGANIZATION,
        project: process.env.SENTRY_PROJECT,
      },
    ],
    'expo-web-browser',
    [
      'react-native-permissions',
      {
        iosPermissions: ['Notifications'],
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
};

export default config;
