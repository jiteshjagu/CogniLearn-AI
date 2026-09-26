// Client API adapter: connects to backend /api routes with transparent fallback to StorageService

import { StorageService } from './storageService';
import { AdaptiveEngine } from './adaptiveEngine';

const API_BASE = '/api';

export const ApiClient = {
  // Health check to verify if backend server is running
  isBackendAvailable: async () => {
    try {
      const res = await fetch(`${API_BASE}/system/health`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Auth Login
  login: async (email, role) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend unavailable, using client storage:', e.message);
    }

    // Fallback to local storage
    if (role === 'student') {
      const student = StorageService.getStudents().find(s => s.email.toLowerCase() === email.trim().toLowerCase());
      return student ? { user: student, role: 'student' } : null;
    } else if (role === 'mentor') {
      const mentor = StorageService.getMentors().find(m => m.email.toLowerCase() === email.trim().toLowerCase());
      return mentor ? { user: mentor, role: 'mentor' } : null;
    } else {
      const admin = StorageService.getAdmins().find(a => a.email.toLowerCase() === email.trim().toLowerCase());
      return admin ? { user: admin, role: 'admin' } : null;
    }
  },

  // Classes
  getClasses: async () => {
    try {
      const res = await fetch(`${API_BASE}/classes`);
      if (res.ok) return await res.json();
    } catch {}
    return StorageService.getClasses();
  },

  compareClasses: async (classAId, classBId) => {
    try {
      const res = await fetch(`${API_BASE}/classes/compare/${classAId}/${classBId}`);
      if (res.ok) return await res.json();
    } catch {}
    return null;
  },

  // Students
  getStudents: async (classId = null, search = '') => {
    try {
      const params = new URLSearchParams();
      if (classId) params.append('classId', classId);
      if (search) params.append('search', search);
      const res = await fetch(`${API_BASE}/students?${params.toString()}`);
      if (res.ok) return await res.json();
    } catch {}
    return StorageService.getStudents();
  },

  addStudent: async (studentData) => {
    try {
      const res = await fetch(`${API_BASE}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
      if (res.ok) {
        const saved = await res.json();
        StorageService.addStudent(saved);
        return saved;
      }
    } catch {}
    return StorageService.addStudent(studentData);
  },

  addMentorNote: async (studentId, note, author) => {
    try {
      const res = await fetch(`${API_BASE}/students/${studentId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note, author })
      });
      if (res.ok) return await res.json();
    } catch {}
    return null;
  },

  // Submissions
  getSubmissionsForStudent: async (studentId) => {
    try {
      const res = await fetch(`${API_BASE}/assessment/submissions/student/${studentId}`);
      if (res.ok) return await res.json();
    } catch {}
    return StorageService.getSubmissionsByStudent(studentId);
  },

  // Process Diagnostic
  submitDiagnostic: async (studentId, answers) => {
    try {
      const res = await fetch(`${API_BASE}/assessment/diagnostic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, answers })
      });
      if (res.ok) return await res.json();
    } catch {}
    return null;
  },

  // Dynamic Next Adaptive Question
  getNextAdaptiveQuestion: async (params) => {
    try {
      const res = await fetch(`${API_BASE}/assessment/adaptive-next`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) return await res.json();
    } catch {}
    return AdaptiveEngine.getNextAdaptiveQuestion(params);
  },

  // Submit Adaptive Quiz
  submitAdaptiveQuiz: async (submissionPayload) => {
    try {
      const res = await fetch(`${API_BASE}/assessment/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionPayload)
      });
      if (res.ok) return await res.json();
    } catch {}
    return null;
  }
};
