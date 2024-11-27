import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, FolderSyncIcon } from 'lucide-react'
import React from 'react';

export default function Home() {
  return (
    <div>
      <div>
        <main className="container mx-auto px-6 py-16 flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
            Simplify Your Scheduling
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl text-gray-600">
            Effortlessly manage your appointments and let clients book time with you seamlessly.
          </p>
          <SignInButton mode="modal">
            <Button size="lg" variant="default" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg font-semibold shadow-lg transition-transform transform hover:scale-105">
              Sign in to get started
            </Button>
          </SignInButton>

          <div className="mt-16 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<CalendarDays className="w-12 h-12 mb-4 text-gray-700" />}
              title="Easy Scheduling"
              description="Allow clients to book appointments directly from your personalized scheduling page."
            />
            <FeatureCard
              icon={<Clock className="w-12 h-12 mb-4 text-gray-700" />}
              title="Time Zone Smart"
              description="Automatically detect and adjust for different time zones, eliminating confusion."
            />
            <FeatureCard
              icon={<FolderSyncIcon className="w-12 h-12 mb-4 text-gray-700" />}
              title="Google Calendar Sync"
              description="Avoid double-booking by syncing your Google Calendar."
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactElement;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-center mb-2">
        {React.cloneElement(icon, { className: "w-6 h-6 mr-3 text-gray-700" })}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 text-left">{description}</p>
    </div>
  )
}