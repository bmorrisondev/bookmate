import { calendarSelections } from "@/db/schema"
import { db } from "@/db"
import { eq } from "drizzle-orm"
import { startOfMonth, endOfMonth } from "date-fns"
import { clerkClient } from "@clerk/nextjs/server"

export async function getCalendarEvents(userId: string, year: number, month: number) {
  // Get user's selected calendars
  const selections = await db
    .select()
    .from(calendarSelections)
    .where(eq(calendarSelections.userId, userId))

  if (selections.length === 0) {
    return []
  }

  const calendarIds = selections.map(s => s.calendarId)

  const client = await clerkClient()
  const token = await client.users.getUserOauthAccessToken(userId, 'oauth_google')
  const accessToken = token.data[0].token

  // Calculate start and end of month
  const monthDate = new Date(year, month - 1) // month is 0-based in Date constructor
  const monthStart = startOfMonth(monthDate)
  const monthEnd = endOfMonth(monthDate)

  // Get events for each calendar
  const events = await Promise.all(
    calendarIds.map(async (calendarId) => {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
          calendarId
        )}/events?timeMin=${monthStart.toISOString()}&timeMax=${monthEnd.toISOString()}&singleEvents=true&orderBy=startTime`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (!response.ok) {
        console.error(
          `Failed to fetch events for calendar ${calendarId}:`,
          await response.text()
        )
        return []
      }

      const data = await response.json()
      return data.items || []
    })
  )

  // Flatten all events into a single array
  return events.flat()
}
