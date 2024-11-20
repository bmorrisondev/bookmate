"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { availability } from "@/db/schema"
import { eq } from "drizzle-orm"

export type WeeklySchedule = {
  [key: string]: {
    enabled: boolean;
    timeRange: {
      start: string;
      end: string;
    };
  };
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

export async function getAvailability() {
  const { sessionClaims } = await auth()
  const userId = sessionClaims?.sub

  if (!userId) {
    throw new Error("Not authenticated")
  }

  const availabilityRecords = await db
    .select()
    .from(availability)
    .where(eq(availability.userId, userId))

  if (availabilityRecords.length === 0) {
    return DEFAULT_SCHEDULE
  }

  const schedule = { ...DEFAULT_SCHEDULE }
  
  availabilityRecords.forEach((record) => {
    schedule[record.dayOfWeek] = {
      enabled: true,
      timeRange: {
        start: record.startTime,
        end: record.endTime,
      },
    }
  })

  return schedule
}
