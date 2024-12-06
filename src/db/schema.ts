import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  notes: text("notes"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const availability = pgTable("availability", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  dayOfWeek: text("day_of_week").notNull(), // Monday, Tuesday, etc.
  startTime: text("start_time").notNull(), // HH:mm format
  endTime: text("end_time").notNull(), // HH:mm format
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const calendarSelections = pgTable("calendar_selections", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  calendarId: text("calendar_id").notNull(),
  calendarName: text("calendar_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const calendarPreferences = pgTable("calendar_preferences", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().unique(),
  directBookingEnabled: text("direct_booking_enabled").notNull().default("false"),
  directBookingCalendarId: text("direct_booking_calendar_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
