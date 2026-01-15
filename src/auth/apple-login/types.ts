import { StyleProp, ViewStyle } from 'react-native';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

export type Props = {
  dark: boolean;
  cornerRadius?: number;
  style?: StyleProp<ViewStyle> | undefined;
  onLoggedIn?: (usr: FirebaseAuthTypes.UserCredential) => Promise<void>;
  onError?: (error: Error) => Promise<void>;
};
