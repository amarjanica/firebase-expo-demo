import { ExpoConfig } from '@expo/config-types';

const config: ExpoConfig = {
  name: 'firebase-expo-demo',
  slug: 'firebase-expo-demo',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'myapp',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    googleServicesFile: './GoogleService-Info.plist',
    bundleIdentifier: 'com.amarjanica.firebaseexpodemo',
    supportsTablet: true,
  },
  android: {
    package: 'com.amarjanica.firebaseexpodemo',
    googleServicesFile: "./google-services.json",
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
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
    "@react-native-firebase/app",
    [
      "expo-build-properties",
      {
        "ios": {
          "useFrameworks": "static"
        }
      }
    ]
  ],
  experiments: {
    typedRoutes: true,
  },
};

export default config;
