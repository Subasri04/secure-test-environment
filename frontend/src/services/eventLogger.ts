
import type { AuditEvent } from "../types/event.types";
import { getOrCreateAttemptId } from "./attemptService";

export function logEvent(
  eventType: string,
  metadata: Record<string, any>,
  questionId: string | null = null
) {
  const event: AuditEvent = {
    eventType,
    timestamp: new Date().toISOString(),
    attemptId: getOrCreateAttemptId(),
    questionId,
    metadata,
  };

  console.log("[AUDIT EVENT]", event);
}
