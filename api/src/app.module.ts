import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FirebaseModule } from './firebase/firebase.module';
import { DeviceTokenModule } from './device-token/device-token.module';
import { ConfigModule } from './config/config.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    FirebaseModule.forRoot({
      exclude: ['/api', '/api-json'],
    }),
    DeviceTokenModule,
    ConfigModule,
    EventModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
