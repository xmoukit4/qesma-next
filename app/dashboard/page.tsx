"use client";

import { useState } from "react";
import Button from "../../components/Button";
import { CreateGroupForm } from "../../components/CreateGroupForm";
import { JoinGroupForm } from "../../components/JoinGroupForm";
import Link from "next/link";
import { PlusIcon, UserGroupIcon } from "@heroicons/react/24/outline";

// Placeholder data for groups
const groups = [
  {
    id: "1",
    name: "Trip to Bali",
    members: 3,
    emoji: "🌴",
  },
  {
    id: "2",
    name: "Apartment Bills",
    members: 2,
    emoji: "🏠",
  },
  {
    id: "3",
    name: "Project Phoenix",
    members: 5,
    emoji: "🔥",
  },
];

export default function DashboardPage() {
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isJoiningGroup, setIsJoiningGroup] = useState(false);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">
          Your Groups
        </h1>
        <div className="flex space-x-4">
          <Button
            onClick={() => setIsJoiningGroup(true)}
            className="flex items-center space-x-2"
          >
            <UserGroupIcon className="h-5 w-5" />
            <span>Join Group</span>
          </Button>
          <Button
            onClick={() => setIsCreatingGroup(true)}
            className="flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create Group</span>
          </Button>
        </div>
      </div>

      {isCreatingGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
              Create a New Group
            </h2>
            <CreateGroupForm onClose={() => setIsCreatingGroup(false)} />
          </div>
        </div>
      )}

      {isJoiningGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
              Join a Group
            </h2>
            <JoinGroupForm onClose={() => setIsJoiningGroup(false)} />
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {groups.map((group) => (
          <Link href={`/group/${group.id}`} key={group.id}>
            <div className="bg-white/10 dark:bg-gray-800/60 p-6 rounded-2xl shadow-lg hover:shadow-2xl border border-white/20 dark:border-gray-700/80 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
              <div className="flex justify-between items-start">
                <div className="text-6xl">{group.emoji}</div>
                <div className="text-right">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {group.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {group.members} members
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
