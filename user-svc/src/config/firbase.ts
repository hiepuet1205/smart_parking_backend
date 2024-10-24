import * as admin from 'firebase-admin';
import * as path from 'path';

const serviceAccount = path.resolve(__dirname, '../../serviceAccountKey.json');

export const firebaseAdminProvider = {
  provide: 'FIREBASE_ADMIN',
  useFactory: () => {
    const defaultApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    return { defaultApp };
  },
};
