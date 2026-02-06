import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FirebaseModule } from './firebase/firebase.module';
import { DeviceTokenModule } from './device-token/device-token.module';
import { ConfigModule } from './config/config.module';
import { EventModule } from './event/event.module';
import { RecaptchaService } from './recaptcha/recaptcha.service';
import { MailgunService } from './mailgun/mailgun.service';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    FirebaseModule.forRoot({
      exclude: ['/api', '/api-json', '/feedback'],
    }),
    DeviceTokenModule,
    ConfigModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [RecaptchaService, MailgunService],
})
export class AppModule {}
