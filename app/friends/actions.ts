'use server';

import { revalidatePath } from 'next/cache';
import { firestore, auth } from '@/lib/firebase-admin';

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
    const userId = formData.get('userId') as string;

    try {
      const recipient = await findUserByEmail(email);
  
      if (!recipient) {
        return { error: 'User not found.' };
      }
  
      if (recipient.id === userId) {
        return { error: 'You cannot send a friend request to yourself.' };
      }
  
      const friendRequestRef = firestore.collection('friendRequests').doc();
      await friendRequestRef.set({
        senderId: userId,
        receiverId: recipient.id,
        status: 'pending',
      });
  
      revalidatePath('/friends');
      return { message: 'Friend request sent.' };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function acceptFriendRequest(requestId: string, senderId: string, receiverId: string) {
    const batch = firestore.batch();
  
    const requestRef = firestore.collection('friendRequests').doc(requestId);
    batch.delete(requestRef);
  
    const receiverRef = firestore.collection('users').doc(receiverId);
    batch.update(receiverRef, { friends: firestore.FieldValue.arrayUnion(senderId) });
  
    const senderRef = firestore.collection('users').doc(senderId);
    batch.update(senderRef, { friends: firestore.FieldValue.arrayUnion(receiverId) });
  
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
    batch.update(userRef, { friends: firestore.FieldValue.arrayRemove(friendId) });
  
    const friendRef = firestore.collection('users').doc(friendId);
    batch.update(friendRef, { friends: firestore.FieldValue.arrayRemove(userId) });
  
    await batch.commit();
  
    revalidatePath('/friends');
  }
