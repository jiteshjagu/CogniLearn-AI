import { Router } from 'express';
import { db } from '../db.js';
import { AdaptiveEngineBackend } from '../services/adaptiveEngineBackend.js';

export const assessmentRouter = Router();

// POST: Comprehensive Dynamic Result Evaluation & Progress Tracker
assessmentRouter.post('/evaluate', (req, res) => {
  const { studentId, answers, testType = 'Adaptive Quiz', title, durationMinutes = 5 } = req.body;

  if (!studentId || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'studentId and answers array are required' });
  }

  const student = db.getStudentById(studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  // Run dynamic evaluation
  const result = AdaptiveEngineBackend.evaluateAssessmentResult(student, {
    answers,
    testType,
    title,
    durationMinutes
  });

  // Save updated student in db
  db.updateStudent(student.id, result.student);

  // Save submission in db
  const savedSubmission = db.addSubmission(result.submission);

  res.json({
    success: true,
    evaluation: result.evaluation,
    student: result.student,
    submission: savedSubmission
  });
});

// POST: Process Diagnostic Assessment
assessmentRouter.post('/diagnostic', (req, res) => {
  const { studentId, answers } = req.body;

  if (!studentId || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'studentId and answers array are required' });
  }

  const student = db.getStudentById(studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  // 1. Run adaptive diagnostic analysis
  const analysis = AdaptiveEngineBackend.analyzeDiagnostic(answers);

  // 2. Update student profile
  const updatedStudent = db.updateStudent(student.id, {
    initialTestTaken: true,
    overallMastery: analysis.overallMastery,
    conceptMastery: analysis.conceptMastery,
    criticalGaps: analysis.criticalGaps,
    rootPrerequisiteBottleneck: analysis.rootPrerequisiteBottleneck,
    status: analysis.criticalGaps.length >= 2 ? 'Needs Intervention' : analysis.overallMastery >= 75 ? 'Mastering' : 'On Track',
    testsTaken: (student.testsTaken || 0) + 1
  });

  // 3. Record submission
  const submission = db.addSubmission({
    studentId: student.id,
    studentName: student.name,
    testType: 'Diagnostic Assessment',
    title: 'Baseline Algebra Readiness Diagnostic',
    score: analysis.overallMastery,
    totalQuestions: analysis.totalQuestions,
    correctCount: analysis.correctCount,
    durationMinutes: 12,
    difficultyReached: analysis.recommendedStartingDifficulty.toUpperCase(),
    answers
  });

  res.json({
    analysis,
    student: updatedStudent,
    submission
  });
});

// GET: Generate Personalized Learning Path for student
assessmentRouter.get('/learning-path/:studentId', (req, res) => {
  const student = db.getStudentById(req.params.studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const path = AdaptiveEngineBackend.generatePersonalizedLearningPath(student);
  res.json(path);
});

// POST: Real-Time Dynamic Difficulty Adjustment for Next Adaptive Question
assessmentRouter.post('/adaptive-next', (req, res) => {
  const {
    conceptId,
    currentDifficulty,
    answeredIds,
    lastAnswerCorrect,
    consecutiveCorrect,
    consecutiveIncorrect
  } = req.body;

  if (!conceptId) {
    return res.status(400).json({ error: 'conceptId is required' });
  }

  const nextQuestionObj = AdaptiveEngineBackend.getNextAdaptiveQuestion({
    conceptId,
    currentDifficulty: currentDifficulty || 'medium',
    answeredIds: answeredIds || [],
    lastAnswerCorrect,
    consecutiveCorrect: consecutiveCorrect || 0,
    consecutiveIncorrect: consecutiveIncorrect || 0
  });

  if (!nextQuestionObj) {
    return res.json({ finished: true, message: 'Adaptive test completed or question pool exhausted' });
  }

  res.json({
    finished: false,
    ...nextQuestionObj
  });
});

// POST: Submit Completed Adaptive Quiz
assessmentRouter.post('/submit', (req, res) => {
  const submissionPayload = req.body;
  const { studentId } = submissionPayload;

  if (!studentId) {
    return res.status(400).json({ error: 'studentId is required' });
  }

  const student = db.getStudentById(studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  // 1. Record test submission
  const savedSubmission = db.addSubmission(submissionPayload);

  // 2. Update continuous student profile
  const updatedStudentProfile = AdaptiveEngineBackend.updateStudentProfile(student, submissionPayload);
  db.updateStudent(student.id, updatedStudentProfile);

  res.json({
    submission: savedSubmission,
    student: updatedStudentProfile
  });
});

// GET: Historical Submissions for a student (Mentor & Student Views)
assessmentRouter.get('/submissions/student/:studentId', (req, res) => {
  const submissions = db.getSubmissionsByStudent(req.params.studentId);
  res.json(submissions);
});

// GET: Deep Inspection for a single test submission
assessmentRouter.get('/submissions/:id', (req, res) => {
  const sub = db.getSubmissionById(req.params.id);
  if (!sub) {
    return res.status(404).json({ error: 'Submission not found' });
  }
  res.json(sub);
});
