'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createGroup } from '@/app/groups/actions';
import Button from './Button';

const initialState = {
  message: null,
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" aria-disabled={pending}>
      Create
    </Button>
  );
}

export function CreateGroupForm({ onClose }: { onClose: () => void }) {
  const [state, formAction] = useFormState(createGroup, initialState);

  return (
    <form action={formAction}>
      <div className="flex flex-col space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Group Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            aria-describedby="name-error"
          />
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className='text-black'>
            Cancel
          </button>
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}
