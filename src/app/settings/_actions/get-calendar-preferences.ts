"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { calendarPreferences } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getCalendarPreferences() {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Not authenticated")
  }

  const prefs = await db
    .select()
    .from(calendarPreferences)
    .where(eq(calendarPreferences.userId, userId))
    .limit(1)

  if (prefs.length === 0) {
    return {
      directBookingEnabled: false,
      directBookingCalendarId: null,
    }
  }

  return {
    directBookingEnabled: prefs[0].directBookingEnabled === "true",
    directBookingCalendarId: prefs[0].directBookingCalendarId,
  }
}
