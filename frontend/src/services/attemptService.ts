export function createAttemptId(): string {
  const key = "ste_attempt_id";
  let attemptId = sessionStorage.getItem(key);

  if (!attemptId) {
    attemptId = crypto.randomUUID();
    sessionStorage.setItem(key, attemptId);
  }

  return attemptId;
}
