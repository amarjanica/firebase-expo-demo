import React from 'react';

import useGoogleLogin from './useGoogleLogin';
import { Button } from 'react-native';

const GoogleLogin = () => {
  const { login, inProgress } = useGoogleLogin();
  const onGoogleButtonPress = async () => {
    await login();
  };
  return (
    <Button
      disabled={inProgress}
      onPress={onGoogleButtonPress}
      title="Sign in with Google"
    />
  );
};

export default GoogleLogin;
