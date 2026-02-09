export interface AuditEvent {
  eventType: string;
  timestamp: string;
  attemptId: string;
  questionId: string | null;
  metadata: Record<string, unknown>;
}


export interface StoredAuditEvent extends AuditEvent {
  id: number;
}
