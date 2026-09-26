import { Router } from 'express';
import { db } from '../db.js';
import { CONCEPT_LESSONS } from '../../src/data/conceptsData.js';

export const questionRouter = Router();

// GET all concepts & prerequisite definitions
questionRouter.get('/concepts', (req, res) => {
  res.json({
    concepts: db.getConcepts(),
    lessons: CONCEPT_LESSONS
  });
});

// GET questions for initial diagnostic test
questionRouter.get('/diagnostic', (req, res) => {
  const diagnosticQuestions = db.getDiagnosticQuestions();
  res.json(diagnosticQuestions);
});

// GET questions by concept and difficulty
questionRouter.get('/', (req, res) => {
  const { conceptId, difficulty } = req.query;
  let questions = db.getQuestions();

  if (conceptId) {
    questions = questions.filter(q => q.conceptId === conceptId);
  }
  if (difficulty) {
    questions = questions.filter(q => q.difficulty === difficulty);
  }

  res.json(questions);
});
