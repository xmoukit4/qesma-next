'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export function Navigation() {
  const { user, signOut } = useAuth();

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-2xl font-bold">Splitter</Link>
        {user && (
          <>
            <Link href="/groups">Groups</Link>
            <Link href="/friends">Friends</Link>
          </>
        )}
      </div>
      <div>
        {user ? (
          <button onClick={signOut}>Sign Out</button>
        ) : (
          <Link href="/login">Sign In</Link>
        )}
      </div>
    </nav>
  );
}
