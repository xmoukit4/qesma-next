'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, DocumentData } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/clientApp';
import Link from 'next/link';

interface Group extends DocumentData {
  id: string;
  name: string;
  description: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'groups'), (snapshot) => {
      setGroups(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Group)));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Groups</h1>
        <Link href="/groups/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create Group
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {groups.map(group => (
          <Link key={group.id} href={`/groups/${group.id}`}>
            <a className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-2xl font-semibold mb-2">{group.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">{group.description}</p>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
