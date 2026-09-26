import { Router } from 'express';
import { db } from '../db.js';
import { CONCEPT_LESSONS } from '../../src/data/conceptsData.js';
import { DynamicQuestionGenerator } from '../../src/services/dynamicQuestionGenerator.js';

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

// POST generate dynamic question(s) via Gemini AI or Procedural Math Engine
questionRouter.post('/generate-dynamic', async (req, res) => {
  const { conceptId = 'c4', difficulty = 'medium', context = {}, count = 1, apiKey } = req.body;
  try {
    if (count > 1) {
      const questions = [];
      for (let i = 0; i < count; i++) {
        const q = await DynamicQuestionGenerator.generateAiQuestion(conceptId, difficulty, context, apiKey);
        questions.push(q);
      }
      return res.json({ success: true, questions });
    }
    const question = await DynamicQuestionGenerator.generateAiQuestion(conceptId, difficulty, context, apiKey);
    res.json({ success: true, question });
  } catch (err) {
    console.error('Error in /generate-dynamic:', err.message);
    const fallbackQ = DynamicQuestionGenerator.generateProceduralQuestion(conceptId, difficulty);
    res.json({ success: true, question: fallbackQ });
  }
});

// GET dynamic question by query params (e.g. /api/questions/dynamic?conceptId=c4&difficulty=hard)
questionRouter.get('/dynamic', async (req, res) => {
  const { conceptId = 'c4', difficulty = 'medium' } = req.query;
  try {
    const question = await DynamicQuestionGenerator.generateAiQuestion(conceptId, difficulty);
    res.json(question);
  } catch {
    const fallbackQ = DynamicQuestionGenerator.generateProceduralQuestion(conceptId, difficulty);
    res.json(fallbackQ);
  }
});

// GET questions by concept and difficulty from seed bank
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
