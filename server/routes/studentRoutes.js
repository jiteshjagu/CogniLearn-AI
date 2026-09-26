import { Router } from 'express';
import { db } from '../db.js';

export const studentRouter = Router();

// GET students (with optional classId and search query)
studentRouter.get('/', (req, res) => {
  const { classId, search } = req.query;
  let students = db.getStudents();

  if (classId && classId !== 'all') {
    students = students.filter(s => s.classId === classId);
  }

  if (search) {
    const q = search.toLowerCase();
    students = students.filter(s => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
  }

  res.json(students);
});

// GET single student
studentRouter.get('/:id', (req, res) => {
  const student = db.getStudentById(req.params.id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const submissions = db.getSubmissionsByStudent(student.id);
  res.json({
    ...student,
    submissions
  });
});

// PATCH update student fields
studentRouter.patch('/:id', (req, res) => {
  const updated = db.updateStudent(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Student not found' });
  }
  res.json(updated);
});

// POST add mentor note / intervention
studentRouter.post('/:id/notes', (req, res) => {
  const { author, note } = req.body;
  if (!note) {
    return res.status(400).json({ error: 'Note content is required' });
  }

  const noteObj = {
    date: new Date().toISOString().split('T')[0],
    author: author || 'Academic Mentor',
    note: note.trim()
  };

  const updated = db.addStudentNote(req.params.id, noteObj);
  if (!updated) {
    return res.status(404).json({ error: 'Student not found' });
  }

  res.json(updated);
});
