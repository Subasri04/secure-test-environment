import type { AuditEvent } from "../types/event.types";
import { createAttemptId } from "./attemptService";
import { addEvent } from "./db";

export async function logEvent(
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

  await addEvent(event);

  console.log("[AUDIT EVENT - STORED]", event);
}
