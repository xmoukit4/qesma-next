'use server';

import { revalidatePath } from 'next/cache';
import { firestore } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function inviteFriendsToGroup(groupId: string, friendIds: string[]) {
  const groupRef = firestore.collection('groups').doc(groupId);

  await groupRef.update({
    members: FieldValue.arrayUnion(...friendIds),
  });

  revalidatePath(`/groups/${groupId}`);
}

// Placeholder for adding a member to a group
export async function addMemberToGroup(groupId: string, memberEmail: string) {
  console.log(`Adding member ${memberEmail} to group ${groupId}`);
  // TODO: Implement the actual logic to add a member to the database
  
  revalidatePath(`/group/${groupId}`);
  return { success: true, message: 'Member added successfully.' };
}

// Placeholder for removing a member from a group
export async function removeMemberFromGroup(groupId: string, memberId: string) {
  console.log(`Removing member ${memberId} from group ${groupId}`);
  // TODO: Implement the actual logic to remove a member from the database

  revalidatePath(`/group/${groupId}`);
  return { success: true, message: 'Member removed successfully.' };
}
