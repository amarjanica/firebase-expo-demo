import { Test, TestingModule } from '@nestjs/testing';
import { MailgunService } from './mailgun.service';
import { EnvConfigService } from '../config/env-config.service';

describe('MailgunService', () => {
  let service: MailgunService;

  beforeEach(async () => {
    const envConfigServiceMock = {
      get: jest.fn().mockImplementation((key) => {
        const map = {
          MAILGUN_SENDING_KEY: 'mailgun-key',
        };
        if (!(key in map)) {
          throw new Error(`Unexpected key: ${key}`);
        }
        return map[key];
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailgunService, { provide: EnvConfigService, useValue: envConfigServiceMock }],
    }).compile();

    service = module.get<MailgunService>(MailgunService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
