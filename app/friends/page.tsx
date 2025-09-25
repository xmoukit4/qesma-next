'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { firestore } from '@/lib/firebase/clientApp';
import { doc, onSnapshot, getDoc, DocumentData } from 'firebase/firestore';
import { AddFriendForm } from '@/components/friends/add-friend-form';
import FriendsList from '@/components/friends/friends-list';
import FriendsListSkeleton from '@/components/friends/friends-list-skeleton';

interface Friend extends DocumentData {
  id: string;
  displayName: string;
}

export default function FriendsPage() {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const userRef = doc(firestore, 'users', user.uid);

    const unsubscribe = onSnapshot(userRef, async (userDoc) => {
      const userData = userDoc.data();
      if (userData && userData.friends) {
        const friendPromises = userData.friends.map((friendId: string) =>
          getDoc(doc(firestore, 'users', friendId))
        );
        const friendDocs = await Promise.all(friendPromises);
        const friendData = friendDocs
          .filter(doc => doc.exists())
          .map((doc) => ({ id: doc.id, ...doc.data() } as Friend));
        setFriends(friendData);
      } else {
        setFriends([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
          <h1 className="text-4xl font-bold">Friends</h1>
          <p className="text-muted-foreground">
              Manage your friends and see who you can split expenses with.
          </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {isLoading ? <FriendsListSkeleton /> : <FriendsList friends={friends} />}
        </div>
        <div>
          <AddFriendForm />
        </div>
      </div>
    </div>
  );
}
