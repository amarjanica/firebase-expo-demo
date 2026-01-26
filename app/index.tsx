import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Text, Button, useTheme, Divider } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import firebase from '@/firebase';
import { type FirebaseAuthTypes } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { useRC } from '@/revenuecat';
import useDeviceToken from '@/push-notifications/useDeviceToken';
import Purchases from 'react-native-purchases';
import WebsocketConnections from '@/websockets/WebsocketConnections';
import LoginScreen from '@/auth/LoginScreen';
import VerifyRecaptcha from '@/recaptcha/VerifyRecaptcha';

const Dashboard: React.FC<{ user: FirebaseAuthTypes.User }> = ({ user }) => {
  return (
    <View style={styles.dashboard}>
      <Text variant="labelLarge">Hi, {user?.displayName}</Text>
      <Button
        mode="contained"
        onPress={() => firebase.auth().signOut()}>
        Sign out
      </Button>
      <Divider />
      <WebsocketConnections user={user} />
    </View>
  );
};
export default function Page() {
  const theme = useTheme();
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const rc = useRC();

  useDeviceToken();

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(async (user) => {
      setUser(user);
      if (user?.uid) {
        if (Platform.OS !== 'web') {
          await Purchases.logIn(user.uid);
          const customerInfo = await Purchases.getCustomerInfo();
          rc.setCustomerInfo(customerInfo);
        }
      }
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={[styles.root, { backgroundColor: theme.colors.background }]}>
      {user ? <Dashboard user={user} /> : <LoginScreen />}
      {rc?.isConfigured &&
        (rc.isSubscriber ? (
          <Text>You're subscribed</Text>
        ) : (
          <Button
            mode="contained"
            onPress={() => router.push('/subscribe')}>
            Subscribe
          </Button>
        ))}
      <VerifyRecaptcha />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  dashboard: {
    flex: 1,
    width: '100%',
    maxWidth: 400,
    flexDirection: 'column',
    gap: 16,
  },
});
