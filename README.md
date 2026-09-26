# CogniLearn AI - Adaptive AI-Powered Personalized Learning Platform

An AI-powered adaptive learning platform designed to diagnose knowledge gaps, analyze prerequisite dependencies, dynamically generate personalized learning paths, and execute real-time difficulty-adjusted assessments.

---

## 🌟 Key Architecture & Capabilities

### 1. Role-Based Portals & Authentication
- **Login Screen with 3 Role Tabs**:
  - **Student Login**: Instant access to diagnostic tests, visual knowledge graphs, personalized learning modules, and live adaptive quizzes.
  - **Academic Mentor Portal**: Inspect individual student test counts, mastery progress, question-by-question answer breakdowns (student pick vs correct answer, time spent, error explanations), and assign mentor feedback.
  - **Administrator Command Center**: Monitor cohort performance across classes (Class 10-A, Class 10-B, Class 11-A), view class rosters, and perform side-by-side **Comparative Class Benchmarking** (Class A vs Class B).
- **1-Click Quick Demo Profiles**:
  - *Alex Rivera* (Class 10-B): Demonstrates critical prerequisite bottleneck in Factoring Polynomials cascading into Quadratic Equations.
  - *Jordan Taylor*: Fresh, uncalibrated student ready to take the baseline Diagnostic Assessment from scratch.
  - *Maya Chen*: High-performing student with 92% mastery.
  - *Dr. Marcus Vance*: Lead Academic Mentor for Class 10-A and 10-B.
  - *Director Sarah Jenkins*: Administrator with institutional overview and cohort comparison.

### 2. The 5-Stage Adaptive Learning Cycle
```
[1. Diagnostic Assessment] 
        ↓
[2. Knowledge Gap Analysis & Prerequisite Dependency Graph]
        ↓
[3. Dynamic Personalized Learning Path]
        ↓
[4. Live Adaptive Quiz (Real-Time Difficulty Adjustment)]
        ↓
[5. Updated Continuous Learning Profile & Recommendations]
```

1. **Diagnostic Assessment (Stage 1)**:
   - Baseline calibration test covering 7 core concepts:
     1. Arithmetic & Number Properties
     2. Linear Equations & Inequalities
     3. Polynomial Operations
     4. Factoring Polynomials
     5. Quadratic Equations & Roots
     6. Parabolic Graphs & Vertex Forms
     7. Exponential Functions
   - Question navigator, conceptual hints, timer, and baseline score calibration.

2. **Knowledge Gap Detection & Prerequisite Graph (Stage 2)**:
   - Interactive hierarchical concept dependency map.
   - Nodes color-coded by mastery:
     - 🟢 **Mastered** ($\ge 75\%$)
     - 🟡 **Developing** ($50\% - 74\%$)
     - 🔴 **Critical Gap** ($< 50\%$)
   - Root Prerequisite Bottleneck detection algorithm (e.g. flagging that Factoring is blocking Quadratic Equations).

3. **Personalized Learning Path (Stage 3)**:
   - Dynamically generated using topological sorting.
   - Prioritizes urgent gaps and prerequisite bridges first.
   - Interactive modules with core principles, visual formula cards, worked step-by-step proofs, and instant comprehension checks.
   - Embedded **AI Learning Support**:
     - "Explain Simply (ELI10)" with everyday analogies.
     - "Deep Dive AI Breakdown" with mathematical reasoning.

4. **Live Adaptive Quiz Engine (Stage 4)**:
   - Real-time difficulty modulation based on continuous student responses:
     - Correct answer $\rightarrow$ Difficulty scales up (Easy $\rightarrow$ Medium $\rightarrow$ Hard).
     - Incorrect answer $\rightarrow$ Difficulty adapts down (Hard $\rightarrow$ Medium $\rightarrow$ Easy) with supportive foundational reinforcement.
   - Visual **Live Adaptive Engine Difficulty Gauge** displaying active tier.
   - Instant cognitive misconception breakdown explaining *why* the chosen option was incorrect.
   - Confetti celebration upon completing mastery challenges.

5. **Updated Continuous Recommendations (Stage 5)**:
   - Ingests test performance into the student's continuous profile.
   - Displays before vs after mastery growth.
   - Dynamically unlocks downstream concepts and suggests next challenges.

6. **Embedded AI Study Companion (Floating Drawer)**:
   - CogniAI tutor available across all stages for instant help, formula lookups, and Socratic guidance.
   - Optional Google Gemini API integration support via Settings modal, with a built-in offline pedagogical engine that works 100% reliably out of the box.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```
Verify the production build preview with:
```bash
npm run preview
```

---

## 📁 Project Structure

```
src/
├── App.jsx                       # Main application shell & role-based routing
├── main.jsx                      # Vite entrypoint
├── index.css                     # Tailwind CSS styling & custom scrollbars
├── data/
│   ├── conceptsData.js           # Concept graph, prerequisites, and learning content
│   ├── questionBank.js           # Pool of Easy, Medium, and Hard questions
│   └── initialData.js            # Initial seed data for classes, students, and submissions
├── services/
│   ├── adaptiveEngine.js         # Gap detection, difficulty adaptation, and profile updates
│   ├── aiTutorService.js         # Gemini API integration & offline pedagogical knowledge engine
│   └── storageService.js         # LocalStorage persistence & database management
└── components/
    ├── common/
    │   └── Navbar.jsx            # Brand bar, persona switcher, API settings, and reset button
    ├── auth/
    │   └── LoginView.jsx         # 3-role login page with 1-click test credentials
    ├── admin/
    │   └── AdminDashboard.jsx    # Class overview, class detail, and comparative analysis
    ├── mentor/
    │   └── MentorDashboard.jsx   # Student roster, test history, question-by-question inspector
    └── student/
        ├── StudentDashboard.jsx           # 5-stage adaptive cycle coordinator
        ├── DiagnosticAssessment.jsx       # Stage 1: Initial baseline evaluation
        ├── KnowledgeAnalysisView.jsx      # Stage 2: Prerequisite dependency graph
        ├── PersonalizedLearningPath.jsx   # Stage 3: Step-by-step remedial modules
        ├── AdaptiveQuizView.jsx           # Stage 4: Real-time difficulty-adjusted quiz
        ├── UpdatedRecommendationsView.jsx # Stage 5: Continuous profile & growth
        └── AiTutorDrawer.jsx              # Floating AI study companion chat
```
