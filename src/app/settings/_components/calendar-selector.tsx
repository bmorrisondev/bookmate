"use client";

import { useState } from "react";
import { Calendar, RefreshCw } from "lucide-react";
import { getGoogleToken } from "../actions";
import { useUser } from "@clerk/nextjs";
import { ComposedChart } from "recharts";

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
  const { user } = useUser()

  async function reauthAcct() {
    if(user) {
      const googleAccount = user.externalAccounts
        .find(ea => ea.provider === "google")

      const reauth = await googleAccount?.reauthorize({
        redirectUrl: window.location.href,
        additionalScopes: [
          "https://www.googleapis.com/auth/calendar.readonly",
          'https://www.googleapis.com/auth/calendar.events.readonly'
        ]
      })

      if(reauth?.verification?.externalVerificationRedirectURL) {
        window.location.href = reauth?.verification?.externalVerificationRedirectURL.href
      }
    }
  }

  const fetchCalendars = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const googleAccount = user?.externalAccounts.find(ea => ea.provider === "google")
      console.log(googleAccount)
      if(!googleAccount?.approvedScopes?.includes("https://www.googleapis.com/auth/calendar.readonly")) {
        void reauthAcct()
        return
      }

      const { token } = await getGoogleToken();
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/users/me/calendarList",
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
        selected: false,
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
      const selectedCalendarIds = calendars
        .filter((cal) => cal.selected)
        .map((cal) => cal.id);

      // TODO: Implement saving selected calendars to your backend
      console.log("Selected calendar IDs:", selectedCalendarIds);
      
    } catch (err) {
      console.error("Error saving calendars:", err);
      setError(
        err instanceof Error ? err.message : "Failed to save calendar selection"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Google Calendar Selection</h2>
        </div>
        <button
          onClick={fetchCalendars}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-md border px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {calendars.length === 0 ? "Load Calendars" : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="rounded-lg border p-4">
        {calendars.length === 0 ? (
          <div className="flex justify-center py-8 text-sm text-gray-600">
            Click the button above to load your Google Calendars
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
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
