'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { joinGroup } from '../app/actions';
import Button from './Button';

const initialState = {
  message: null,
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" aria-disabled={pending}>
      Join
    </Button>
  );
}

export function JoinGroupForm({ onClose }: { onClose: () => void }) {
  const [state, formAction] = useFormState(joinGroup, initialState);

  return (
    <form action={formAction}>
      <div className="flex flex-col space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Group Code
          </label>
          <input
            type="text"
            id="code"
            name="code"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            aria-describedby="code-error"
          />
          <div id="code-error" aria-live="polite" aria-atomic="true">
            {state.errors?.code &&
              state.errors.code.map((error: string) => (
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
