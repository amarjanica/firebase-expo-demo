import { Platform, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import fb from '@/firebase';
import Constants from 'expo-constants';

export default function HomeScreen() {
  const [fbLoaded, setFbLoaded] = useState(false);
  useEffect(() => {
    setFbLoaded(fb.running);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Firebase Loaded: {fbLoaded ? 'Y': 'N'}, Platform OS: {Platform.OS}, Ownership: {Constants.appOwnership}</Text>
    </View>
  );
}
