import { Recaptcha } from '@google-cloud/recaptcha-enterprise-react-native';
import { Platform } from 'react-native';
import { RecaptchaAction } from '@google-cloud/recaptcha-enterprise-react-native';

const recaptchaClientPromise = Recaptcha.fetchClient(
  Platform.select({
    android: process.env.EXPO_PUBLIC_RECAPTCHA_ANDROID_KEY!,
    ios: process.env.EXPO_PUBLIC_RECAPTCHA_IOS_KEY!,
  })
);

export const getRecaptchaToken = async (action: string): Promise<string> => {
  const client = await recaptchaClientPromise;
  return await client.execute(RecaptchaAction.custom(action));
};
