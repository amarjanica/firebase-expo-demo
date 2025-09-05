import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import { EnvConfigService } from '../config/env-config.service';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private app: admin.app.App;

  constructor(private readonly envConfigService: EnvConfigService) {}
  onModuleInit(): any {
    const serviceAccount = this.envConfigService.get('FB_SERVICE_ACCOUNT_PATH');

    if (!fs.existsSync(serviceAccount)) {
      throw new Error(`Firebase service account file not found at path: ${serviceAccount}!`);
    }
    this.app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  auth(): admin.auth.Auth {
    return this.app.auth();
  }

  messaging(): admin.messaging.Messaging {
    return this.app.messaging();
  }
}
