import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { RegisterDeviceToken } from './schema';

@Injectable()
export class DeviceTokenService {
  constructor(private readonly firebaseService: FirebaseService) {}
  private readonly logger = new Logger(DeviceTokenService.name);
  private deviceTokens = new Set<string>();

  registerDeviceToken(data: RegisterDeviceToken) {
    this.deviceTokens.add(data.token);
    this.logger.log(`Registered device token: ${data.token}`);
  }

  async broadcastMessage(title: string, message: string) {
    if (this.deviceTokens.size == 0) {
      this.logger.log('No subscribed device tokens to send message to.');
      return;
    }
    const tokens = Array.from(this.deviceTokens);
    this.logger.log(
      `Broadcasting message to ${this.deviceTokens.size} device tokens.`,
    );
    const bachRes = await this.firebaseService
      .messaging()
      .sendEachForMulticast({
        tokens,
        notification: { title, body: message },
        android: { priority: 'high' },
        apns: { payload: { aps: { sound: 'default' } } },
      });

    bachRes.responses.forEach((value, index) => {
      if (!value.success) {
        this.deviceTokens.delete(tokens[index]);
      }
    });
    this.logger.log(
      `Broadcasting message successfully to ${this.deviceTokens.size} device tokens.`,
    );
  }
}
