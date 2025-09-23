'use client';

import { useEffect, useState } from 'react';
import { firestore } from '@/lib/firebase/clientApp';
import { doc, onSnapshot, getDoc, DocumentData } from 'firebase/firestore';
import { removeFriend } from '@/app/friends/actions';
import Button from '@/components/Button';

interface Friend extends DocumentData {
    id: string;
    displayName: string;
    email: string;
}

export function FriendsList({ userId }: { userId: string }) {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    if (!userId) return;

    const userRef = doc(firestore, 'users', userId);

    const unsubscribe = onSnapshot(userRef, async (userDoc) => {
      const userData = userDoc.data();
      if (userData && userData.friends) {
        const friendPromises = userData.friends.map((friendId: string) =>
          getDoc(doc(firestore, 'users', friendId))
        );
        const friendDocs = await Promise.all(friendPromises);
        const friendData = friendDocs.map((doc) => ({ id: doc.id, ...doc.data() } as Friend));
        setFriends(friendData);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <ul className="space-y-4">
      {friends.map((friend) => (
        <li key={friend.id} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div>
            <p className="font-semibold">{friend.displayName}</p>
            <p className="text-sm text-gray-500">{friend.email}</p>
          </div>
          <form action={() => removeFriend(friend.id, userId)}>
            <Button type="submit" variant="destructive">Remove</Button>
          </form>
        </li>
      ))}
    </ul>
  );
}
