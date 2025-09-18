
"use client";

import { acceptFriendRequest, rejectFriendRequest } from "../actions";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

// Mock data for friend requests - replace with actual data fetching
const friendRequests = [
  {
    id: "1",
    sender: {
      name: "John Doe",
      email: "john.doe@example.com",
    },
  },
  {
    id: "2",
    sender: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
    },
  },
];

export default function FriendRequestsList() {
  if (friendRequests.length === 0) {
    return <p className="text-gray-400">No new friend requests.</p>;
  }

  return (
    <ul className="space-y-4">
      {friendRequests.map((request) => (
        <li
          key={request.id}
          className="flex items-center justify-between bg-gray-700 p-4 rounded-lg shadow"
        >
          <div>
            <p className="font-semibold text-white">{request.sender.name}</p>
            <p className="text-sm text-gray-400">{request.sender.email}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={async () => await acceptFriendRequest(request.id)}
              className="p-2 bg-green-600 hover:bg-green-700 rounded-full text-white transition-colors duration-200"
              aria-label="Accept"
            >
              <CheckIcon className="h-5 w-5" />
            </button>
            <button
              onClick={async () => await rejectFriendRequest(request.id)}
              className="p-2 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors duration-200"
              aria-label="Decline"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
