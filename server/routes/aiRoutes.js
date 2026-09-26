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
  const { message, subjectId, context, apiKey } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty or whitespace only.' });
  }

  try {
    const result = await AiServiceBackend.chat(message.trim(), { ...context, subjectId }, apiKey);
    res.json(result);
  } catch (err) {
    if (err.status === 429 || err.message?.includes('429')) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded', 
        retryAfter: err.retryAfter || 30,
        message: 'The AI Tutor has reached its current API rate limit. Please retry in a few seconds.' 
      });
    }
    console.error('Chat endpoint error:', err);
    res.status(500).json({ error: err.message || 'Internal server error while processing AI tutor response.' });
  }
});

// GET: Check whether Gemini API key is currently active
aiRouter.get('/key-status', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim());
  res.json({
    hasKey,
    model: 'gemini-1.5-flash',
    source: hasKey ? 'Configured in backend .env' : 'Running on dynamic intelligent pedagogical engine'
  });
});

// POST: Dynamically connect / update Gemini API key and persist to .env
aiRouter.post('/set-key', async (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey || !apiKey.trim()) {
    return res.status(400).json({ error: 'API key cannot be empty' });
  }

  const cleanKey = apiKey.trim().replace(/^["']|["']$/g, '');
  process.env.GEMINI_API_KEY = cleanKey;

  // Persist to .env file
  try {
    const fs = await import('fs');
    const path = await import('path');
    const envPath = path.resolve(process.cwd(), '.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      if (envContent.includes('GEMINI_API_KEY=')) {
        envContent = envContent.replace(/GEMINI_API_KEY=.*(\r?\n|$)/, `GEMINI_API_KEY=${cleanKey}\n`);
      } else {
        envContent += `\nGEMINI_API_KEY=${cleanKey}\n`;
      }
    } else {
      envContent = `GEMINI_API_KEY=${cleanKey}\nPORT=5001\n`;
    }
    fs.writeFileSync(envPath, envContent, 'utf8');
  } catch (e) {
    console.warn('Notice: Could not persist to .env file:', e.message);
  }

  res.json({
    success: true,
    message: 'Google Gemini API key connected successfully! The chatbot will now provide live model inference.'
  });
});

