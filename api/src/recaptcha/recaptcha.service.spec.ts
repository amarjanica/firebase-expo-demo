import { Test, TestingModule } from '@nestjs/testing';
import { RecaptchaService } from './recaptcha.service';
import { EnvConfigService } from '../config/env-config.service';
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

type CreateAssessmentResponse = Awaited<ReturnType<RecaptchaEnterpriseServiceClient['createAssessment']>>;

describe('RecaptchaService', () => {
  let service: RecaptchaService;
  beforeEach(async () => {
    const envConfigServiceMock = {
      get: jest.fn().mockImplementation((key) => {
        const map = {
          RECAPTCHA_ANDROID_KEY: 'android-site',
          RECAPTCHA_IOS_KEY: 'ios-site',
          RECAPTCHA_WEB_KEY: 'web-site',
          GOOGLE_CLOUD_PROJECT: 'test-project',
        };
        return map[key];
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecaptchaService, { provide: EnvConfigService, useValue: envConfigServiceMock }],
    }).compile();

    service = module.get<RecaptchaService>(RecaptchaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('verifies token successfully for valid android platform, valid token, matching action, and high score', async () => {
    const value: CreateAssessmentResponse = [
      {
        tokenProperties: { valid: true, action: 'login' },
        riskAnalysis: { score: 0.9 },
      },
    ] as unknown as CreateAssessmentResponse;
    jest
      .spyOn(RecaptchaEnterpriseServiceClient.prototype, 'createAssessment')
      .mockImplementation(() => Promise.resolve(value));

    const result = service.verifyToken({ token: 'token', platform: 'android', action: 'login' });

    await expect(result).resolves.toBeUndefined();
  });
});
