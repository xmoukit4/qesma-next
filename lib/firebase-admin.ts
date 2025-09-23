import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

  if (!serviceAccountBase64) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable is not set. Please follow the setup instructions.');
  }

  try {
    const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf8');
    const serviceAccount = JSON.parse(serviceAccountJson);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK from Base64 credentials:', error);
    throw new Error('Failed to initialize Firebase Admin SDK. The FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable may be corrupted or incorrectly encoded.');
  }
}

const firestore = admin.firestore();
const auth = admin.auth();

export { firestore, auth };
