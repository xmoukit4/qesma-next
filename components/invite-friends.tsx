'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { firestore } from '@/lib/firebase';
import { doc, onSnapshot, getDoc, DocumentData } from 'firebase/firestore';
import { inviteFriendsToGroup } from '@/app/groups/actions';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface Friend extends DocumentData {
    id: string;
    displayName: string;
}

export function InviteFriends({ groupId }: { groupId: string }) {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;

    const userRef = doc(firestore, 'users', user.uid);

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
  }, [user]);

  const handleSelectFriend = (friendId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId]
    );
  };

  const handleInvite = async () => {
    await inviteFriendsToGroup(groupId, selectedFriends);
    setSelectedFriends([]);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {friends.map((friend) => (
          <div key={friend.id} className="flex items-center gap-4">
            <Checkbox
              id={friend.id}
              checked={selectedFriends.includes(friend.id)}
              onCheckedChange={() => handleSelectFriend(friend.id)}
            />
            <label htmlFor={friend.id} className="font-semibold">
              {friend.displayName}
            </label>
          </div>
        ))}
      </div>
      <Button onClick={handleInvite} disabled={selectedFriends.length === 0}>
        Invite Selected Friends
      </Button>
    </div>
  );
}
