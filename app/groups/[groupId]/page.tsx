'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/clientApp';
import { InviteFriends } from '@/components/invite-friends';
import { CreateGroupForm } from '@/components/create-group-form';

interface Group extends DocumentData {
  id: string;
  name: string;
  description: string;
}

export default function GroupDetailsPage() {
  const params = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.groupId && params.groupId !== 'new') {
      const groupRef = doc(firestore, 'groups', params.groupId as string);
      const unsubscribe = onSnapshot(groupRef, (doc) => {
        if (doc.exists()) {
          setGroup({ id: doc.id, ...doc.data() } as Group);
        } else {
          setGroup(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [params.groupId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (params.groupId === 'new') {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Create a New Group</h1>
        <CreateGroupForm />
      </div>
    );
  }

  if (!group) {
    return <div>Group not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{group.name}</h1>
      <p className="text-lg text-gray-500 mb-8">{group.description}</p>
      <InviteFriends groupId={params.groupId as string} />
    </div>
  );
}
