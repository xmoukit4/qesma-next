'use client';
import { useAuth } from '@/context/AuthContext';
import { AddFriendForm } from '@/components/add-friend-form';
import { FriendRequestsList } from '@/components/friend-requests-list';
import { FriendsList } from '@/components/friends-list';

export default function FriendsPage() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-4xl font-bold mb-8'>Friends</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div>
          <h2 className='text-2xl font-semibold mb-4'>Add Friend</h2>
          <AddFriendForm />
        </div>
        <div>
          <h2 className='text-2xl font-semibold mb-4'>Friend Requests</h2>
          <FriendRequestsList userId={user.uid} />
        </div>
        <div className='md:col-span-2'>
          <h2 className='text-2xl font-semibold mb-4'>Your Friends</h2>
          <FriendsList userId={user.uid} />
        </div>
      </div>
    </div>
  );
}
