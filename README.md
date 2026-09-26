# CogniLearn AI — Adaptive AI-Powered Personalized Learning Platform

A full-stack AI-powered personalized learning platform that continuously evaluates student performance, detects concept gaps, traces prerequisite dependency bottlenecks, dynamically adapts learning paths, and adjusts quiz difficulty in real time.

---

## 🏗️ Architecture Overview

```
                      ┌──────────────────────────────────────────┐
                      │             React 19 Frontend            │
                      │  • Student Portal (5-Stage Cycle)        │
                      │  • Academic Mentor (Question Inspector)  │
                      │  • Administrator (Class A vs B Compare)  │
                      └─────────────────────┬────────────────────┘
                                            │ HTTP / REST
                                            ▼
                      ┌──────────────────────────────────────────┐
                      │         Express.js Backend Server        │
                      │  Port 5000 (Proxy configured via Vite)   │
                      └───────┬──────────────┬───────────────────┘
                              │              │
           ┌──────────────────┴──┐        ┌──┴──────────────────┐
           │                     │        │                     │
           ▼                     ▼        ▼                     ▼
┌──────────────────┐   ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ Auth & Users     │   │ Classes       │ │ Adaptive      │ │ AI Pedagogical│
│ • Student        │   │ • Rosters     │ │ Engine        │ │ Support       │
│ • Mentor         │   │ • Comparison  │ │ • Gap Tracer  │ │ • Gemini API  │
│ • Administrator  │   │ • Variance    │ │ • Real-Time DDA││ • Misconception│
└──────────────────┘   └───────────────┘ └───────────────┘ └───────────────┘
```

---

## ⚡ Running the Platform

### Option 1: Run Fullstack (Backend + Frontend simultaneously)
```bash
npm run fullstack
```
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:3000`

### Option 2: Run Separately
In Terminal 1 (Backend):
```bash
npm run server
```

In Terminal 2 (Frontend):
```bash
npm run dev
```

---

## 📡 REST API Reference

### 1. Authentication & Demographics (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate Student, Academic Mentor, or Administrator |
| `GET` | `/api/auth/demo-profiles` | Returns available 1-click test profiles (Alex Rivera, Jordan Taylor, etc.) |

### 2. Classes & Comparative Benchmarking (`/api/classes`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/classes` | Get all classes with aggregated mastery, student count, and gap rates |
| `GET` | `/api/classes/:id` | Get single class with complete enrolled student roster |
| `GET` | `/api/classes/compare/:classAId/:classBId` | **Comparative analysis of Class A vs Class B** (side-by-side KPIs, concept mastery deltas, and AI curriculum recommendations) |

### 3. Students & Mentorship (`/api/students`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/students` | List students (supports `?classId=...` and `?search=...`) |
| `GET` | `/api/students/:id` | Get student profile with concept mastery vector and test history |
| `PATCH`| `/api/students/:id` | Update student profile fields |
| `POST` | `/api/students/:id/notes` | Add mentor intervention note or targeted recommendation |

### 4. Adaptive Learning Cycle & Assessments (`/api/assessment`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/assessment/diagnostic` | Analyzes baseline diagnostic assessment, calculates concept mastery, flags critical gaps, and identifies root prerequisite bottlenecks |
| `GET` | `/api/assessment/learning-path/:studentId` | Dynamically generates personalized learning path sorted topologically |
| `POST` | `/api/assessment/adaptive-next` | **Real-Time Dynamic Difficulty Adjustment (DDA)**: Given last response, adjusts difficulty (*Easy* $\rightarrow$ *Medium* $\rightarrow$ *Hard*) and returns next calibrated question |
| `POST` | `/api/assessment/submit` | Submits completed quiz, records question-level answers, and updates continuous student profile |
| `GET` | `/api/assessment/submissions/student/:studentId` | Historical test submissions for mentor & student review |
| `GET` | `/api/assessment/submissions/:id` | **Detailed question-by-question inspector**: Student answer vs correct answer, time spent, difficulty, and error explanation |

### 5. AI Learning Support (`/api/ai`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/explain-concept` | Generates standard or ELI10 ("Explain Like I'm 10") pedagogical breakdown |
| `POST` | `/api/ai/explain-mistake` | Analyzes student mistake and identifies cognitive misconception trap |
| `POST` | `/api/ai/chat` | Multi-turn AI study companion dialog (supports optional Google Gemini API key) |

### 6. System & Health (`/api/system`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/system/health` | Returns server health, active counts, and timestamp |
| `POST` | `/api/system/reset` | Resets database back to default demo baseline |

---

## 📁 Fullstack Directory Tree

```
/Users/jiteshgupta/Downloads/hacker/
├── server/
│   ├── index.js                     # Express server setup, CORS, route mounting (port 5000)
│   ├── db.js                        # Persistent JSON database with automated seed data
│   ├── test-api.js                  # Automated unit test for backend engine & endpoints
│   ├── routes/
│   │   ├── authRoutes.js            # Authentication handlers
│   │   ├── classRoutes.js           # Class rosters & comparative analysis (Class A vs B)
│   │   ├── studentRoutes.js         # Student profiles, concept mastery & mentor notes
│   │   ├── assessmentRoutes.js      # Diagnostic analysis & real-time adaptive engine
│   │   ├── questionRoutes.js        # Knowledge graph & question bank
│   │   └── aiRoutes.js              # AI Tutor, cognitive misconception analysis
│   └── services/
│       ├── adaptiveEngineBackend.js # Server-side Bayesian mastery & gap tracing
│       └── aiServiceBackend.js      # Server-side Gemini & pedagogical engine
├── src/
│   ├── App.jsx                      # Main UI entry & role-based routing
│   ├── services/
│   │   ├── apiClient.js             # Client adapter for /api with transparent fallback
│   │   ├── adaptiveEngine.js        # Client-side adaptive logic
│   │   ├── aiTutorService.js        # AI tutor client service
│   │   └── storageService.js        # Client-side persistence
│   └── components/
│       ├── common/Navbar.jsx        # Navigation, persona switcher, reset demo
│       ├── auth/LoginView.jsx       # Student, Mentor, Admin login + 1-click profiles
│       ├── admin/AdminDashboard.jsx # Class rosters & comparison tool
│       ├── mentor/MentorDashboard.jsx # Student answers inspector & test counts
│       └── student/                 # Complete 5-stage adaptive cycle
├── vite.config.js                   # Reverse proxy: /api -> http://localhost:5000
└── package.json                     # Scripts: npm run fullstack, npm run server, npm run dev
```
