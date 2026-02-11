import type { AuditEvent } from "../types/event.types";
import { createAttemptId } from "./attemptService";
import { addEvent } from "./db";

let isLocked = false;

export function lockLogging(): void {
  isLocked = true;
}

export async function logEvent(
  eventType: string,
  metadata: Record<string, unknown>,
  questionId: string | null = null
) {
  if (isLocked) return;

  const event: AuditEvent = {
    eventType,
    timestamp: new Date().toISOString(),
    attemptId: createAttemptId(),
    questionId,
    metadata,
  };

  await addEvent(event);
}
