'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, DocumentData } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/clientApp';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import GroupCardSkeleton from '@/components/groups/group-card-skeleton';

interface Group extends DocumentData {
  id: string;
  name: string;
  description: string;
  category: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'groups'), (snapshot) => {
      setGroups(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Group)));
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Groups</h1>
        <Link href="/groups/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Group
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading && [...Array(3)].map((_, i) => <GroupCardSkeleton key={i} />)}
        {!isLoading && groups.map(group => (
          <Link key={group.id} href={`/groups/${group.id}`}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle>{group.name}</CardTitle>
                    {group.category && <Badge>{group.category}</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-gray-400">{group.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
