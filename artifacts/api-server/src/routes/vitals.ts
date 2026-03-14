import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { vitalsTable } from "@workspace/db/schema";
import { LogVitalsBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/vitals", async (req, res) => {
  const parsed = LogVitalsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
    return;
  }

  const [entry] = await db.insert(vitalsTable).values(parsed.data).returning();
  res.status(201).json(entry);
});

router.get("/vitals", async (_req, res) => {
  const entries = await db.select().from(vitalsTable).orderBy(vitalsTable.recordedAt);
  res.json(entries);
});

export default router;
