'use client';

import { useEffect, useState } from 'react';
import { firestore } from '@/lib/firebase/clientApp';
import { collection, query, where, onSnapshot, getDoc, doc, DocumentData } from 'firebase/firestore';
import { acceptFriendRequest, rejectFriendRequest } from '@/app/friends/actions';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-provider';

interface Sender extends DocumentData {
    displayName: string;
    email: string;
}

interface FriendRequest extends DocumentData {
    id: string;
    sender: Sender;
    senderId: string;
}

export function FriendRequestsList() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(firestore, 'friendRequests'), where('receiverId', '==', user.uid));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const newRequests = await Promise.all(
        snapshot.docs.map(async (document) => {
          const request = document.data();
          const senderDoc = await getDoc(doc(firestore, 'users', request.senderId));
          return { id: document.id, ...request, sender: senderDoc.data() } as FriendRequest;
        })
      );
      setRequests(newRequests);
    });

    return () => unsubscribe();
  }, [user]);

  if (requests.length === 0) {
    return <p>No pending friend requests.</p>;
  }

  return (
    <ul className="space-y-4">
      {requests.map((request) => (
        <li key={request.id} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div>
            <p className="font-semibold">{request.sender.displayName}</p>
            <p className="text-sm text-gray-500">{request.sender.email}</p>
          </div>
          <div className="flex gap-2">
            <form action={() => acceptFriendRequest(request.id, request.senderId)}>
              <Button type="submit">Accept</Button>
            </form>
            <form action={() => rejectFriendRequest(request.id)}>
              <Button type="submit" variant="destructive">Decline</Button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}
