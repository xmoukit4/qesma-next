import admin from 'firebase-admin';

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error('The FIREBASE_PRIVATE_KEY environment variable is not set.');
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey.replace(/\n/g, '\n'),
    }),
  });
}

const firestore = admin.firestore();
const auth = admin.auth();

export { firestore, auth };
