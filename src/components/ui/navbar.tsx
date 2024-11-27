"use client";

import Link from "next/link";
import { UserButton, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import { Copy } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export function Navbar() {
  const { user } = useUser();
  const copyPath = () => {
    const path = `${window.location.origin}/${user?.username}`;
    navigator.clipboard.writeText(path);
    toast.success("Link copied!", {
      description: `Profile link has been copied to your clipboard.`,
    });
  };

  return (
    <nav className="border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/logo.png" 
                  alt="BookMate Logo" 
                  width={40} 
                  height={40} 
                  className="mr-2"
                />
                <span className="text-xl font-bold">
                  BookMate
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            </div>
          </div>
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal" />
            </SignedOut>
            <button
              onClick={copyPath}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-white hover:bg-opacity-90"
            >
              <Copy className="h-4 w-4" />
              Share profile
            </button>
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
