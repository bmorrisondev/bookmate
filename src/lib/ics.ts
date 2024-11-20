interface CalendarEvent {
  startTime: Date
  endTime: Date
  summary: string
  description: string
  organizer: {
    name: string
    email: string
  }
}

export function generateICS({
  startTime,
  endTime,
  summary,
  description,
  organizer,
}: CalendarEvent): string {
  // Format dates to UTC format required by ICS
  const formatDate = (date: Date) => {
    return date
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "")
  }

  // Generate a unique identifier for the event
  const generateUID = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}@notcalcom`
  }

  const now = new Date()

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//notcalcom//NONSGML v1.0//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${generateUID()}`,
    `DTSTAMP:${formatDate(now)}`,
    `DTSTART:${formatDate(startTime)}`,
    `DTEND:${formatDate(endTime)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    `ORGANIZER;CN=${organizer.name}:mailto:${organizer.email}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")

  return icsContent
}

// Example usage:
/*
const event = {
  startTime: new Date("2024-01-20T10:00:00Z"),
  endTime: new Date("2024-01-20T11:00:00Z"),
  summary: "Meeting with John",
  description: "Discuss project updates",
  organizer: {
    name: "Jane Doe",
    email: "jane@example.com"
  }
}

const icsContent = generateICS(event)
*/