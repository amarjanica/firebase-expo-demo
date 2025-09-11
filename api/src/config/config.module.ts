import { Global, Module } from '@nestjs/common';
import { EnvConfigService, envSchema } from './env-config.service';
import { ConfigModule as NestjsConfigModule } from '@nestjs/config/dist/config.module';

@Global()
@Module({
  imports: [
    NestjsConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: (data) => envSchema.parse(data),
    }),
  ],
  providers: [EnvConfigService],
  exports: [EnvConfigService],
})
export class ConfigModule {}
