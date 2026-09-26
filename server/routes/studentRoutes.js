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

// POST create new student
studentRouter.post('/', (req, res) => {
  const { name, email, classId } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  // Check if student with email or name already exists
  const normEmail = email.trim().toLowerCase();
  const normName = name.trim().toLowerCase();
  const existing = db.getStudents().find(s => 
    s.email?.toLowerCase().trim() === normEmail ||
    s.name?.toLowerCase().trim() === normName
  );
  if (existing) {
    return res.status(200).json(existing);
  }

  const newStudent = db.addStudent({ name, email, classId });
  res.status(201).json(newStudent);
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
