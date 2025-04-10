import React from 'react';
import { Value } from '@/google-login/types';
import firebase from '@/firebase/firebaseNative';
import rnfb from '@react-native-firebase/auth';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  offlineAccess: true,
});

const useLogin = (): Value => {
  const [inProgress, setInProgress] = React.useState(false);
  const handleLogin = async () => {
    setInProgress(true);
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    if (response && response.data) {
      const googleCredential = rnfb.GoogleAuthProvider.credential(response.data.idToken);
      await firebase.auth().signInWithCredential(googleCredential);
    } else {
      console.warn('No response from GoogleSignin');
    }
    setInProgress(false);
  };
  return {
    inProgress,
    login: handleLogin,
  };
};

export default useLogin;
