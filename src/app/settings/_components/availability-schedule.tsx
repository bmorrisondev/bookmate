"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarClock } from "lucide-react";

type TimeRange = {
  start: string;
  end: string;
};

type DaySchedule = {
  enabled: boolean;
  timeRange: TimeRange;
};

type WeeklySchedule = {
  [key: string]: DaySchedule;
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
  const [schedule, setSchedule] = useState<WeeklySchedule>(DEFAULT_SCHEDULE);

  const handleTimeChange = (
    day: string,
    type: "start" | "end",
    value: string
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeRange: {
          ...prev[day].timeRange,
          [type]: value,
        },
      },
    }));
  };

  const handleToggleDay = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
      },
    }));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    return format(date, "h:mm a");
  };

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
          onClick={() => {
            // TODO: Save schedule to backend
            console.log("Schedule:", schedule);
          }}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
