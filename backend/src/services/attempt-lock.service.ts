import fs from "fs";
import path from "path";

const dataDir = path.join(__dirname, "..", "data");
const filePath = path.join(dataDir, "attempt-locks.json");

function ensureFile() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]");
}

export function getLockedAttempts(): string[] {
  ensureFile();
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

export function lockAttempt(attemptId: string) {
  const locks = getLockedAttempts();
  if (!locks.includes(attemptId)) {
    locks.push(attemptId);
    fs.writeFileSync(filePath, JSON.stringify(locks, null, 2));
  }
}

export function isAttemptLocked(attemptId: string): boolean {
  return getLockedAttempts().includes(attemptId);
}
