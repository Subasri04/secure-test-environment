import { Router } from "express";
import {
  getAllAssessmentLogs,
  getAssessmentLogsByEmployee,
  ingestAssessmentLogs,
} from "../controllers/assessment-logs.controller";

const router = Router();

router.get("/", getAllAssessmentLogs);
router.post("/batch", ingestAssessmentLogs);
router.get("/:employeeId", getAssessmentLogsByEmployee);


export default router;
