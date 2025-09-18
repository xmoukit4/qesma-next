
"use client";

import { removeFriend } from "../actions";
import { TrashIcon } from "@heroicons/react/24/outline";

// Mock data for friends list - replace with actual data fetching
const friends = [
  {
    id: "1",
    name: "Alice",
    email: "alice@example.com",
  },
  {
    id: "2",
    name: "Bob",
    email: "bob@example.com",
  },
];

export default function FriendsList() {
  if (friends.length === 0) {
    return <p className="text-gray-400">You have no friends yet.</p>;
  }

  return (
    <ul className="space-y-4">
      {friends.map((friend) => (
        <li
          key={friend.id}
          className="flex items-center justify-between bg-gray-700 p-4 rounded-lg shadow"
        >
          <div>
            <p className="font-semibold text-white">{friend.name}</p>
            <p className="text-sm text-gray-400">{friend.email}</p>
          </div>
          <button
            onClick={async () => await removeFriend(friend.id)}
            className="p-2 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors duration-200"
            aria-label="Remove Friend"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </li>
      ))}
    </ul>
  );
}
