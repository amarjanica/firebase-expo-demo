import { Module } from '@nestjs/common';
import { DeviceTokenController } from './device-token.controller';
import { DeviceTokenService } from './device-token.service';

@Module({
  controllers: [DeviceTokenController],
  providers: [DeviceTokenService],
  exports: [DeviceTokenService],
})
export class DeviceTokenModule {}
