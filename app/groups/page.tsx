'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, DocumentData } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
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
      const newGroups = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Group));
      setGroups(newGroups);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Groups</h1>
        <Link href="/dashboard">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Dashboard
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {groups.map((group) => (
          <Link href={`/groups/${group.id}`} key={group.id}>
            <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{group.name}</h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">{group.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
