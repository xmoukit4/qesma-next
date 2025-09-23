'use server';

import { revalidatePath } from 'next/cache';
import { firestore } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';

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

const createGroupSchema = z.object({
  name: z.string().min(1, { message: 'Group name is required' }),
})

export async function createGroup(prevState: { message: string | null; errors: { [key: string]: string[] | undefined }; }, formData: FormData) {
  const validatedFields = createGroupSchema.safeParse({
    name: formData.get('name'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Group.',
    }
  }

  // In a real application, you would save the group to a database.
  console.log('Creating group:', validatedFields.data.name);

  return { message: 'Successfully created group!', errors: {} }
}

const joinGroupSchema = z.object({
  code: z.string().min(6, { message: 'Group code must be 6 characters long' }),
});

export async function joinGroup(prevState: { message: string | null; errors: { [key: string]: string[] | undefined }; }, formData: FormData) {
  const validatedFields = joinGroupSchema.safeParse({
    code: formData.get('code'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid group code.',
    };
  }

  // In a real application, you would find and join the group.
  console.log('Joining group with code:', validatedFields.data.code);

  return { message: 'Successfully joined group!', errors: {} };
}
