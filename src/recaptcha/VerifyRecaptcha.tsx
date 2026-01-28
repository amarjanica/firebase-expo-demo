import { Button } from 'react-native-paper';
import { getRecaptchaToken } from '@/recaptcha/index';
import { Alert, Platform } from 'react-native';
import { getFunctions, httpsCallable } from '@react-native-firebase/functions';

const VerifyRecaptcha = () => {
  const handleVerification = async () => {
    try {
      const action = 'verifyRecaptcha';
      const token = await getRecaptchaToken(action);

      const verifyResponse = await httpsCallable<
        {
          token: string;
          platform: typeof Platform.OS;
        },
        {
          message: string;
        }
      >(
        getFunctions(),
        'verifyRecaptcha'
      )({
        token,
        platform: Platform.OS,
      });
      const message = verifyResponse.data.message;
      Alert.alert('Recaptcha Token', message);
    } catch (error) {
      console.error('Recaptcha verification failed:', error);
      Alert.alert('Recaptcha Verification Failed', 'An error occurred during verification.');
    }
  };

  return (
    <Button
      mode="contained-tonal"
      onPress={handleVerification}>
      Verify Recaptcha
    </Button>
  );
};

export default VerifyRecaptcha;
