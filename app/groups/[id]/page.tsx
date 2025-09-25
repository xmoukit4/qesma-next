'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/clientApp';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import GroupDetailsSkeleton from '@/components/groups/group-details-skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Group extends DocumentData {
  id: string;
  name: string;
  description: string;
  category: string;
}

export default function GroupDetailsPage() {
  const params = useParams();
  const { id } = params;
  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const docRef = doc(firestore, 'groups', id as string);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setGroup({ id: doc.id, ...doc.data() } as Group);
      } else {
        // Handle group not found
        console.error("Group not found");
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

  if (isLoading) {
    return (
        <div className="container mx-auto px-4 py-8">
            <GroupDetailsSkeleton />
        </div>
    );
  }

  if (!group) {
    return (
        <div className="container mx-auto px-4 py-8">
            <p>Group not found.</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <div className='flex justify-between items-center mb-8'>
            <div>
                <h1 className="text-4xl font-bold">{group.name}</h1>
                <p className="text-muted-foreground">
                    {group.description}
                </p>
            </div>
            <Link href={`/groups/${id}/edit`}>
                <Button>Edit Group</Button>
            </Link>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Group Details</CardTitle>
                {group.category && <CardDescription>{group.category}</CardDescription>}
            </CardHeader>
            <CardContent>
                {/* Add more group details here */}
            </CardContent>
        </Card>
    </div>
  );
}
