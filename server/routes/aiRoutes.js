import { Router } from 'express';
import { AiServiceBackend } from '../services/aiServiceBackend.js';

export const aiRouter = Router();

// POST: Explain Concept (Standard or ELI10)
aiRouter.post('/explain-concept', async (req, res) => {
  const { conceptId, style, apiKey } = req.body;
  if (!conceptId) {
    return res.status(400).json({ error: 'conceptId is required' });
  }

  try {
    const text = await AiServiceBackend.explainConcept(conceptId, style || 'standard', apiKey);
    res.json({ explanation: text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Explain Mistake / Misconception Trap
aiRouter.post('/explain-mistake', async (req, res) => {
  const { question, chosenOption, correctOption, apiKey } = req.body;
  if (!question || chosenOption === undefined || correctOption === undefined) {
    return res.status(400).json({ error: 'question, chosenOption, and correctOption are required' });
  }

  try {
    const text = await AiServiceBackend.explainMistake(question, chosenOption, correctOption, apiKey);
    res.json({ breakdown: text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: AI Study Companion Chat Dialog
aiRouter.post('/chat', async (req, res) => {
  const { message, context, apiKey } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  try {
    const reply = await AiServiceBackend.chat(message, context || {}, apiKey);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
