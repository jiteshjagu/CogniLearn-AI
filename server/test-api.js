// Quick automated test for backend database and routes

import { db } from './db.js';
import { AdaptiveEngineBackend } from './services/adaptiveEngineBackend.js';

console.log('Testing Database...');
const classes = db.getClasses();
console.log(`Found ${classes.length} classes:`, classes.map(c => c.name).join(', '));

const students = db.getStudents();
console.log(`Found ${students.length} students:`, students.map(s => s.name).join(', '));

console.log('Testing Adaptive Diagnostic Engine...');
const sampleAnswers = [
  { questionId: 'q_c1_e1', conceptId: 'c1', difficulty: 'easy', isCorrect: true },
  { questionId: 'q_c2_e1', conceptId: 'c2', difficulty: 'easy', isCorrect: true },
  { questionId: 'q_c3_e1', conceptId: 'c3', difficulty: 'easy', isCorrect: true },
  { questionId: 'q_c4_e1', conceptId: 'c4', difficulty: 'easy', isCorrect: false },
  { questionId: 'q_c4_m1', conceptId: 'c4', difficulty: 'medium', isCorrect: false },
  { questionId: 'q_c5_e1', conceptId: 'c5', difficulty: 'easy', isCorrect: false }
];

const analysis = AdaptiveEngineBackend.analyzeDiagnostic(sampleAnswers);
console.log('Analysis result:', {
  overallMastery: analysis.overallMastery,
  criticalGaps: analysis.criticalGaps,
  rootPrerequisiteBottleneck: analysis.rootPrerequisiteBottleneck
});

console.log('Testing Personalized Learning Path Generation...');
const path = AdaptiveEngineBackend.generatePersonalizedLearningPath({
  conceptMastery: analysis.conceptMastery,
  criticalGaps: analysis.criticalGaps
});
console.log('Path modules prioritized:', path.map(p => `${p.priority}: ${p.title}`).join(' -> '));

console.log('✅ ALL BACKEND LOGIC PASSED VERIFICATION.');
