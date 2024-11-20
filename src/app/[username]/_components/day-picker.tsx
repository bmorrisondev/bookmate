"use client"

import * as React from "react"
import { format, startOfDay, isSameMonth } from "date-fns"
import { useRouter } from "next/navigation"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TimePicker } from "./time-picker"

interface CalendarDayPickerProps {
  username: string
}

interface DayAvailability {
  date: string
  available: boolean
  slots: Array<{
    time: string
    available: boolean
  }>
}

export default function CalendarDayPicker({ username }: CalendarDayPickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = React.useState<Date | null>(null)
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date())
  const [monthAvailability, setMonthAvailability] = React.useState<DayAvailability[]>([])
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  const fetchMonthAvailability = React.useCallback(async (month: Date) => {
    setLoading(true)
    try {
      const year = month.getFullYear()
      const monthNum = month.getMonth() + 1 // Convert to 1-based month
      const searchParams = new URLSearchParams({
        username,
        year: year.toString(),
        month: monthNum.toString(),
      })
      
      const response = await fetch(`/api/availability?${searchParams.toString()}`)
      const data = await response.json()
      
      setMonthAvailability(data.days || [])
    } catch (error) {
      console.error("Failed to fetch month availability:", error)
      setMonthAvailability([])
    } finally {
      setLoading(false)
    }
  }, [username])

  React.useEffect(() => {
    fetchMonthAvailability(currentMonth)
  }, [currentMonth, fetchMonthAvailability])

  const handleNext = () => {
    if (!date || !selectedTime) return
    const searchParams = new URLSearchParams({
      date: date.toISOString(),
      time: selectedTime.toISOString(),
    })
    router.push(`/${username}/book?${searchParams.toString()}`)
  }

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    setSelectedTime(null)
    if (newDate && !isSameMonth(newDate, currentMonth)) {
      setCurrentMonth(newDate)
    }
  }

  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth)
    // Clear selected date if it's not in the new month
    if (date && !isSameMonth(date, newMonth)) {
      setDate(undefined)
      setSelectedTime(null)
    }
  }

  // Find the availability for the selected date
  const selectedDateAvailability = date
    ? monthAvailability.find(day => day.date === format(date, "yyyy-MM-dd"))
    : undefined

  const isDateAvailable = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    const dayAvailability = monthAvailability.find(day => day.date === dateStr)
    return dayAvailability?.available ?? false
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-center">Select Date</h2>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              onMonthChange={handleMonthChange}
              className="rounded-md border w-fit mx-auto"
              disabled={(date) => 
                startOfDay(date) < startOfDay(new Date()) || 
                !isDateAvailable(date)
              }
              modifiers={{
                available: (date) => isDateAvailable(date),
              }}
              modifiersClassNames={{
                available: "font-medium text-blue-600",
              }}
            />
          </div>

          {date && selectedDateAvailability && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-center">Select Time</h2>
              <TimePicker 
                date={date} 
                onTimeSelect={setSelectedTime}
                slots={selectedDateAvailability.slots}
              />
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