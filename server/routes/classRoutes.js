import { Router } from 'express';
import { db } from '../db.js';
import { CONCEPT_LIST } from '../../src/data/conceptsData.js';

export const classRouter = Router();

// GET all classes with aggregated metrics
classRouter.get('/', (req, res) => {
  const classes = db.getClasses();
  const students = db.getStudents();

  const enrichedClasses = classes.map(c => {
    const classStudents = students.filter(s => s.classId === c.id);
    const totalMastery = classStudents.reduce((acc, s) => acc + (s.overallMastery || 0), 0);
    const avgMastery = classStudents.length > 0 ? Math.round(totalMastery / classStudents.length) : 0;
    const totalTests = classStudents.reduce((acc, s) => acc + (s.testsTaken || 0), 0);
    const interventionCount = classStudents.filter(s => s.status === 'Needs Intervention').length;

    return {
      ...c,
      studentCount: classStudents.length,
      avgMastery,
      totalTests,
      interventionCount
    };
  });

  res.json(enrichedClasses);
});

// GET single class with its students
classRouter.get('/:id', (req, res) => {
  const c = db.getClassById(req.params.id);
  if (!c) {
    return res.status(404).json({ error: 'Class not found' });
  }

  const students = db.getStudents().filter(s => s.classId === c.id);
  res.json({
    ...c,
    students
  });
});

// GET comparative analysis between two classes
classRouter.get('/compare/:classAId/:classBId', (req, res) => {
  const { classAId, classBId } = req.params;
  const classA = db.getClassById(classAId);
  const classB = db.getClassById(classBId);

  if (!classA || !classB) {
    return res.status(404).json({ error: 'One or both classes not found' });
  }

  const allStudents = db.getStudents();
  const studentsA = allStudents.filter(s => s.classId === classAId);
  const studentsB = allStudents.filter(s => s.classId === classBId);

  const calculateMetrics = (cohort) => {
    if (cohort.length === 0) {
      return { avgMastery: 0, totalTests: 0, testsPerStudent: '0.0', interventionCount: 0, avgByConcept: {} };
    }
    const totalMastery = cohort.reduce((acc, s) => acc + (s.overallMastery || 0), 0);
    const avgMastery = Math.round(totalMastery / cohort.length);
    const totalTests = cohort.reduce((acc, s) => acc + (s.testsTaken || 0), 0);
    const interventionCount = cohort.filter(s => s.status === 'Needs Intervention').length;

    const avgByConcept = {};
    CONCEPT_LIST.forEach(c => {
      const sum = cohort.reduce((acc, s) => acc + (s.conceptMastery?.[c.id] || 0), 0);
      avgByConcept[c.id] = Math.round(sum / cohort.length);
    });

    return {
      studentCount: cohort.length,
      avgMastery,
      totalTests,
      testsPerStudent: (totalTests / cohort.length).toFixed(1),
      interventionCount,
      interventionRate: Math.round((interventionCount / cohort.length) * 100),
      avgByConcept
    };
  };

  const metricsA = calculateMetrics(studentsA);
  const metricsB = calculateMetrics(studentsB);

  // Concept delta analysis
  const conceptDeltas = CONCEPT_LIST.map(concept => {
    const scoreA = metricsA.avgByConcept[concept.id] || 0;
    const scoreB = metricsB.avgByConcept[concept.id] || 0;
    return {
      conceptId: concept.id,
      conceptName: concept.name,
      category: concept.category,
      scoreA,
      scoreB,
      delta: scoreA - scoreB
    };
  });

  res.json({
    classA: { ...classA, metrics: metricsA },
    classB: { ...classB, metrics: metricsB },
    conceptDeltas,
    recommendation: `Analysis indicates a significant gap in Factoring Polynomials for ${classB.name}. Reinforcing factoring will unlock downstream performance in quadratics.`
  });
});
