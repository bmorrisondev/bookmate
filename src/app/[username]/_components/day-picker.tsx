"use client"

import * as React from "react"
import { format, startOfDay } from "date-fns"
import { useRouter } from "next/navigation"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TimePicker } from "./time-picker"

interface CalendarDayPickerProps {
  username: string
}

export default function CalendarDayPicker({ username }: CalendarDayPickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = React.useState<Date | null>(null)
  const router = useRouter()

  const handleNext = () => {
    if (!date || !selectedTime) return
    const searchParams = new URLSearchParams({
      date: date.toISOString(),
      time: selectedTime.toISOString(),
    })
    router.push(`/${username}/book?${searchParams.toString()}`)
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardContent className="p-6">
        <div className="grid gap-8 grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-center">Select Date</h2>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border w-fit mx-auto"
              disabled={(date) => startOfDay(date) < startOfDay(new Date())}
            />
          </div>

          {date && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-center">Select Time</h2>
              <TimePicker date={date} onTimeSelect={setSelectedTime} />
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            size="lg"
            disabled={!date || !selectedTime}
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}