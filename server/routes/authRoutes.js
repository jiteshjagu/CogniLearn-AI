import { Router } from 'express';
import { db } from '../db.js';

export const authRouter = Router();

authRouter.post('/login', (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ error: 'Email and role are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (role === 'student') {
    const student = db.getStudents().find(s => s.email.toLowerCase() === normalizedEmail);
    if (student) {
      return res.json({ user: student, role: 'student' });
    }
    return res.status(404).json({ error: 'Student not found with this email' });
  }

  if (role === 'mentor') {
    const mentor = db.getMentors().find(m => m.email.toLowerCase() === normalizedEmail);
    if (mentor) {
      return res.json({ user: mentor, role: 'mentor' });
    }
    return res.status(404).json({ error: 'Academic Mentor not found with this email' });
  }

  if (role === 'admin') {
    const admin = db.getAdmins().find(a => a.email.toLowerCase() === normalizedEmail);
    if (admin) {
      return res.json({ user: admin, role: 'admin' });
    }
    return res.status(404).json({ error: 'Administrator not found with this email' });
  }

  return res.status(400).json({ error: 'Invalid role specified' });
});

authRouter.get('/demo-profiles', (req, res) => {
  res.json({
    students: db.getStudents(),
    mentors: db.getMentors(),
    admins: db.getAdmins()
  });
});
