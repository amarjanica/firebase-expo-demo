import { Body, Controller, Logger, Post } from '@nestjs/common';
import { type RegisterDeviceToken, RegisterDeviceTokenSchema } from './schema';
import { DeviceTokenService } from './device-token.service';
import { ZodValidatorPipe } from '../zod-validator.pipe';

@Controller('device-token')
export class DeviceTokenController {
  private readonly logger = new Logger(DeviceTokenController.name);
  constructor(private readonly deviceTokenService: DeviceTokenService) {}

  @Post('register')
  registerDeviceToken(
    @Body(new ZodValidatorPipe(RegisterDeviceTokenSchema))
    data: RegisterDeviceToken,
  ) {
    this.logger.log(`Registering device token: ${data.token}`);
    this.deviceTokenService.registerDeviceToken(data);
  }
}
