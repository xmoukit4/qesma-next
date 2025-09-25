
'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, getDoc, DocumentData } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/clientApp';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Member extends DocumentData {
  id: string;
  displayName: string;
  photoURL?: string;
}

export function GroupMembers({ groupId }: { groupId: string }) {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const groupMembersRef = collection(firestore, 'groups', groupId, 'members');
    const unsubscribe = onSnapshot(groupMembersRef, async (snapshot) => {
      const memberPromises = snapshot.docs.map(async (memberDoc) => {
        const memberData = memberDoc.data();
        const userDoc = await getDoc(doc(firestore, 'users', memberData.userId));
        if (userDoc.exists()) {
          return { id: userDoc.id, ...userDoc.data() } as Member;
        }
        return null;
      });

      const resolvedMembers = (await Promise.all(memberPromises)).filter(Boolean) as Member[];
      setMembers(resolvedMembers);
    });

    return () => unsubscribe();
  }, [groupId]);

  if (members.length === 0) {
    return <p>No members yet.</p>;
  }

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <div key={member.id} className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={member.photoURL} alt={member.displayName} />
            <AvatarFallback>{member.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-semibold">{member.displayName}</span>
        </div>
      ))}
    </div>
  );
}
