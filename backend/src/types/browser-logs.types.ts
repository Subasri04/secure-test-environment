export type BrowserEventType =
  | "browser_detected"
  | "access_allowed"
  | "access_blocked";

export interface BrowserLog {
  id: string;
  employeeId: string;
  eventType: BrowserEventType;
  browserName: string;
  browserVersion: string;
  timestamp: string;
}
