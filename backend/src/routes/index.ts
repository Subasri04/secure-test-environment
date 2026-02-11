import { Router } from "express";
import browserLogsRoutes from "./browser-logs.routes";
import assessmentLogsRoutes from "./assessment-logs.routes";

const router = Router();

router.use("/browser-logs", browserLogsRoutes);
router.use("/assessment-logs", assessmentLogsRoutes);

export default router;
