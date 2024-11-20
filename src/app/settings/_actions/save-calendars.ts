"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { calendarSelections } from "@/db/schema"
import { eq } from "drizzle-orm"

interface GoogleCalendar {
  id: string
  summary: string
  primary: boolean
  selected: boolean
}

export async function saveCalendars(calendars: GoogleCalendar[]) {
  const { sessionClaims } = await auth()
  const userId = sessionClaims?.sub

  if (!userId) {
    throw new Error("Not authenticated")
  }

  // Delete existing calendar selections for this user
  await db.delete(calendarSelections).where(eq(calendarSelections.userId, userId))

  // Insert new calendar selections
  const selectedCalendars = calendars
    .filter(cal => cal.selected)
    .map(cal => ({
      userId,
      calendarId: cal.id,
      calendarName: cal.summary,
    }))

  if (selectedCalendars.length > 0) {
    await db.insert(calendarSelections).values(selectedCalendars)
  }

  return { success: true }
}
