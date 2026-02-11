const TIMER_KEY = "assessment_timer";

interface TimerState {
  startTime: number;
  duration: number;
}

export function initTimer(duration: number): void {
  const existing = sessionStorage.getItem(TIMER_KEY);
  if (existing) return;

  const state: TimerState = {
    startTime: Date.now(),
    duration,
  };

  sessionStorage.setItem(TIMER_KEY, JSON.stringify(state));
}

export function getRemainingSeconds(): number {
  const raw = sessionStorage.getItem(TIMER_KEY);
  if (!raw) return -1;

  const timer: TimerState = JSON.parse(raw);
  const elapsed = Math.floor((Date.now() - timer.startTime) / 1000);
  return Math.max(timer.duration - elapsed, 0);
}

export function clearTimer(): void {
  sessionStorage.removeItem(TIMER_KEY);
}
