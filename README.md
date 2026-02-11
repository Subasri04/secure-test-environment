## Secure Test Environment (STEE)

A controlled browser-based assessment platform with audit logging, fullscreen enforcement, timer management, and immutable submission handling.

### 🚀 Tech Stack
- Frontend
    - React (Vite + TypeScript)
    - Ant Design (UI)
    - IndexedDB (Local event storage)
    - Session Storage (Attempt & timer state)

- Backend
    - Node.js
    - Express
    - JSON file storage (No external DB)

### 🎯 Core Features
1. Browser Enforcement
    - Restricts assessment to Google Chrome
    - Logs browser access attempts

2. Unified Event Logging

Captures:
- Fullscreen enter / exit
- Copy / Cut / Paste attempts
- Tab blur / focus
- Timer started / expired
- Submission

All logs include:
- eventType
- timestamp
- attemptId
- employeeId
- metadata

3. Batched Logging\
Events are stored locally in IndexedDB

Sent in batch via:
- POST /api/assessment-logs/batch

Batch triggers:
- Manual submit
- Timer expiry
- Tab focus regain (auto-batch)

4. Timer Management
- Duration configurable via .env
- Persistent across refresh
- Auto-submits on expiry
- Stops immediately after submission

5. Fullscreen Enforcement
- Forces DOM fullscreen
- Logs enter / exit
- Re-enables if exited
- Disabled after submission

6. Immutability Enforcement (Backend)\
After submit:
- No further logs accepted
- Duplicate submit rejected
- Attempt becomes immutable

📂 Project Structure\
secure-test-environment/\
│\
├── frontend/\
│   ├── src/\
│   │   ├── pages/\
│   │   ├── hooks/\
│   │   ├── services/\
│   │   ├── storage/\
│   │   ├── types/\
│   │   └── config/\
│\
├── backend/\
│   ├── src/\
│   │   ├── controllers/\
│   │   ├── services/\
│   │   ├── routes/\
│   │   ├── types/\
│   │   └── data/\
│\
└── README.md/

#### ⚙️ Environment Configuration
Frontend .env\
VITE_API_BASE_URL=http://localhost:4000/api
VITE_ASSESSMENT_DURATION_SECONDS=600

Backend .env\
PORT=4000

#### 🖥️ Running the Project
1. Backend
```
cd backend
npm install
npm run dev
```
Server runs on:\
http://localhost:4000

2. Frontend
```
cd frontend
npm install
npm run dev
```

App runs on:\
http://localhost:5173

#### 🔐 API Endpoints
Browser Logs:
```
POST /api/browser-logs
```

Assessment Logs:\
Batch Ingest
```
POST /api/assessment-logs/batch
Body:
{
  "logs": [ ... ]
}
```
Get All Logs
```
GET /api/assessment-logs
```

Get Logs By Employee
```
GET /api/assessment-logs/:employeeId
```

#### 🧠 Logging Architecture
Flow\
User Action\
   ↓\
Event Logged (IndexedDB)\
    ↓\
Batch Sync Triggered\
    ↓\
Backend JSON Storage\
    ↓\
Employer Audit Dashboard

#### 🔎 Audit Integrity
- Timestamps generated at event time (frontend)
- Backend does NOT override timestamps
- Submission locks attempt
- Backend rejects logs after submission
- Attempt IDs unique per session

📊 Example Event Record
```
{
  "id": 5,
  "eventType": "copy_attempt",
  "attemptId": "uuid",
  "employeeId": "emp1001",
  "timestamp": "2026-02-11T11:45:10.531Z",
  "metadata": {}
}
```

#### 📌 Summary

This system provides:
- Controlled browser enforcement
- Complete audit trail
- Reliable batching
- Immutable submissions
- Persistent timer
- Employer-friendly log access
- Designed for secure, production-ready assessment environments.