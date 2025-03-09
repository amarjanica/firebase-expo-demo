import { Button, Platform, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import firebase from '@/firebase';
import Constants from 'expo-constants';

export default function HomeScreen() {
  const [fbLoaded, setFbLoaded] = useState(false);
  useEffect(() => {
    setFbLoaded(firebase.running);
  }, []);

  const handleClick = async () => {
    await firebase.analytics().logEvent('expo_event', { os: Platform.OS, ownership: Constants.appOwnership ?? 'N/A' });
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Firebase Loaded: {fbLoaded ? 'Y': 'N'}, Platform OS: {Platform.OS}, Ownership: {Constants.appOwnership}</Text>
      <Button title="Click me!" onPress={handleClick} />
    </View>
  );
}
