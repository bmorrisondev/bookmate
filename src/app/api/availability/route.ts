import { NextResponse } from "next/server"
import { addMinutes, setHours, setMinutes } from "date-fns"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const dateStr = searchParams.get("date")

  if (!dateStr) {
    return NextResponse.json(
      { error: "Date parameter is required" },
      { status: 400 }
    )
  }

  const date = new Date(dateStr)
  const availableSlots = []

  // Set start time to 8 AM
  let currentTime = setMinutes(setHours(date, 8), 0)
  // Set end time to 12 PM
  const endTime = setMinutes(setHours(date, 12), 0)

  while (currentTime <= endTime) {
    // Mock data: randomly make some slots unavailable
    const isAvailable = Math.random() > 0.3 // 70% chance of being available
    
    availableSlots.push({
      time: currentTime.toISOString(),
      available: isAvailable,
    })

    currentTime = addMinutes(currentTime, 30)
  }

  return NextResponse.json({
    date: dateStr,
    slots: availableSlots,
  })
}
