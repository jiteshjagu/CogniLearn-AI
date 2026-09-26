import { useState, useCallback, useRef } from 'react';
import { ApiClient } from '../services/apiClient';
import { getSubjectById } from '../data/subjectRegistry';

/**
 * Custom Hook: useGeminiChat
 * Encapsulates Gemini API communication, subject grounding, validation, and error states.
 */
export const useGeminiChat = ({ student, initialSubjectId = 'mathematics' }) => {
  const [activeSubjectId, setActiveSubjectId] = useState(initialSubjectId);
  const [messages, setMessages] = useState(() => {
    const studentName = student?.name?.split(' ')[0] || 'there';
    const subject = getSubjectById(initialSubjectId);
    return [
      {
        id: 'msg_welcome',
        role: 'assistant',
        text: `### Core Concept Explanation
Hello ${studentName}! 👋 I am your CogniAI Academic Tutor. I specialize in breaking down complex topics in **${subject.label}** using everyday analogies and step-by-step logic.

### Step-by-Step Breakdown
1. Ask any question about a homework problem, formula, or concept.
2. I'll explain the intuition, work through a resolution, and give you a quick check question.
3. Switch subjects anytime using the tabs above!

### Concept Check
What topic in ${subject.label} would you like to explore first?`,
        subjectId: initialSubjectId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [apiError, setApiError] = useState(null); // { type, message, retryAfter, lastQuery }
  const lastQueryRef = useRef('');

  const clearErrors = useCallback(() => {
    setValidationError('');
    setApiError(null);
  }, []);

  /**
   * Sends user query with client-side validation and comprehensive error handling
   */
  const sendMessage = useCallback(async (customText = null) => {
    const textToSend = customText !== null ? customText : inputVal;

    // 1. Client-side validation: Block empty or whitespace-only input
    if (!textToSend || !textToSend.trim()) {
      setValidationError('Please enter a question or topic before sending.');
      return false;
    }

    const trimmedQuery = textToSend.trim();
    clearErrors();
    lastQueryRef.current = trimmedQuery;

    // 2. Optimistic user message append
    const userMsg = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: trimmedQuery,
      subjectId: activeSubjectId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      // 3. Call backend API (Gemini-1.5-flash via GEMINI_API_KEY)
      const response = await ApiClient.chatWithTutor({
        message: trimmedQuery,
        subjectId: activeSubjectId,
        context: {
          studentName: student?.name,
          studentId: student?.id,
          mastery: student?.overallMastery || 60,
          currentConcept: student?.rootPrerequisiteBottleneck || 'c4'
        }
      });

      // 4. Validate model response (prevent blank bubble or crash)
      const replyText = response?.reply?.trim();
      if (!replyText) {
        throw new Error('Received an empty response from the AI tutor.');
      }

      const assistantMsg = {
        id: `asst_${Date.now()}`,
        role: 'assistant',
        text: replyText,
        subjectId: activeSubjectId,
        model: response.model || 'gemini-1.5-flash',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
      return true;

    } catch (err) {
      console.error('Chat hook error:', err);

      if (err.status === 429) {
        // Rate limit reached
        setApiError({
          type: 'rate-limit',
          message: err.message || 'AI Tutor rate limit reached. Please wait a few seconds.',
          retryAfter: err.retryAfter || 30,
          lastQuery: trimmedQuery
        });
      } else if (err.isNetwork) {
        // Network / timeout failure: preserve user input affordance
        setApiError({
          type: 'network',
          message: 'Network connection error. Unable to reach the tutoring service.',
          lastQuery: trimmedQuery
        });
      } else {
        // Malformed or general error
        setApiError({
          type: 'malformed',
          message: err.message || 'Unable to generate response. Please try again.',
          lastQuery: trimmedQuery
        });
      }

      // Do NOT lose the user's typed message in case they want to edit
      setInputVal(trimmedQuery);
      return false;

    } finally {
      setIsTyping(false);
    }
  }, [inputVal, activeSubjectId, student, clearErrors]);

  /**
   * Retry failed message without losing query
   */
  const retryLastMessage = useCallback(() => {
    if (lastQueryRef.current) {
      sendMessage(lastQueryRef.current);
    }
  }, [sendMessage]);

  /**
   * Switches active subject grounding and posts a contextual notice
   */
  const changeSubject = useCallback((newSubjectId) => {
    setActiveSubjectId(newSubjectId);
    clearErrors();
    const subject = getSubjectById(newSubjectId);
    setMessages(prev => [
      ...prev,
      {
        id: `sys_${Date.now()}`,
        role: 'system',
        text: `Switched active subject to **${subject.label}**. All explanations and concept checks are now grounded in ${subject.description}.`,
        subjectId: newSubjectId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [clearErrors]);

  return {
    messages,
    inputVal,
    setInputVal,
    isTyping,
    validationError,
    apiError,
    activeSubjectId,
    changeSubject,
    sendMessage,
    retryLastMessage,
    clearErrors
  };
};
