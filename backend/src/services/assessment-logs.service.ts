import fs from "fs";
import path from "path";
import { AssessmentLog } from "../types/assessment-logs.types";

const dataDir = path.join(__dirname, "..", "data");
const filePath = path.join(dataDir, "assessment-logs.json");

function ensureFile(): void {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]");
  }
}

export function readAssessmentLogs(): AssessmentLog[] {
  ensureFile();
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

export function attemptAlreadySubmitted(attemptId: string): boolean {
  const existing = readAssessmentLogs();
  return existing.some(
    log => log.attemptId === attemptId && log.eventType === "submit"
  );
}

export function appendAssessmentLogs(logs: AssessmentLog[]): void {
  const existing = readAssessmentLogs();

  const withIds = logs.map((log, index) => ({
    ...log,
    id: existing.length + index + 1,
  }));

  fs.writeFileSync(
    filePath,
    JSON.stringify([...existing, ...withIds], null, 2)
  );
}
