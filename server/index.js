import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db.js';

import { authRouter } from './routes/authRoutes.js';
import { classRouter } from './routes/classRoutes.js';
import { studentRouter } from './routes/studentRoutes.js';
import { assessmentRouter } from './routes/assessmentRoutes.js';
import { questionRouter } from './routes/questionRoutes.js';
import { aiRouter } from './routes/aiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/classes', classRouter);
app.use('/api/students', studentRouter);
app.use('/api/assessment', assessmentRouter);
app.use('/api/questions', questionRouter);
app.use('/api/ai', aiRouter);

// System routes
app.post('/api/system/reset', (req, res) => {
  db.reset();
  res.json({ message: 'Database reset to default demo baseline successfully.' });
});

app.get('/api/system/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'CogniLearn AI Adaptive Learning Platform Backend',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    stats: {
      classes: db.getClasses().length,
      students: db.getStudents().length,
      submissions: db.getSubmissions().length
    }
  });
});

// Root ping
app.get('/', (req, res) => {
  res.json({
    message: 'CogniLearn AI Adaptive Learning Platform API Server is running.',
    documentation: '/api/system/health'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 CogniLearn AI Adaptive Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 Health endpoint: http://localhost:${PORT}/api/system/health`);
});
