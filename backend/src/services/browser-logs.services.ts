import fs from "fs";
import path from "path";
import { BrowserLog } from "../types/browser-logs.types";

const dataDir = path.join(__dirname, "..", "data");
const filePath = path.join(dataDir, "browser-logs.json");

function ensureFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
}

export function readBrowserLogs(): BrowserLog[] {
  ensureFile();
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

export function appendBrowserLog(log: BrowserLog): void {
  const logs = readBrowserLogs();
  logs.push(log);
  fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));
}
