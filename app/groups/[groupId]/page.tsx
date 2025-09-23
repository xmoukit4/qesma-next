'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/clientApp';
import { InviteFriends } from '@/components/invite-friends';

interface Group extends DocumentData {
  id: string;
  name: string;
  description: string;
}

export default function GroupDetailsPage({ params }: { params: { groupId: string } }) {
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    const groupRef = doc(firestore, 'groups', params.groupId);
    const unsubscribe = onSnapshot(groupRef, (doc) => {
      setGroup({ id: doc.id, ...doc.data() } as Group);
    });
    return () => unsubscribe();
  }, [params.groupId]);

  if (!group) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{group.name}</h1>
      <p className="text-lg text-gray-500 mb-8">{group.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Members</h2>
          {/* Member list will go here */}
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Invite Friends</h2>
          <InviteFriends groupId={params.groupId} />
        </div>
      </div>
    </div>
  );
}
