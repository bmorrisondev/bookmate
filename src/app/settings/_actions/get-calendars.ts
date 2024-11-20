"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { calendarSelections } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getCalendars() {
  const { sessionClaims } = await auth()
  const userId = sessionClaims?.sub

  if (!userId) {
    throw new Error("Not authenticated")
  }

  const selections = await db
    .select()
    .from(calendarSelections)
    .where(eq(calendarSelections.userId, userId))

  return selections.map(selection => ({
    id: selection.calendarId,
    name: selection.calendarName,
  }))
}
