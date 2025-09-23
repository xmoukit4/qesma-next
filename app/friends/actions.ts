'use server';

import { revalidatePath } from 'next/cache';
import { firestore, auth } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

async function findUserByEmail(email: string) {
  const usersRef = firestore.collection('users');
  const query = usersRef.where('email', '==', email).limit(1);
  const snapshot = await query.get();

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs[0];
}

export async function sendFriendRequest(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const idToken = formData.get('idToken') as string;

    if (!idToken) {
      return { error: 'Authentication token is missing. Please try again.' };
    }

    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      const senderId = decodedToken.uid;

      const recipient = await findUserByEmail(email);
  
      if (!recipient) {
        return { error: 'User not found.' };
      }
  
      if (recipient.id === senderId) {
        return { error: 'You cannot send a friend request to yourself.' };
      }
  
      const friendRequestRef = firestore.collection('friendRequests').doc();
      await friendRequestRef.set({
        senderId: senderId,
        receiverId: recipient.id,
        status: 'pending',
      });
  
      revalidatePath('/friends');
      return { message: 'Friend request sent.' };
    } catch (error: any) {
      return { error: 'Invalid authentication token or user not found.' };
    }
  }
  
  export async function acceptFriendRequest(requestId: string, senderId: string, receiverId: string) {
    const batch = firestore.batch();
  
    const requestRef = firestore.collection('friendRequests').doc(requestId);
    batch.delete(requestRef);
  
    const receiverRef = firestore.collection('users').doc(receiverId);
    batch.update(receiverRef, { friends: FieldValue.arrayUnion(senderId) });
  
    const senderRef = firestore.collection('users').doc(senderId);
    batch.update(senderRef, { friends: FieldValue.arrayUnion(receiverId) });
  
    await batch.commit();
  
    revalidatePath('/friends');
  }
  
  export async function rejectFriendRequest(requestId: string) {
    await firestore.collection('friendRequests').doc(requestId).delete();
    revalidatePath('/friends');
  }
  
  export async function removeFriend(friendId: string, userId: string) {
    const batch = firestore.batch();
  
    const userRef = firestore.collection('users').doc(userId);
    batch.update(userRef, { friends: FieldValue.arrayRemove(friendId) });
  
    const friendRef = firestore.collection('users').doc(friendId);
    batch.update(friendRef, { friends: FieldValue.arrayRemove(userId) });
  
    await batch.commit();
  
    revalidatePath('/friends');
  }
