import { pgTable, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const vitalsTable = pgTable("vitals", {
  id: serial("id").primaryKey(),
  heartRate: integer("heart_rate").notNull(),
  systolicBP: integer("systolic_bp"),
  diastolicBP: integer("diastolic_bp"),
  temperature: real("temperature"),
  oxygenSaturation: real("oxygen_saturation"),
  bloodGlucose: real("blood_glucose"),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

export const insertVitalsSchema = createInsertSchema(vitalsTable).omit({ id: true, recordedAt: true });
export type InsertVitals = z.infer<typeof insertVitalsSchema>;
export type Vitals = typeof vitalsTable.$inferSelect;
