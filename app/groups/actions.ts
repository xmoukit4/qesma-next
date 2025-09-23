'use server';

import { revalidatePath } from 'next/cache';
import { firestore } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/firebase-admin';

// Action to create a new group
const createGroupSchema = z.object({
  name: z.string().min(1, { message: 'Group name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
});

export async function createGroup(prevState: any, formData: FormData) {
  const validatedFields = createGroupSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Group.',
    };
  }
  
  // This part needs a proper way to get the current user's ID.
  // For now, let's assume a function getUserId() exists.
  // In a real app, this would come from your auth provider (e.g., Clerk, NextAuth, or Firebase Auth session).
  const uid = (await auth.verifyIdToken(cookies().get('fb-token').value)).uid


  const { name, description } = validatedFields.data;
  const groupRef = firestore.collection('groups').doc();
  await groupRef.set({
    name,
    description,
    members: [uid], // Creator is the first member
    createdBy: uid,
  });

  redirect(`/groups/${groupRef.id}`);
}

// Action to invite friends to a group
export async function inviteFriendsToGroup(groupId: string, friendIds: string[]) {
  const uid = (await auth.verifyIdToken(cookies().get('fb-token').value)).uid
  const invitationsCollection = firestore.collection('groupInvitations');

  const batch = firestore.batch();

  friendIds.forEach(friendId => {
    const invitationRef = invitationsCollection.doc();
    batch.set(invitationRef, {
      groupId,
      senderId: uid,
      receiverId: friendId,
      createdAt: FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();

  revalidatePath(`/groups/${groupId}`);
}

// Action to accept a group invitation
export async function acceptGroupInvitation(invitationId: string) {
  const invitationRef = firestore.collection('groupInvitations').doc(invitationId);
  const invitationDoc = await invitationRef.get();

  if (!invitationDoc.exists) {
    throw new Error('Invitation not found');
  }

  const { groupId, receiverId } = invitationDoc.data()!;
  const groupRef = firestore.collection('groups').doc(groupId);

  await groupRef.update({
    members: FieldValue.arrayUnion(receiverId),
  });

  await invitationRef.delete();

  revalidatePath('/groups/invitations');
  revalidatePath(`/groups/${groupId}`);
}

// Action to decline a group invitation
export async function declineGroupInvitation(invitationId: string) {
  const invitationRef = firestore.collection('groupInvitations').doc(invitationId);
  await invitationRef.delete();

  revalidatePath('/groups/invitations');
}
