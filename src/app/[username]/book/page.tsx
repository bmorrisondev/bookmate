"use client"

import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { useParams } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createBooking } from "./_actions/create-booking"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  notes: z.string().optional(),
})

export default function BookingForm() {
  const searchParams = useSearchParams()
  const params = useParams()
  const date = searchParams.get("date")
  const time = searchParams.get("time")
  const username = params.username as string

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      notes: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!date || !time) return

    try {
      const result = await createBooking({
        ...values,
        date: new Date(date),
        time: new Date(time),
        username,
      })

      if (result.success) {
        toast.success("Meeting scheduled! Check your email for confirmation.")
        // Wait a bit for the toast to show before navigating
        setTimeout(() => {
          window.location.href = `/${username}`
        }, 2000)
      } else {
        toast.error("Failed to schedule meeting. Please try again.")
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    }
  }

  if (!date || !time) {
    return <div>Invalid booking request</div>
  }

  const selectedDate = new Date(date)
  const selectedTime = new Date(time)

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 text-sm text-muted-foreground">
            Selected time: {format(selectedDate, "PPP")} at{" "}
            {format(selectedTime, "h:mm a")}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional details about the meeting..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Add any notes or topics you&apos;d like to discuss
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => history.back()}>
                  Back
                </Button>
                <Button type="submit">Book Meeting</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
