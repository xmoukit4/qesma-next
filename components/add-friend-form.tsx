'use client';

import { useFormState } from 'react-dom';
import { sendFriendRequest } from '@/app/friends/actions';
import { SubmitButton } from '@/components/submit-button';

export function AddFriendForm() {
  const [state, formAction] = useFormState(sendFriendRequest, null);

  return (
    <form action={formAction} className="flex items-center gap-4">
      <input
        type="email"
        name="email"
        placeholder="Enter friend's email"
        className="input input-bordered w-full"
        required
      />
      <SubmitButton />
      {state?.message && <p className="text-sm text-gray-500 mt-2">{state.message}</p>}
      {state?.error && <p className="text-sm text-red-500 mt-2">{state.error}</p>}
    </form>
  );
}
