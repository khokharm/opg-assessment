"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-800 hover:text-gray-600">
          Weather Dashboard
        </Link>
        
        <nav className="flex items-center gap-4">
          {loading ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : user ? (
            <>
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{user.username}</span>
              </span>
              <Link href="/logout">
                <Button variant="outline" size="sm">
                  Sign Out
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
