export type AssessmentEventType =
  | "fullscreen_entered"
  | "fullscreen_exited"
  | "copy_attempt"
  | "cut_attempt"
  | "paste_attempt"
  | "tab_blur"
  | "tab_focus"
  | "timer_started"
  | "timer_expired"
  | "submit";

export interface AssessmentEvent {
  eventType: AssessmentEventType;
  attemptId: string;
  questionId: string | null;
  metadata: Record<string, unknown>;
  timestamp: string;
}
