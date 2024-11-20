import { NextResponse } from "next/server"
import { db } from "@/db"
import { availability } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { getUserIdFromUsername } from "@/lib/auth"
import { 
  addDays,
  addMinutes, 
  format, 
  parse,
  parseISO, 
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth
} from "date-fns"
import { getCalendarEvents } from "@/lib/google"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")
  const year = searchParams.get("year")
  const month = searchParams.get("month") // 1-12

  if (!username || !year || !month) {
    return NextResponse.json(
      { error: "Username, year, and month parameters are required" },
      { status: 400 }
    )
  }

  const userId = await getUserIdFromUsername(username)
  if (!userId) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    )
  }

  // Get all availability records for this user
  const availabilityRecords = await db
    .select()
    .from(availability)
    .where(eq(availability.userId, userId))

  if (availabilityRecords.length === 0) {
    return NextResponse.json({
      year,
      month,
      days: [],
    })
  }

  // Create availability lookup by day of week
  const availabilityByDay = availabilityRecords.reduce((acc, record) => {
    acc[record.dayOfWeek] = {
      startTime: record.startTime,
      endTime: record.endTime,
    }
    return acc
  }, {} as Record<string, { startTime: string; endTime: string }>)

  // Get start and end of month
  const monthDate = new Date(parseInt(year), parseInt(month) - 1)
  const monthStart = startOfMonth(monthDate)
  const monthEnd = endOfMonth(monthDate)

  // Get all events for the month
  const events = await getCalendarEvents(userId, parseInt(year), parseInt(month))

  // Get all days in the month
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd }).map(date => {
    const dayOfWeek = format(date, "EEEE")
    const dayAvailability = availabilityByDay[dayOfWeek]

    if (!dayAvailability) {
      return {
        date: format(date, "yyyy-MM-dd"),
        available: false,
        slots: [],
      }
    }

    // Generate time slots for this day
    const slots = []
    let currentTime = parse(dayAvailability.startTime, "HH:mm", date)
    const endTimeDate = parse(dayAvailability.endTime, "HH:mm", date)

    while (currentTime <= endTimeDate) {
      const slotStart = currentTime
      const slotEnd = addMinutes(currentTime, 30)

      // Check if this slot overlaps with any calendar events
      const isAvailable = !events.some((event) => {
        const eventStart = parseISO(event.start.dateTime || event.start.date)
        const eventEnd = parseISO(event.end.dateTime || event.end.date)

        if (!isSameMonth(eventStart, monthDate)) return false

        return (
          isWithinInterval(slotStart, { start: eventStart, end: eventEnd }) ||
          isWithinInterval(slotEnd, { start: eventStart, end: eventEnd }) ||
          isWithinInterval(eventStart, { start: slotStart, end: slotEnd })
        )
      })

      slots.push({
        time: format(currentTime, "HH:mm"),
        available: isAvailable,
      })

      currentTime = addMinutes(currentTime, 30)
    }

    return {
      date: format(date, "yyyy-MM-dd"),
      available: slots.some(slot => slot.available),
      slots,
    }
  })

  return NextResponse.json({
    year,
    month,
    days,
  })
}
