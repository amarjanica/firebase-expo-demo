import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, useLocalSearchParams, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import firebase from '@/firebase';
import { RCProvider } from '@/revenuecat';
import * as Sentry from '@sentry/react-native';

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
      <SafeAreaView style={{ flex: 1 }}>
        <RCProvider>
          <ThemeProvider value={DefaultTheme}>
            <Slot />
            <StatusBar style="auto" />
          </ThemeProvider>
        </RCProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const WrappedRoot = Sentry.wrap(RootLayout);

export default function Layout() {
  return <WrappedRoot />;
}
