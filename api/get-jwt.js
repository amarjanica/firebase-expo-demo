import fbAdmin from 'firebase-admin';
import { config } from 'dotenv';
import { initializeAuth, signInWithCustomToken } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import * as child_process from 'node:child_process';
import serviceAccount from './firebase.json' with { type: 'json' };

config();

const firebaseId = process.argv[2];
if (!firebaseId) {
  console.error('Missing Firebase UID. Usage: node script.js <firebaseId>');
  process.exit(1);
}

const adminApp = fbAdmin.initializeApp({
  credential: fbAdmin.credential.cert(serviceAccount),
});

const webConfig = child_process
  .execSync(
    `firebase --project ${serviceAccount.project_id} apps:sdkconfig web`,
  )
  .toString()
  .trim();

const app = initializeApp(JSON.parse(webConfig));
const clientAuth = initializeAuth(app);

adminApp
  .auth()
  .createCustomToken(firebaseId)
  .then(async (customToken) => {
    const userCredential = await signInWithCustomToken(clientAuth, customToken);
    const idToken = await userCredential.user.getIdToken();
    console.log(idToken);
  })
  .catch((err) => {
    console.error('Error generating token:', err);
    process.exit(1);
  });

export default {};
