import { Button, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import firebase from '@/firebase';
import GoogleLogin from '@/google-login/GoogleLogin';
import { type FirebaseAuthTypes } from '@react-native-firebase/auth';

export default function HomeScreen() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged((user) => {
      setUser(user)
    });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {
        user ? (
          <>
            <Text>Hi, {user?.displayName}</Text>
            <Button title="Sign out" onPress={() => firebase.auth().signOut()} />
          </>
        ): (
          <>
            <GoogleLogin />
          </>
        )
      }
    </View>
  );
}
