'use client';

import { useActionState } from 'react';
import { sendFriendRequest } from '@/app/friends/actions';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';

function SubmitButton({ isLoadingToken }: { isLoadingToken: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = pending || isLoadingToken;

  return (
    <button 
      type="submit" 
      disabled={isDisabled}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
    >
      {pending ? 'Sending...' : 'Send Request'}
    </button>
  );
}

export function AddFriendForm() { 
  const { user } = useAuth();
  const [idToken, setIdToken] = useState('');
  const [isLoadingToken, setIsLoadingToken] = useState(true);
  const [state, formAction] = useActionState(sendFriendRequest, { message: '', error: '' });

  useEffect(() => {
    if (user) {
      user.getIdToken().then(token => {
        setIdToken(token);
        setIsLoadingToken(false);
      });
    }
  }, [user]);

  return (
    <form action={formAction} className="flex items-center gap-4">
      <input type="hidden" name="idToken" value={idToken} />
      <input
        type="email"
        name="email"
        placeholder="Enter friend's email"
        className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <SubmitButton isLoadingToken={isLoadingToken} />
      {state?.error && <p className="text-red-500 text-sm mt-2">{state.error}</p>}
      {state?.message && <p className="text-green-500 text-sm mt-2">{state.message}</p>}
    </form>
  );
}
