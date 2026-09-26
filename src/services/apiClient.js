// Client API adapter: connects to backend /api routes with transparent fallback to StorageService

import { StorageService } from './storageService';
import { AdaptiveEngine } from './adaptiveEngine';
import { DynamicQuestionGenerator } from './dynamicQuestionGenerator';

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
      await fetch(`${API_BASE}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
    } catch {}
    return studentData;
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
  },

  // Generate Dynamic Question via API (with AI / procedural fallback)
  generateDynamicQuestion: async ({ conceptId = 'c4', difficulty = 'medium', context = {} }) => {
    try {
      const res = await fetch(`${API_BASE}/questions/generate-dynamic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conceptId, difficulty, context, count: 1 })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.question) return data.question;
      }
    } catch {}
    return DynamicQuestionGenerator.generateAiQuestion(conceptId, difficulty, context);
  },

  // Generate Dynamic Batch of Questions (e.g. for dynamic diagnostic)
  generateDynamicBatch: async ({ conceptIds, difficulty = 'medium' }) => {
    try {
      const res = await fetch(`${API_BASE}/questions/generate-dynamic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: conceptIds.length, difficulty })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.questions?.length) return data.questions;
      }
    } catch {}
    return DynamicQuestionGenerator.generateBatch({ conceptIds, difficulty });
  },

  // Comprehensive Dynamic Result Evaluation & Progress Tracker API
  evaluateAssessmentResult: async (student, payload) => {
    try {
      const res = await fetch(`${API_BASE}/assessment/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          ...payload
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.evaluation) {
          // Sync local storage as well
          StorageService.updateStudent(student.id, data.student);
          StorageService.addSubmission(data.submission);
          return data;
        }
      }
    } catch (e) {
      console.warn('Backend evaluation unavailable, executing local adaptive evaluation:', e.message);
    }

    // Local execution fallback
    const result = AdaptiveEngine.evaluateAssessmentResult(student, payload);
    StorageService.updateStudent(student.id, result.student);
    StorageService.addSubmission(result.submission);
    return {
      success: true,
      evaluation: result.evaluation,
      student: result.student,
      submission: result.submission
    };
  },

  // Gemini AI Tutor Chat: routed securely via backend with no exposed API key
  chatWithTutor: async ({ message, subjectId = 'mathematics', context = {} }) => {
    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          subjectId,
          context
        })
      });

      if (res.status === 429) {
        const errorData = await res.json().catch(() => ({}));
        const err = new Error(errorData.message || 'API rate limit exceeded. Please wait a moment.');
        err.status = 429;
        err.retryAfter = errorData.retryAfter || 30;
        throw err;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      if (!data || !data.reply || typeof data.reply !== 'string' || !data.reply.trim()) {
        throw new Error('Received malformed or empty response from AI tutor');
      }

      return data;
    } catch (e) {
      if (e.status === 429) throw e;
      // Network failure or backend down: fall back to offline pedagogical response
      console.warn('Backend chat unreachable or failed, utilizing local fallback engine:', e.message);
      
      // If network failure, rethrow so the UI can offer a retry affordance
      if (e.name === 'TypeError' || e.message?.includes('fetch') || e.message?.includes('network')) {
        const netErr = new Error('Network failure: unable to reach the AI Tutor server.');
        netErr.isNetwork = true;
        throw netErr;
      }
      throw e;
    }
  },

  // Check if Gemini API key is configured
  getApiKeyStatus: async () => {
    try {
      const res = await fetch(`${API_BASE}/ai/key-status`);
      if (res.ok) return await res.json();
    } catch {}
    return { hasKey: false, model: 'dynamic-pedagogical-engine' };
  },

  // Save/Connect Gemini API key
  setApiKey: async (apiKey) => {
    try {
      const res = await fetch(`${API_BASE}/ai/set-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey })
      });
      if (res.ok) return await res.json();
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to save API key');
    } catch (e) {
      throw e;
    }
  }
};
