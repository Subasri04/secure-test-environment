import { Router } from "express";
import { createBrowserLog, getAllBrowserLogs, getBrowserLogsByEmployee } from "../controllers/browser-logs.controllers";

const router = Router();

router.post("/", createBrowserLog);
router.get("/", getAllBrowserLogs);
router.get("/:employeeId", getBrowserLogsByEmployee);

export default router;
