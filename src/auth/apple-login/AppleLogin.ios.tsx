import auth from '@react-native-firebase/auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import React from 'react';
import { Props } from '@/auth/apple-login/types';

const AppleLogin: React.FC<Props> = ({
  onLoggedIn,
  onError,
  cornerRadius,
  dark,
  style = { minWidth: 240, width: '100%', height: 120 },
}) => {
  const onAppleButtonPress = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
      }

      const appleCredential = auth.AppleAuthProvider.credential(credential.identityToken);
      const usr = await auth().signInWithCredential(appleCredential);
      await onLoggedIn(usr);
    } catch (err) {
      if (err.code === 'ERR_REQUEST_CANCELED') {
        // User cancelled the sign-in flow, do nothing
        return;
      } else {
        await onError(err);
      }
    }
  };

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={
        dark
          ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
          : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
      }
      cornerRadius={cornerRadius}
      style={style}
      onPress={onAppleButtonPress}
    />
  );
};

export default AppleLogin;
