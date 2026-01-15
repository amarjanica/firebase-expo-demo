import AppleLogin from '@/auth/apple-login/AppleLogin';
import { useColorScheme, View } from 'react-native';
import GoogleLogin from '@/auth/google-login/GoogleLogin';
import { useTheme } from 'react-native-paper';

const LoginScreen = () => {
  const theme = useTheme();

  return (
    <View style={{ gap: 8 }}>
      <GoogleLogin />
      <AppleLogin
        dark={theme.dark}
        cornerRadius={theme.roundness}
        style={{
          height: 44,
        }}
      />
    </View>
  );
};

export default LoginScreen;
