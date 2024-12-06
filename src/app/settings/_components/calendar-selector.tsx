"use client";

import { useState, useEffect } from "react";
import { Calendar, RefreshCw, Loader2 } from "lucide-react";
import { getGoogleToken } from "../actions";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { saveCalendars } from "../_actions/save-calendars";
import { getCalendars } from "../_actions/get-calendars";
import { saveCalendarPreferences } from "../_actions/save-calendar-preferences";
import { getCalendarPreferences } from "../_actions/get-calendar-preferences";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GoogleCalendar {
  id: string;
  summary: string;
  primary: boolean;
  selected: boolean;
}

export function CalendarSelector() {
  const [isLoading, setIsLoading] = useState(false);
  const [calendars, setCalendars] = useState<GoogleCalendar[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [directBooking, setDirectBooking] = useState(false);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>("");
  const [needsReauth, setNeedsReauth] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if(!directBooking) {
      setSelectedCalendarId("")
    }
    if(directBooking && !checkScopes()) {
      setNeedsReauth(true)
    } else {
      setNeedsReauth(false)
    }
  }, [directBooking])
  

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

  const checkScopes = () => {
    const googleAccount = user?.externalAccounts.find(ea => ea.provider === "google")
    if(!googleAccount) return false
  
    const requiredScopes = [
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/calendar.events"
    ]
    const approvedScopes = googleAccount.approvedScopes?.split(" ")
    return requiredScopes.every(scope => approvedScopes?.includes(scope))
  }

  const handleSaveClick = async () => {
    await handleSave()
    if (needsReauth) {
      await reauthAcct([
        "https://www.googleapis.com/auth/calendar.readonly",
        "https://www.googleapis.com/auth/calendar.events"
      ])
      return
    }
  }

  const fetchCalendars = async (savedSelections?: { id: string; name: string }[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const getGoogleTokenResponse = await getGoogleToken();
      if(!getGoogleTokenResponse?.token) {
        setNeedsReauth(true)
        return
      }

      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/users/me/calendarList",
        {
          headers: {
            Authorization: `Bearer ${getGoogleTokenResponse.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch calendars");
      }

      const data = await response.json();
      const formattedCalendars = data.items.map((calendar: any) => ({
        id: calendar.id,
        summary: calendar.summary,
        primary: calendar.primary || false,
        selected: savedSelections?.some(sel => sel.id === calendar.id) || false,
      }));
      setCalendars(formattedCalendars);
    } catch (err) {
      console.error("Error fetching calendars:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch calendars"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleCalendar = (calendarId: string) => {
    setCalendars((prevCalendars) =>
      prevCalendars.map((cal) =>
        cal.id === calendarId ? { ...cal, selected: !cal.selected } : cal
      )
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await saveCalendars(calendars);
      await saveCalendarPreferences(
        directBooking,
        directBooking ? selectedCalendarId : null
      );
      toast({
        title: "Success",
        description: "Calendar settings have been saved.",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save calendar settings"
      );
      toast({
        title: "Error",
        description: "Failed to save calendar settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function loadCalendars() {
      try {
        const [savedSelections, savedPreferences] = await Promise.all([
          getCalendars(),
          getCalendarPreferences(),
        ]);
        await fetchCalendars(savedSelections);
        setDirectBooking(savedPreferences.directBookingEnabled);
        setSelectedCalendarId(savedPreferences.directBookingCalendarId || "");
      } catch (error) {
        console.error("Error loading calendar settings:", error);
        // If getting saved selections fails, still try to load calendars
        await fetchCalendars();
      }
    }
    void loadCalendars();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Google Calendar Selection</h2>
        </div>
        <button
          onClick={() => fetchCalendars()}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-md border px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="rounded-lg border p-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : calendars.length === 0 ? (
          <div className="flex justify-center py-8 text-sm text-gray-600">
            No calendars found. Click refresh to try again.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              {calendars.map((calendar) => (
                <label
                  key={calendar.id}
                  className="flex items-center justify-between rounded-md border p-3 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={calendar.selected}
                      onChange={() => handleToggleCalendar(calendar.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="font-medium">{calendar.summary}</span>
                    {calendar.primary && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
                        Primary
                      </span>
                    )}
                  </div>
                </label>
              ))}
            </div>

            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={directBooking}
                    onChange={(e) => setDirectBooking(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium">Add bookings directly to calendar</span>
                </label>
              </div>

              {directBooking && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Select value={selectedCalendarId} onValueChange={setSelectedCalendarId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a calendar" />
                      </SelectTrigger>
                      <SelectContent>
                        {calendars.map((calendar) => (
                          <SelectItem key={calendar.id} value={calendar.id}>
                            {calendar.summary}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {directBooking && !selectedCalendarId && (
                    <p className="text-sm text-red-500">Please select a calendar for direct bookings</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSaveClick}
                disabled={isLoading || (directBooking && !selectedCalendarId)}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {needsReauth ? "Save & Authorize Calendar Access" : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
