import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FirebaseModule } from './firebase/firebase.module';
import { DeviceTokenModule } from './device-token/device-token.module';

@Module({
  imports: [FirebaseModule, DeviceTokenModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
