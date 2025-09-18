'use server';

import { revalidatePath } from 'next/cache';
import { firestore } from '@/lib/firebase-admin';
import { auth } from '@/lib/auth';

async function findUserByEmail(email: string) {
  const usersRef = firestore.collection('users');
  const snapshot = await usersRef.where('email', '==', email).limit(1).get();
  if (snapshot.empty) {
    return null;
  }
  return snapshot.docs[0];
}

export async function sendFriendRequest(prevState: { message?: string, error?: string }, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "You must be logged in to send friend requests." };
    }
    const senderId = session.user.id;
    const email = formData.get('email') as string;

    if (!email) {
        return { error: "Email is required." };
    }

  const receiverRecord = await findUserByEmail(email);

  if (!receiverRecord) {
    return { error: 'User not found.' };
  }

  const receiverId = receiverRecord.id;

  if (senderId === receiverId) {
    return { error: "You can't add yourself as a friend." };
  }

  const senderRef = firestore.collection('users').doc(senderId);
  const senderDoc = await senderRef.get();
  const senderData = senderDoc.data();

  if (senderData?.friends?.includes(receiverId)) {
    return { error: 'You are already friends with this user.' };
  }

  const existingRequestQuery = await firestore
    .collection('friendRequests')
    .where('senderId', 'in', [senderId, receiverId])
    .where('receiverId', 'in', [senderId, receiverId])
    .get();

  if (!existingRequestQuery.empty) {
    return { error: 'A friend request already exists between you and this user.' };
  }

  await firestore.collection('friendRequests').add({
    senderId,
    receiverId,
    status: 'pending',
    createdAt: new Date(),
  });

  revalidatePath('/friends');
  return { message: 'Friend request sent successfully!' };
}

export async function acceptFriendRequest(requestId: string, senderId:string, receiverId:string) {
    const requestRef = firestore.collection('friendRequests').doc(requestId);

    const senderRef = firestore.collection('users').doc(senderId);
    const receiverRef = firestore.collection('users').doc(receiverId);

    await firestore.runTransaction(async (transaction) => {
        transaction.delete(requestRef);
        transaction.update(senderRef, { friends: firestore.FieldValue.arrayUnion(receiverId) });
        transaction.update(receiverRef, { friends: firestore.FieldValue.arrayUnion(senderId) });
    });

    revalidatePath('/friends');
}

export async function rejectFriendRequest(requestId: string) {
    await firestore.collection('friendRequests').doc(requestId).delete();
    revalidatePath('/friends');
}

export async function removeFriend(userId: string, friendId: string) {
    const userRef = firestore.collection('users').doc(userId);
    const friendRef = firestore.collection('users').doc(friendId);

    await firestore.runTransaction(async (transaction) => {
        transaction.update(userRef, { friends: firestore.FieldValue.arrayRemove(friendId) });
        transaction.update(friendRef, { friends: firestore.FieldValue.arrayRemove(userId) });
    });

    revalidatePath('/friends');
}
