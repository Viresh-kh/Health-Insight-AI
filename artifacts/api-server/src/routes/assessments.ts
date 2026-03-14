import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { assessmentsTable } from "@workspace/db/schema";
import { CreateAssessmentBody } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

function calculateBMI(weight: number, height: number): { bmi: number; category: string } {
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  let category = "Normal";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal";
  else if (bmi < 30) category = "Overweight";
  else category = "Obese";
  return { bmi: Math.round(bmi * 10) / 10, category };
}

function calculateHealthScore(data: {
  age: number;
  bmi: number;
  symptoms: string[];
  lifestyle: Record<string, unknown>;
  medicalHistory: string[];
}): {
  overallScore: number;
  riskLevel: "low" | "moderate" | "high" | "critical";
  categoryScores: { physical: number; mental: number; nutrition: number; sleep: number; lifestyle: number };
  recommendations: string[];
} {
  let physical = 100;
  let mental = 100;
  let nutrition = 100;
  let sleep = 100;
  let lifestyleScore = 100;

  const { bmi, symptoms, lifestyle, medicalHistory } = data;

  if (bmi < 18.5 || bmi >= 30) physical -= 20;
  else if (bmi >= 25) physical -= 10;

  const severeSymptoms = ["chest pain", "shortness of breath", "dizziness"];
  const mildSymptoms = ["headache", "fatigue", "nausea", "back pain", "joint pain"];
  symptoms.forEach(s => {
    if (severeSymptoms.includes(s)) physical -= 15;
    if (mildSymptoms.includes(s)) physical -= 8;
  });

  if (symptoms.includes("fatigue") || symptoms.includes("headache")) mental -= 10;
  
  const stressLevel = Number(lifestyle.stressLevel) || 5;
  mental -= stressLevel * 4;

  const dietType = String(lifestyle.dietType || "omnivore");
  if (dietType === "mediterranean" || dietType === "vegetarian") nutrition += 10;
  else if (dietType === "keto") nutrition -= 5;

  const sleepHours = Number(lifestyle.sleepHours) || 7;
  if (sleepHours < 6) sleep -= 25;
  else if (sleepHours < 7) sleep -= 10;
  else if (sleepHours > 9) sleep -= 5;

  const exercise = String(lifestyle.exerciseFrequency || "sedentary");
  if (exercise === "very_active") lifestyleScore += 10;
  else if (exercise === "active") lifestyleScore += 5;
  else if (exercise === "sedentary") lifestyleScore -= 20;
  else if (exercise === "light") lifestyleScore -= 10;

  const smoking = String(lifestyle.smokingStatus || "never");
  if (smoking === "current") { lifestyleScore -= 25; physical -= 15; }
  else if (smoking === "former") { lifestyleScore -= 10; physical -= 5; }

  const alcohol = String(lifestyle.alcoholConsumption || "none");
  if (alcohol === "heavy") { lifestyleScore -= 20; mental -= 10; }
  else if (alcohol === "moderate") lifestyleScore -= 5;

  medicalHistory.forEach(condition => {
    if (["diabetes", "hypertension", "heart disease"].includes(condition)) physical -= 10;
    if (["depression"].includes(condition)) mental -= 15;
    if (["obesity"].includes(condition)) physical -= 10;
  });

  const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));
  const scores = {
    physical: clamp(physical),
    mental: clamp(mental),
    nutrition: clamp(nutrition),
    sleep: clamp(sleep),
    lifestyle: clamp(lifestyleScore),
  };

  const overall = clamp(
    scores.physical * 0.3 + scores.mental * 0.2 + scores.nutrition * 0.2 + scores.sleep * 0.15 + scores.lifestyle * 0.15
  );

  let riskLevel: "low" | "moderate" | "high" | "critical" = "low";
  if (overall < 40) riskLevel = "critical";
  else if (overall < 60) riskLevel = "high";
  else if (overall < 75) riskLevel = "moderate";

  const recommendations: string[] = [];
  if (scores.sleep < 70) recommendations.push("Aim for 7-9 hours of quality sleep each night.");
  if (scores.lifestyle < 70) recommendations.push("Increase physical activity to at least 150 minutes of moderate exercise per week.");
  if (scores.physical < 70) recommendations.push("Schedule a comprehensive check-up with your primary care physician.");
  if (scores.mental < 70) recommendations.push("Consider stress management techniques such as meditation, yoga, or mindfulness.");
  if (scores.nutrition < 70) recommendations.push("Adopt a balanced diet rich in fruits, vegetables, whole grains, and lean proteins.");
  if (smoking === "current") recommendations.push("Quitting smoking is the single best thing you can do for your health.");
  if (alcohol === "heavy") recommendations.push("Reduce alcohol consumption to low-risk levels (max 2 drinks/day for men, 1 for women).");
  if (bmi >= 25) recommendations.push("Work towards a healthy weight through diet and exercise changes.");
  if (bmi < 18.5) recommendations.push("Consult a nutritionist to develop a healthy weight-gain plan.");
  if (recommendations.length === 0) recommendations.push("Keep up the excellent work! Maintain your healthy habits and schedule regular preventive check-ups.");

  return { overallScore: overall, riskLevel, categoryScores: scores, recommendations };
}

router.post("/assessments", async (req, res) => {
  const parsed = CreateAssessmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
    return;
  }

  const { age, gender, weight, height, symptoms = [], lifestyle = {}, medicalHistory = [] } = parsed.data;
  const { bmi, category: bmiCategory } = calculateBMI(weight, height);
  const { overallScore, riskLevel, categoryScores, recommendations } = calculateHealthScore({
    age, bmi, symptoms, lifestyle: lifestyle as Record<string, unknown>, medicalHistory,
  });

  const [assessment] = await db.insert(assessmentsTable).values({
    age, gender, weight, height,
    symptoms,
    lifestyle: lifestyle as Record<string, unknown>,
    medicalHistory,
    overallScore, bmi, bmiCategory: bmiCategory, riskLevel,
    recommendations,
    categoryScores,
  }).returning();

  res.status(201).json(assessment);
});

router.get("/assessments", async (_req, res) => {
  const assessments = await db.select().from(assessmentsTable).orderBy(assessmentsTable.createdAt);
  res.json(assessments);
});

router.get("/assessments/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  const [assessment] = await db.select().from(assessmentsTable).where(eq(assessmentsTable.id, id));
  if (!assessment) { res.status(404).json({ error: "Not found" }); return; }
  res.json(assessment);
});

export default router;
