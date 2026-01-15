import React from 'react';

import useGoogleLogin from './useGoogleLogin';
import { Button } from 'react-native-paper';

const GoogleLogin = () => {
  const { login, inProgress } = useGoogleLogin();
  const onGoogleButtonPress = async () => {
    await login();
  };
  return (
    <Button
      mode="contained"
      disabled={inProgress}
      onPress={onGoogleButtonPress}>
      Sign in with Google
    </Button>
  );
};

export default GoogleLogin;
