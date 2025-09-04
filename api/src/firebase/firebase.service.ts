import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private app: admin.app.App;
  onModuleInit(): any {
    const serviceAccountPath = './firebase.json';
    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error(
        'Firebase service account file not found at path: ' +
          serviceAccountPath,
      );
    }
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });
    this.app = app;
  }

  auth(): admin.auth.Auth {
    return this.app.auth();
  }

  messaging(): admin.messaging.Messaging {
    return this.app.messaging();
  }
}
