'use server';

import { z } from 'zod';
import { auth } from '@/lib/firebase-admin';
import { firestore } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const addFriendSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

export async function addFriendByEmail(prevState: { errors?: { email?: string[] }; message?: string }, formData: FormData) {
  const validatedFields = addFriendSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: ''
    };
  }

  try {
    const currentUser = await auth.verifyIdToken(formData.get('idToken') as string);
    if (!currentUser) {
      return { errors: {}, message: 'You must be logged in to add friends.' };
    }

    const friendUserRecord = await auth.getUserByEmail(validatedFields.data.email);
    if (!friendUserRecord) {
      return { errors: { email: ['User not found'] }, message: '' };
    }

    const currentUserRef = firestore.collection('users').doc(currentUser.uid);
    const friendUserRef = firestore.collection('users').doc(friendUserRecord.uid);

    await firestore.runTransaction(async (transaction) => {
      transaction.update(currentUserRef, { friends: FieldValue.arrayUnion(friendUserRecord.uid) });
      transaction.update(friendUserRef, { friends: FieldValue.arrayUnion(currentUser.uid) });
    });

    return { errors: {}, message: 'Friend added successfully!' };

  } catch {
    return { errors: {}, message: 'An error occurred while adding the friend.' };
  }
}
