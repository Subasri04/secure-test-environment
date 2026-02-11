import { Request, Response } from "express";
import {
  appendAssessmentLogs,
  attemptAlreadySubmitted,
  readAssessmentLogs,
} from "../services/assessment-logs.service";
import { AssessmentLog } from "../types/assessment-logs.types";

export const ingestAssessmentLogs = (req: Request, res: Response) => {
  const { logs } = req.body;

  if (!Array.isArray(logs)) {
    return res.status(400).json({ error: "Invalid logs payload" });
  }

  const firstAttemptId = logs[0]?.attemptId;

  if (!firstAttemptId) {
    return res.status(400).json({ error: "Missing attemptId" });
  }

  // 🔒 Enforce immutability
  if (attemptAlreadySubmitted(firstAttemptId)) {
    return res.status(403).json({
      error: "Attempt already submitted. Logs rejected.",
    });
  }

  // Prevent duplicate submit inside same batch
  const submitEvents = logs.filter(
    (log: AssessmentLog) => log.eventType === "submit"
  );

  if (submitEvents.length > 1) {
    return res.status(400).json({
      error: "Duplicate submit event detected.",
    });
  }

  appendAssessmentLogs(logs);

  return res.status(201).json({ success: true });
};

export const getAllAssessmentLogs = (_req: Request, res: Response) => {
  const logs = readAssessmentLogs();
  res.json(logs);
};

export const getAssessmentLogsByEmployee = (
  req: Request,
  res: Response
) => {
  const { employeeId } = req.params;

  const logs = readAssessmentLogs().filter(
    log => log.employeeId === employeeId
  );

  res.json(logs);
};
