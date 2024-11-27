"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarClock, Loader2 } from "lucide-react";
import { saveAvailability } from "../_actions/save-availability";
import { getAvailability, type WeeklySchedule } from "../_actions/get-availability";
import { useToast } from "@/hooks/use-toast";

type TimeRange = {
  start: string;
  end: string;
};

type DaySchedule = {
  enabled: boolean;
  timeRange: TimeRange;
};

type Schedule = {
  [day: string]: DaySchedule;
};

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DEFAULT_SCHEDULE: WeeklySchedule = DAYS_OF_WEEK.reduce(
  (acc, day) => ({
    ...acc,
    [day]: {
      enabled: false,
      timeRange: {
        start: "09:00",
        end: "17:00",
      },
    },
  }),
  {}
);

export function AvailabilitySchedule() {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function loadAvailability() {
      try {
        const data = await getAvailability();
        setSchedule(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load availability. Please refresh the page.",
          variant: "destructive",
        });
      }
    }
    void loadAvailability();
  }, [toast]);

  const handleTimeChange = (
    day: string,
    type: "start" | "end",
    value: string
  ) => {
    setSchedule((prev: Schedule | null) => {
      if (!prev) return prev;

      // Create a new object if the day doesn't exist, with null check
      const daySchedule: DaySchedule = prev?.[day] ?? { 
        enabled: false, 
        timeRange: { start: "", end: "" } 
      };

      return {
        ...prev,
        [day]: {
          ...daySchedule,
          timeRange: {
            ...daySchedule.timeRange,
            [type]: value,
          },
        },
      };
    });
  };

  const handleToggleDay = (day: string) => {
    setSchedule((prev: Schedule | null) => {
      if (!prev) return prev;

      // Create a new object if the day doesn't exist, with null check
      const daySchedule: DaySchedule = prev?.[day] ?? { 
        enabled: false, 
        timeRange: { start: "", end: "" } 
      };

      return {
        ...prev,
        [day]: {
          ...daySchedule,
          enabled: !daySchedule.enabled,
        },
      };
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    return format(date, "h:mm a");
  };

  if (!schedule) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CalendarClock className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Weekly Availability</h2>
      </div>
      <div className="rounded-lg border">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="flex items-center justify-between border-b p-4 last:border-b-0"
          >
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={schedule[day].enabled}
                  onChange={() => handleToggleDay(day)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="font-medium">{day}</span>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={schedule[day].timeRange.start}
                onChange={(e) => handleTimeChange(day, "start", e.target.value)}
                disabled={!schedule[day].enabled}
                className="rounded-md border px-2 py-1 disabled:opacity-50"
              />
              <span className="text-gray-500">to</span>
              <input
                type="time"
                value={schedule[day].timeRange.end}
                onChange={(e) => handleTimeChange(day, "end", e.target.value)}
                disabled={!schedule[day].enabled}
                className="rounded-md border px-2 py-1 disabled:opacity-50"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          onClick={async () => {
            try {
              setIsSaving(true);
              await saveAvailability(schedule);
              toast({
                title: "Success",
                description: "Your availability has been saved.",
              });
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to save availability. Please try again.",
                variant: "destructive",
              });
            } finally {
              setIsSaving(false);
            }
          }}
          disabled={isSaving}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
