"use client";

import { useState } from "react";
import { SignedIn, UserProfile } from "@clerk/nextjs";
import { AvailabilitySchedule } from "./_components/availability-schedule";
import { CalendarSelector } from "./_components/calendar-selector";
import { cn } from "@/lib/utils";

const tabs = [
  { 
    id: "availability", 
    label: "Availability",
    description: "Set your weekly schedule and configure when you're available for meetings"
  },
  { 
    id: "calendars", 
    label: "Google Calendar",
    description: "Connect your Google Calendar to sync your availability and bookings"
  },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("availability");

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your availability and calendar preferences
          </p>
        </div>

        <div className="flex space-x-4 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-4 text-sm font-medium transition-colors hover:text-primary",
                activeTab === tab.id
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="rounded-lg border">
          {tabs.map((tab) => (
            activeTab === tab.id && (
              <div key={tab.id} className="p-6 space-y-6">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">{tab.label}</h2>
                  <p className="text-sm text-muted-foreground">{tab.description}</p>
                </div>
                <div className="pt-4">
                  {tab.id === "availability" && <AvailabilitySchedule />}
                  {tab.id === "calendars" && <CalendarSelector />}
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
