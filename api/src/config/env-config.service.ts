import { z } from 'zod';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const envSchema = z.object({
  FB_SERVICE_ACCOUNT_PATH: z.string(),
  FB_API_KEY: z.string(),
  FB_AUTH_DOMAIN: z.string(),
  FB_PROJECT_ID: z.string(),
  PORT: z.coerce.number().positive().default(3000),
  HOST: z.string().default('localhost'),
  MAILGUN_SENDING_KEY: z.string(),
  MAILGUN_DOMAIN: z.string(),
  MAILGUN_TO: z.email(),
  MAILGUN_FROM: z.email(),
  MAILGUN_REGION: z.enum(['US', 'EU']).default('US'),
  RECAPTCHA_ANDROID_KEY: z.string(),
  RECAPTCHA_IOS_KEY: z.string().optional().nullable(),
  RECAPTCHA_WEB_KEY: z.string().optional().nullable(),
  GOOGLE_CLOUD_PROJECT: z.string(),
});

export type EnvSchema = z.infer<typeof envSchema>;

@Injectable()
export class EnvConfigService {
  constructor(private configService: ConfigService<EnvSchema, true>) {}
  get<T extends keyof EnvSchema>(key: T): EnvSchema[T] {
    return this.configService.getOrThrow<EnvSchema[T]>(key, { infer: true }) as EnvSchema[T];
  }
}
