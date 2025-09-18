import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

export const sendNotification = async (token: string, message: string) => {
  const payload = {
    notification: {
      title: 'Splitter',
      body: message,
    },
  };

  try {
    await admin.messaging().sendToDevice(token, payload);
    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
