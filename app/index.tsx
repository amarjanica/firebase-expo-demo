import { Button, Platform, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import firebase from '@/firebase';
import GoogleLogin from '@/google-login/GoogleLogin';
import { type FirebaseAuthTypes } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { useRC } from '@/revenuecat';
import useDeviceToken from '@/push-notifications/useDeviceToken';
import Purchases from 'react-native-purchases';
import * as Sentry from '@sentry/react-native';

export default function Page() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const ctx = useRC();
  const handleCrash = () => {
    firebase.crashlytics().log('Something');
    firebase.crashlytics().setAttribute('testing', __DEV__ ? 'Y' : 'N');
    firebase.crashlytics().crash();
  };
  const handleSentry = () => {
    Sentry.captureException(new Error('test'));
  };

  useDeviceToken();

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(async (user) => {
      setUser(user);
      if (user?.uid) {
        if (Platform.OS !== 'web') {
          await Purchases.logIn(user.uid);
          const customerInfo = await Purchases.getCustomerInfo();
          ctx.setCustomerInfo(customerInfo);
        }
      }
    });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 }}>
      {user ? (
        <>
          <Text>Hi, {user?.displayName}</Text>
          <Button
            title="Sign out"
            onPress={() => firebase.auth().signOut()}
          />
        </>
      ) : (
        <>
          <GoogleLogin />
        </>
      )}
      {ctx?.isConfigured &&
        (ctx.isSubscriber ? (
          <Text>You're subscribed</Text>
        ) : (
          <Button
            title="Subscribe"
            onPress={() => router.push('/subscribe')}
          />
        ))}
      <Button
        title="Crash"
        onPress={handleCrash}
      />
      <Button
        title="Sentry Log"
        onPress={handleSentry}
      />
    </View>
  );
}
