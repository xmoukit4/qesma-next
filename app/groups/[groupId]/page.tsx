
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/clientApp';
import { InviteFriends } from '@/components/groups/invite-friends';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { GroupMembers } from '@/components/groups/group-members';
import { Badge } from '@/components/ui/badge';

interface Group extends DocumentData {
  id: string;
  name: string;
  description: string;
  category: string;
}

export default function GroupDetailsPage() {
  const params = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [params.groupId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!group) {
    return <div>Group not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
          <Link href="/groups">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Groups
            </Button>
          </Link>
      </div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>{group.name}</CardTitle>
            {group.category && <Badge>{group.category}</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-500 mb-8">{group.description}</p>
          <Tabs defaultValue="members">
            <TabsList>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="invite">Invite Friends</TabsTrigger>
            </TabsList>
            <TabsContent value="members">
              <GroupMembers groupId={params.groupId as string} />
            </TabsContent>
            <TabsContent value="invite">
              <InviteFriends groupId={params.groupId as string} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
