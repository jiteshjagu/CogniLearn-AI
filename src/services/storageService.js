// Storage Service for Local Persistence of Platform State

import { INITIAL_CLASSES, INITIAL_STUDENTS, INITIAL_MENTORS, INITIAL_ADMINS, INITIAL_SUBMISSIONS } from '../data/initialData';

const STORAGE_KEYS = {
  CLASSES: 'cognilearn_classes',
  STUDENTS: 'cognilearn_students',
  MENTORS: 'cognilearn_mentors',
  ADMINS: 'cognilearn_admins',
  SUBMISSIONS: 'cognilearn_submissions',
  CURRENT_USER: 'cognilearn_current_user',
  CURRENT_ROLE: 'cognilearn_current_role',
  API_KEY: 'cognilearn_gemini_api_key'
};

export const StorageService = {
  // Initialize storage if not already present
  initialize: () => {
    if (!localStorage.getItem(STORAGE_KEYS.CLASSES)) {
      StorageService.resetToDefaults();
    }
  },

  resetToDefaults: () => {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(INITIAL_CLASSES));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.MENTORS, JSON.stringify(INITIAL_MENTORS));
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(INITIAL_ADMINS));
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
  },

  getClasses: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CLASSES);
      return data ? JSON.parse(data) : INITIAL_CLASSES;
    } catch {
      return INITIAL_CLASSES;
    }
  },

  getStudents: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return data ? JSON.parse(data) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  },

  getStudentById: (studentId) => {
    const students = StorageService.getStudents();
    return students.find(s => s.id === studentId) || null;
  },

  updateStudent: (studentId, updatedFields) => {
    const students = StorageService.getStudents();
    const index = students.findIndex(s => s.id === studentId);
    if (index !== -1) {
      students[index] = { ...students[index], ...updatedFields };
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      return students[index];
    }
    return null;
  },

  addStudent: (studentData) => {
    const students = StorageService.getStudents();
    const newStudent = {
      id: studentData.id || `s_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: studentData.name?.trim() || 'New Student',
      email: studentData.email?.trim().toLowerCase(),
      classId: studentData.classId || 'class-a',
      avatar: studentData.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      initialTestTaken: false,
      overallMastery: 0,
      learningVelocity: 'Uncalibrated',
      status: 'Diagnostic Pending',
      testsTaken: 0,
      conceptMastery: {
        'c1': 0, 'c2': 0, 'c3': 0, 'c4': 0, 'c5': 0, 'c6': 0, 'c7': 0
      },
      criticalGaps: [],
      rootPrerequisiteBottleneck: null,
      mentorNotes: []
    };
    students.unshift(newStudent);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    return newStudent;
  },

  getMentors: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MENTORS);
      return data ? JSON.parse(data) : INITIAL_MENTORS;
    } catch {
      return INITIAL_MENTORS;
    }
  },

  getAdmins: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ADMINS);
      return data ? JSON.parse(data) : INITIAL_ADMINS;
    } catch {
      return INITIAL_ADMINS;
    }
  },

  getSubmissions: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      return data ? JSON.parse(data) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  },

  getSubmissionsByStudent: (studentId) => {
    const all = StorageService.getSubmissions();
    return all.filter(s => s.studentId === studentId);
  },

  addSubmission: (submission) => {
    const submissions = StorageService.getSubmissions();
    const newSubmission = {
      ...submission,
      id: submission.id || `sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      date: submission.date || new Date().toLocaleString()
    };
    submissions.unshift(newSubmission);
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
    return newSubmission;
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      const role = localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE);
      if (user && role) {
        return { user: JSON.parse(user), role };
      }
    } catch {
      // fallback
    }
    return null;
  },

  setCurrentUser: (user, role) => {
    if (user && role) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, role);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_ROLE);
    }
  },

  getApiKey: () => {
    return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
  },

  setApiKey: (key) => {
    localStorage.setItem(STORAGE_KEYS.API_KEY, key);
  }
};
