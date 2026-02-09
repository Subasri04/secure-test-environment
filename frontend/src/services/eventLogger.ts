
import type { AuditEvent } from "../types/event.types";
import { createAttemptId } from "./attemptService";

export function logEvent(
  eventType: string,
  metadata: Record<string, string | number | boolean> = {},
  questionId: string | null = null
) {
  const event: AuditEvent = {
    eventType,
    timestamp: new Date().toISOString(),
    attemptId: createAttemptId(),
    questionId,
    metadata,
  };

  console.log("[AUDIT EVENT]", event);
}
