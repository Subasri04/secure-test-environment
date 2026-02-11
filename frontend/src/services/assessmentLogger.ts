import { v4 as uuid } from "uuid";
import { saveEvent, getAllEvents, clearEvents } from "../storage/assessmentDB";
import type { AssessmentEvent } from "../types/assessment.types";
import { APP_CONFIG } from "../config/appConfig";

const ATTEMPT_KEY = "assessment_attempt_id";
const LOCK_KEY = "assessment_locked";

function getAttemptId(): string {
  let id = sessionStorage.getItem(ATTEMPT_KEY);
  if (!id) {
    id = uuid();
    sessionStorage.setItem(ATTEMPT_KEY, id);
  }
  return id;
}

export async function logAssessmentEvent(
  event: Omit<AssessmentEvent, "attemptId" | "timestamp">
): Promise<void> {
  if (sessionStorage.getItem(LOCK_KEY) === "true") return;

  const fullEvent: AssessmentEvent = {
    ...event,
    attemptId: getAttemptId(),
    timestamp: new Date().toISOString(), // ✅ timestamp at event time
  };

  await saveEvent(fullEvent);
}

export async function syncAssessmentLogs(employeeId: string): Promise<void> {
  const events = await getAllEvents();
  if (events.length === 0) return;

  const response = await fetch(
    `${APP_CONFIG.API_BASE_URL}/assessment-logs/batch`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        logs: events.map(e => ({
          ...e,
          employeeId,
        })),
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to sync logs");
  }

  await clearEvents();
}

export function lockAssessment(): void {
  sessionStorage.setItem(LOCK_KEY, "true");
}
