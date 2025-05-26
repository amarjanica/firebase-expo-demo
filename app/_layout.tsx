import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, useLocalSearchParams, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import firebase from '@/firebase';
import { RCProvider } from '@/revenuecat';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
        params: JSON.stringify(params)
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
    <RCProvider>
      <ThemeProvider value={DefaultTheme}>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <Slot/>
          </SafeAreaView>
        </SafeAreaProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </RCProvider>
  );
}
