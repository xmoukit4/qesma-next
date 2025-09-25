"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Qesma
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Dashboard
                </Link>
                <Link
                  href="/groups"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Groups
                </Link>
                <Link
                  href="/friends"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Friends
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            {user ? (
              <Button variant="ghost" onClick={signOut}>
                Sign Out
              </Button>
            ) : (
              <Button asChild>
                <Link href="/auth">Sign In</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}