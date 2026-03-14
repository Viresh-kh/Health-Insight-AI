import { pgTable, serial, integer, real, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const assessmentsTable = pgTable("assessments", {
  id: serial("id").primaryKey(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  weight: real("weight").notNull(),
  height: real("height").notNull(),
  symptoms: jsonb("symptoms").$type<string[]>().default([]),
  lifestyle: jsonb("lifestyle").$type<Record<string, unknown>>().default({}),
  medicalHistory: jsonb("medical_history").$type<string[]>().default([]),
  overallScore: integer("overall_score").notNull(),
  bmi: real("bmi").notNull(),
  bmiCategory: text("bmi_category").notNull(),
  riskLevel: text("risk_level").notNull(),
  recommendations: jsonb("recommendations").$type<string[]>().default([]),
  categoryScores: jsonb("category_scores").$type<{
    physical: number;
    mental: number;
    nutrition: number;
    sleep: number;
    lifestyle: number;
  }>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAssessmentSchema = createInsertSchema(assessmentsTable).omit({ id: true, createdAt: true });
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessmentsTable.$inferSelect;
