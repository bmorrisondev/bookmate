"use client";

import { useState } from "react";
import { SignedIn, UserProfile } from "@clerk/nextjs";
import { AvailabilitySchedule } from "./_components/availability-schedule";
import { CalendarSelector } from "./_components/calendar-selector";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "availability", label: "Availability" },
  { id: "calendars", label: "Google Calendar" },
  { id: "account", label: "Account" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("availability");

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-3xl font-bold">Settings</h1>
      <div className="space-y-6">
        <div className="border-b">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "border-b-2 py-4 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="rounded-lg border p-4">
          {activeTab === "availability" && <AvailabilitySchedule />}
          {activeTab === "calendars" && <CalendarSelector />}
          {activeTab === "account" && (
            <SignedIn>
              <UserProfile />
            </SignedIn>
          )}
        </div>
      </div>
    </div>
  );
}
