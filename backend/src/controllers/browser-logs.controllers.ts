import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { appendBrowserLog, readBrowserLogs } from "../services/browser-logs.services";
import { BrowserLog } from "../types/browser-logs.types";

export function createBrowserLog(req: Request, res: Response) {
  const { employeeId, eventType, browserName, browserVersion } = req.body;

  if (!employeeId || !eventType || !browserName || !browserVersion) {
    return res.status(400).json({ message: "Invalid browser log payload" });
  }

  const log: BrowserLog = {
    id: uuid(),
    employeeId,
    eventType,
    browserName,
    browserVersion,
    timestamp: new Date().toISOString(),
  };

  appendBrowserLog(log);
  res.status(201).json({ success: true });
}

export function getAllBrowserLogs(_: Request, res: Response) {
  res.json(readBrowserLogs());
}

export function getBrowserLogsByEmployee(
  req: Request,
  res: Response
) {
  const { employeeId } = req.params;
  const logs = readBrowserLogs().filter(
    log => log.employeeId === employeeId
  );
  res.json(logs);
}
