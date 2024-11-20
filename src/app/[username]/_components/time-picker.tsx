"use client"

import * as React from "react"
import { format, parse } from "date-fns"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  date: Date
  slots: Array<{
    time: string
    available: boolean
  }>
  onTimeSelect?: (time: Date) => void
}

export function TimePicker({ date, slots, onTimeSelect }: TimePickerProps) {
  const [selectedTime, setSelectedTime] = React.useState<Date | null>(null)

  const handleTimeSelect = (slot: { time: string; available: boolean }) => {
    if (!slot.available) return
    const time = parse(`${format(date, "yyyy-MM-dd")} ${slot.time}`, "yyyy-MM-dd HH:mm", new Date())
    setSelectedTime(time)
    onTimeSelect?.(time)
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {slots.map((slot, index) => (
        <Button
          key={index}
          variant={
            selectedTime?.getTime() === 
            parse(
              `${format(date, "yyyy-MM-dd")} ${slot.time}`,
              "yyyy-MM-dd HH:mm",
              new Date()
            ).getTime()
              ? "default"
              : "outline"
          }
          className={cn(
            "w-full",
            !slot.available && "opacity-50 cursor-not-allowed"
          )}
          disabled={!slot.available}
          onClick={() => handleTimeSelect(slot)}
        >
          {format(
            parse(`${format(date, "yyyy-MM-dd")} ${slot.time}`, "yyyy-MM-dd HH:mm", new Date()),
            "h:mm a"
          )}
        </Button>
      ))}
    </div>
  )
}
