"use server"

import { auth, clerkClient, currentUser } from "@clerk/nextjs/server"
import { db } from "@/db"
import { calendarPreferences } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function saveCalendarPreferences(enabled: boolean, calendarId: string | null) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Not authenticated")
  }

  const user = await currentUser()
  const client = await clerkClient()
  const includesAdditionalScopes = user?.publicMetadata.additionalScopes?.includes(
    "https://www.googleapis.com/auth/calendar.events"
  )

  // Set public metadata
  if (enabled && !includesAdditionalScopes) {
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        additionalScopes: [
          "https://www.googleapis.com/auth/calendar.events"
        ]
      }
    })
  } else if (!enabled && includesAdditionalScopes) {
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        additionalScopes: []
      }
    })
  }

  // Check if preferences already exist
  const existingPrefs = await db
    .select()
    .from(calendarPreferences)
    .where(eq(calendarPreferences.userId, userId))
    .limit(1)

  if (existingPrefs.length > 0) {
    // Update existing preferences
    await db
      .update(calendarPreferences)
      .set({
        directBookingEnabled: enabled.toString(),
        directBookingCalendarId: calendarId,
        updatedAt: new Date(),
      })
      .where(eq(calendarPreferences.userId, userId))
  } else {
    // Create new preferences
    await db.insert(calendarPreferences).values({
      userId,
      directBookingEnabled: enabled.toString(),
      directBookingCalendarId: calendarId,
    })
  }
}
