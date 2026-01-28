import { useFonts } from 'expo-font';
import { Slot, useLocalSearchParams, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Platform, StyleSheet } from 'react-native';
import firebase from '@/firebase';
import { RCProvider } from '@/revenuecat';
import ThemedProvider from '@/theme/ThemeProvider';
import * as Sentry from '@sentry/react-native';

import { connectFunctionsEmulator, getFunctions } from '@react-native-firebase/functions';

const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
connectFunctionsEmulator(getFunctions(), host, 5001);

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  debug: __DEV__,
  environment: __DEV__ ? `development-${Platform.OS}` : `production-${Platform.OS}`,
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout: React.FC = () => {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const pathname = usePathname();
  const params = useLocalSearchParams();
  useEffect(() => {
    if (Platform.OS === 'web') {
      void firebase.analytics().logScreenView({
        screen_name: pathname,
        screen_class: pathname,
        firebase_screen: pathname,
        firebase_screen_class: pathname,
        params: JSON.stringify(params),
      });
    }
  }, [pathname, params]);

  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={StyleSheet.absoluteFill}>
        <RCProvider>
          <ThemedProvider>
            <Slot />
          </ThemedProvider>
        </RCProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const WrappedRoot = Sentry.wrap(RootLayout);

export default function Layout() {
  return <WrappedRoot />;
}
