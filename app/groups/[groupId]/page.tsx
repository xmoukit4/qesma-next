'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/clientApp';
import { InviteFriends } from '@/components/invite-friends';

interface Group extends DocumentData {
  id: string;
  name: string;
  description: string;
}

export default function GroupDetailsPage() {
  const params = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    if (params.groupId) {
      const groupRef = doc(firestore, 'groups', params.groupId as string);
      const unsubscribe = onSnapshot(groupRef, (doc) => {
        setGroup({ id: doc.id, ...doc.data() } as Group);
      });
      return () => unsubscribe();
    }
  }, [params.groupId]);

  if (!group) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{group.name}</h1>
      <p className="text-lg text-gray-500 mb-8">{group.description}</p>
      <InviteFriends groupId={params.groupId as string} />
    </div>
  );
}
