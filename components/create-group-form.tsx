'use client';

import { useActionState } from 'react';
import { createGroup } from '@/app/groups/actions';
import { SubmitButton } from '@/components/submit-button';

export function CreateGroupForm() {
  const [state, formAction] = useActionState(createGroup, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Group Name</label>
        <input
          type="text"
          id="name"
          name="name"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {state?.errors?.name && <p className="text-red-500 text-xs mt-1">{state.errors.name}</p>}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {state?.errors?.description && <p className="text-red-500 text-xs mt-1">{state.errors.description}</p>}
      </div>
      <SubmitButton />
      {state?.message && !state.errors && <p className="text-red-500 text-sm mt-2">{state.message}</p>}
    </form>
  );
}
