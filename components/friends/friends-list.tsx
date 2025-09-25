'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DocumentData } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Friend extends DocumentData {
  id: string;
  displayName: string;
  photoURL?: string;
}

interface FriendsListProps {
  friends: Friend[];
}

export default function FriendsList({ friends }: FriendsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Friends</CardTitle>
        <CardDescription>A list of all your friends.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {friends.map((friend) => (
            <div key={friend.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted">
              <Avatar>
                <AvatarImage src={friend.photoURL} />
                <AvatarFallback>{friend.displayName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{friend.displayName}</p>
                <p className="text-sm text-muted-foreground">{friend.email}</p>
              </div>
            </div>
          ))}
          {friends.length === 0 && (
              <p className="text-center text-muted-foreground">You haven't added any friends yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
