"use client";

import Link from "next/link";
import { UserButton, SignedOut, SignInButton } from "@clerk/nextjs";

export function Navbar() {

  return (
    <nav className="border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-xl font-bold">
                BookMate
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            </div>
          </div>
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal" />
            </SignedOut>
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
