"use client"

import * as React from "react"
import { format, setHours, setMinutes, addMinutes } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  date: Date
  onTimeSelect?: (time: Date) => void
}

interface TimeSlot {
  time: Date
  available: boolean
}

export function TimePicker({ date, onTimeSelect }: TimePickerProps) {
  const [timeSlots, setTimeSlots] = React.useState<TimeSlot[]>([])
  const [selectedTime, setSelectedTime] = React.useState<Date | null>(null)
  const [loading, setLoading] = React.useState(false)

  const fetchAvailableTimes = React.useCallback(async (date: Date) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/availability?date=${date.toISOString()}`)
      const data = await response.json()
      
      const slots: TimeSlot[] = data.slots.map((slot: any) => ({
        time: new Date(slot.time),
        available: slot.available,
      }))
      
      setTimeSlots(slots)
    } catch (error) {
      console.error("Failed to fetch available times:", error)
      setTimeSlots([])
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (date) {
      fetchAvailableTimes(date)
    }
  }, [date, fetchAvailableTimes])

  const handleTimeSelect = (slot: TimeSlot) => {
    if (!slot.available) return
    setSelectedTime(slot.time)
    onTimeSelect?.(slot.time)
  }

  return (
    <div>
      {loading ? (
        <div className="text-center text-muted-foreground">
          Loading available times...
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {timeSlots.map((slot, index) => (
            <Button
              key={index}
              variant={selectedTime?.getTime() === slot.time.getTime() ? "default" : "outline"}
              className={cn(
                "w-full",
                !slot.available && "opacity-50 cursor-not-allowed"
              )}
              disabled={!slot.available}
              onClick={() => handleTimeSelect(slot)}
            >
              {format(slot.time, "h:mm a")}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
