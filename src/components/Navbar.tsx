"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-transparent fixed w-full shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-white">
            Todoist
          </Link>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  href="/todo"
                  className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700"
                >
                  Todos
                </Link>
                <Link
                  href="/settings"
                  className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700"
                >
                  Settings
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
