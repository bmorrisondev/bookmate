'use server'

import { generateICS } from "@/lib/ics"
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface BookingData {
  name: string
  email: string
  notes?: string
  date: Date
  time: Date
  username: string
}

export async function createBooking({
  name,
  email,
  notes,
  date,
  time,
  username
}: BookingData) {
  try {
    // Generate calendar event content
    const eventContent = generateICS({
      startTime: time,
      endTime: new Date(time.getTime() + 30 * 60 * 1000), // 30 minutes duration
      summary: `Meeting with ${username}`,
      description: notes || 'No additional notes provided.',
      organizer: {
        name: username,
        email: process.env.NOTIFICATION_EMAIL || 'notifications@notcalcom.com'
      }
    })

    // Send email with both ICS and iCal attachments
    const res = await resend.emails.send({
      from: process.env.NOTIFICATION_EMAIL || 'notifications@notcalcom.com',
      to: [email],
      subject: `Meeting Confirmation with ${username}`,
      html: `
        <h1>Your meeting is confirmed!</h1>
        <p>Hi ${name},</p>
        <p>Your meeting with ${username} has been scheduled for ${time.toLocaleString()}.</p>
        ${notes ? `<p>Your notes: ${notes}</p>` : ''}
        <p>The calendar invitation is attached to this email in both .ics and .ical formats for maximum compatibility.</p>
      `,
      attachments: [
        {
          filename: 'meeting.ics',
          content: Buffer.from(eventContent),
        }
      ],
    })

    if(res.error) {
      console.error('Failed to send email:', res.error)
      return { success: false, error: 'Failed to send email' }
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to create booking:', error)
    return { success: false, error: 'Failed to create booking' }
  }
}
