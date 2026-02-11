export interface AssessmentLog {
  id?: number;
  employeeId: string;
  attemptId: string;
  eventType: string;
  questionId: string | null;
  metadata: Record<string, unknown>;
  timestamp: string;
}
