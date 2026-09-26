// Server-Side Persistent JSON Database Layer

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// Initial seed data
import { INITIAL_CLASSES, INITIAL_STUDENTS, INITIAL_MENTORS, INITIAL_ADMINS, INITIAL_SUBMISSIONS } from '../src/data/initialData.js';
import { CONCEPTS } from '../src/data/conceptsData.js';
import { QUESTION_BANK, DIAGNOSTIC_QUESTION_IDS } from '../src/data/questionBank.js';

class Database {
  constructor() {
    this.data = {
      classes: [],
      students: [],
      mentors: [],
      admins: [],
      submissions: []
    };
    this.init();
  }

  init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(STORE_FILE)) {
      this.reset();
    } else {
      try {
        const raw = fs.readFileSync(STORE_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Error loading store.json, resetting to defaults:', err);
        this.reset();
      }
    }
  }

  save() {
    try {
      fs.writeFileSync(STORE_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save to store.json:', err);
    }
  }

  reset() {
    this.data = {
      classes: JSON.parse(JSON.stringify(INITIAL_CLASSES)),
      students: JSON.parse(JSON.stringify(INITIAL_STUDENTS)),
      mentors: JSON.parse(JSON.stringify(INITIAL_MENTORS)),
      admins: JSON.parse(JSON.stringify(INITIAL_ADMINS)),
      submissions: JSON.parse(JSON.stringify(INITIAL_SUBMISSIONS))
    };
    this.save();
    console.log('✅ Database seeded and reset successfully to default state.');
  }

  // Classes
  getClasses() {
    return this.data.classes;
  }

  getClassById(id) {
    return this.data.classes.find(c => c.id === id) || null;
  }

  // Students
  getStudents() {
    return this.data.students;
  }

  getStudentById(id) {
    return this.data.students.find(s => s.id === id) || null;
  }

  updateStudent(id, fields) {
    const index = this.data.students.findIndex(s => s.id === id);
    if (index !== -1) {
      this.data.students[index] = { ...this.data.students[index], ...fields };
      this.save();
      return this.data.students[index];
    }
    return null;
  }

  addStudentNote(studentId, noteObj) {
    const student = this.getStudentById(studentId);
    if (student) {
      student.mentorNotes = student.mentorNotes || [];
      student.mentorNotes.unshift(noteObj);
      this.save();
      return student;
    }
    return null;
  }

  // Mentors & Admins
  getMentors() {
    return this.data.mentors;
  }

  getAdmins() {
    return this.data.admins;
  }

  // Submissions
  getSubmissions() {
    return this.data.submissions;
  }

  getSubmissionsByStudent(studentId) {
    return this.data.submissions.filter(s => s.studentId === studentId);
  }

  getSubmissionById(id) {
    return this.data.submissions.find(s => s.id === id) || null;
  }

  addSubmission(sub) {
    const newSubmission = {
      ...sub,
      id: sub.id || `sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      date: sub.date || new Date().toLocaleString()
    };
    this.data.submissions.unshift(newSubmission);
    this.save();
    return newSubmission;
  }

  // Knowledge models
  getConcepts() {
    return CONCEPTS;
  }

  getQuestions() {
    return QUESTION_BANK;
  }

  getDiagnosticQuestions() {
    return DIAGNOSTIC_QUESTION_IDS
      .map(id => QUESTION_BANK.find(q => q.id === id))
      .filter(Boolean);
  }
}

export const db = new Database();
