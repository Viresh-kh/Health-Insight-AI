import { Router, type IRouter } from "express";
import healthRouter from "./health";
import assessmentsRouter from "./assessments";
import vitalsRouter from "./vitals";
import tipsRouter from "./tips";

const router: IRouter = Router();

router.use(healthRouter);
router.use(assessmentsRouter);
router.use(vitalsRouter);
router.use(tipsRouter);

export default router;
