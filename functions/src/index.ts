import {logger, setGlobalOptions} from 'firebase-functions';

import {HttpsError, onCall} from 'firebase-functions/https';
import z from 'zod';
import {withValidation} from './middlewares';
import {
  RecaptchaEnterpriseServiceClient,
} from '@google-cloud/recaptcha-enterprise';
import {defineString} from 'firebase-functions/params';
setGlobalOptions({maxInstances: 10});

const recaptchaClient = new RecaptchaEnterpriseServiceClient();

const recaptchaSiteKeyIos = defineString('RECAPTCHA_IOS_SITE_KEY');
const recaptchaSiteKeyAndroid = defineString('RECAPTCHA_ANDROID_SITE_KEY');

const VerifyRecaptchaSchema = z.object({
  token: z.string(),
  platform: z.enum(['ios', 'android']),
});
// const minimumRiskScore = 0.5;
export const verifyRecaptcha = onCall(
  withValidation(VerifyRecaptchaSchema)(async (request) => {
    try {
      const {token, platform} = request.data;
      const expectedAction = 'verifyRecaptcha';
      const assessment = await recaptchaClient.createAssessment({
        parent: `projects/${process.env.GCLOUD_PROJECT}`,
        assessment: {
          event: {
            token,
            siteKey: platform === 'ios' ?
              recaptchaSiteKeyIos.value() : recaptchaSiteKeyAndroid.value(),
            expectedAction,
          },
        },
      });

      const tokenProperties = assessment[0].tokenProperties;

      if (!tokenProperties?.valid) {
        throw new HttpsError('permission-denied', 'Invalid reCAPTCHA token');
      }
      if (expectedAction && tokenProperties.action !== expectedAction) {
        throw new HttpsError('permission-denied', 'reCAPTCHA action mismatch');
      }

      // const riskScore = assessment[0].riskAnalysis?.score ?? 0;
      // logger.info('reCAPTCHA risk score:', assessment[0].riskAnalysis);
      // if (riskScore < minimumRiskScore) {
      //   throw new HttpsError('permission-denied', 'Low reCAPTCHA score');
      // }

      return {
        message: 'reCAPTCHA verification successful',
      };
    } catch (error) {
      logger.error('Error verifying reCAPTCHA');
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError('internal', 'Internal server error');
    }
  }));
