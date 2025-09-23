'use client';

import { useActionState } from 'react';
import { sendFriendRequest } from '@/app/friends/actions';
import { SubmitButton } from '@/components/submit-button';

export function AddFriendForm({ userId }: { userId: string }) {
  const [state, formAction] = useActionState(sendFriendRequest, null);

  return (
    <form action={formAction} className="flex items-center gap-4">
      <input type="hidden" name="userId" value={userId} />
      <input
        type="email"
        name="email"
        placeholder="Enter friend's email"
        className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <SubmitButton />
      {state?.error && <p className="text-red-500">{state.error}</p>}
      {state?.message && <p className="text-green-500">{state.message}</p>}
    </form>
  );
}
