"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { availability } from "@/db/schema"
import { eq } from "drizzle-orm"

type TimeRange = {
  start: string
  end: string
}

type DaySchedule = {
  enabled: boolean
  timeRange: TimeRange
}

type WeeklySchedule = {
  [key: string]: DaySchedule
}

export async function saveAvailability(schedule: WeeklySchedule) {
  const { sessionClaims } =  await auth()

  const userId = sessionClaims?.sub
  if (!userId) {
    throw new Error("Not authenticated")
  }

  // Delete existing availability for this user
  await db.delete(availability).where(eq(availability.userId, userId))

  // Insert new availability
  const availabilityRecords = Object.entries(schedule)
    .filter(([_, daySchedule]) => daySchedule.enabled)
    .map(([day, daySchedule]) => ({
      userId,
      dayOfWeek: day,
      startTime: daySchedule.timeRange.start,
      endTime: daySchedule.timeRange.end,
    }))

  if (availabilityRecords.length > 0) {
    await db.insert(availability).values(availabilityRecords)
  }

  return { success: true }
}
