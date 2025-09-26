import firebase from '@/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import React from 'react';

import { Value } from './types';
const provider = new GoogleAuthProvider();
const auth = firebase.auth;

const useLogin = (): Value => {
  const [inProgress, setInProgress] = React.useState(false);
  const handleLogin = async () => {
    setInProgress(true);
    await signInWithPopup(auth() as any, provider);
    setInProgress(false);
  };

  return {
    inProgress,
    login: handleLogin,
  };
};

export default useLogin;
