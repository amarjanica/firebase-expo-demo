import { Injectable } from '@nestjs/common';
import { EnvConfigService } from '../config/env-config.service';
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';
import { RecaptchaActionMismatchException, RecaptchaLowScoreException, RecaptchaTokenInvalidException } from './errors';

@Injectable()
export class RecaptchaService {
  private client = new RecaptchaEnterpriseServiceClient();
  private riskThreshold = 0.5;
  constructor(private envConfigService: EnvConfigService) {}

  async verifyToken({ token, platform, action }: { token: string; platform: string; action: string }): Promise<void> {
    const keyMap = {
      android: this.envConfigService.get('RECAPTCHA_ANDROID_KEY'),
      ios: this.envConfigService.get('RECAPTCHA_IOS_KEY'),
      web: this.envConfigService.get('RECAPTCHA_WEB_KEY'),
    };
    const siteKey = keyMap[platform];
    if (!siteKey) {
      throw new RecaptchaTokenInvalidException();
    }
    const projectId = this.envConfigService.get('GOOGLE_CLOUD_PROJECT');

    const [response] = await this.client.createAssessment({
      parent: `projects/${projectId}`,
      assessment: {
        event: {
          token,
          siteKey,
          expectedAction: action,
        },
      },
    });

    if (!response.tokenProperties?.valid) {
      throw new RecaptchaTokenInvalidException();
    }

    if (response.tokenProperties.action !== action) {
      throw new RecaptchaActionMismatchException();
    }

    if ((response.riskAnalysis?.score ?? 0) < this.riskThreshold) {
      throw new RecaptchaLowScoreException();
    }
  }
}
