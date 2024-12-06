"use client";

import { useEffect, useState } from "react";
import { AvailabilitySchedule } from "./settings/_components/availability-schedule";
import { CalendarSelector } from "./settings/_components/calendar-selector";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/ui/navbar";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

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

export default function Settings() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>("availability");
  const { user } = useUser();

  useEffect(() => {
    if(!user) {
      return
    }
    const requiredScopes = user?.publicMetadata?.additionalScopes;
    if(!requiredScopes) {
      setIsLoaded(true)
      return
    }

    const googleAccount = user?.externalAccounts.find(ea => ea.provider === "google")
    const approvedScopes = googleAccount?.approvedScopes?.split(" ")
    const hasAllRequiredScopes = requiredScopes?.every(scope => approvedScopes?.includes(scope));
  
    if(!hasAllRequiredScopes) {
      void reauthAcct(requiredScopes)
    } else {
      setIsLoaded(true)
    }
  }, [user])

  async function reauthAcct(scopes: string[]) {
    if(user) {
      const googleAccount = user.externalAccounts
        .find(ea => ea.provider === "google")

      const reauth = await googleAccount?.reauthorize({
        redirectUrl: window.location.href,
        additionalScopes: scopes
      })

      if(reauth?.verification?.externalVerificationRedirectURL) {
        window.location.href = reauth?.verification?.externalVerificationRedirectURL.href
      }
    }
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
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

          <div className="rounded-lg border bg-white">
            {!isLoaded && (
              <div className="p-6 space-y-6">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">Loading...</h2>
                  <p className="text-sm text-muted-foreground">
                    Please wait while we load your settings
                  </p>
                </div>
                <div className="pt-4">
                  <div className="w-full flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                </div>
              </div>
            )}
            {isLoaded && tabs.map((tab) => (
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
    </>
  );
}
