'use server';

import { revalidatePath } from 'next/cache';
import { firestore } from '@/lib/firebase/clientApp';
import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import { redirect } from 'next/navigation';

export async function createGroup(formData: FormData) {
  const groupData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
  };

  const groupRef = await addDoc(collection(firestore, 'groups'), groupData);

  revalidatePath('/groups');
  redirect(`/groups/${groupRef.id}`);
}

export async function inviteFriendsToGroup(groupId: string, friendIds: string[]) {
    const batch = writeBatch(firestore);
  
    friendIds.forEach(friendId => {
      const memberRef = doc(collection(firestore, 'groups', groupId, 'members'));
      batch.set(memberRef, { userId: friendId });
    });
  
    await batch.commit();
    revalidatePath(`/groups/${groupId}`);
  }
