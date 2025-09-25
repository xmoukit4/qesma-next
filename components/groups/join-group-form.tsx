'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function JoinGroupForm({ onClose }: { onClose: () => void }) {
  const [groupId, setGroupId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle joining the group
    console.log('Joining group:', groupId);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="groupId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Group ID
        </label>
        <input
          type="text"
          id="groupId"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100"
        />
      </div>
      <div className="flex justify-end space-x-4">
        <Button type="button" onClick={onClose} variant="outline">
          Cancel
        </Button>
        <Button type="submit">Join</Button>
      </div>
    </form>
  );
}
