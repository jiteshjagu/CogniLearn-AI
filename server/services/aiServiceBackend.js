// Server-Side AI Pedagogical Tutor Service

import { CONCEPTS, CONCEPT_LESSONS } from '../../src/data/conceptsData.js';
import { DynamicTutorEngine } from './dynamicTutorEngine.js';

export const AiServiceBackend = {
  explainConcept: async (conceptId, style = 'standard', customApiKey = null) => {
    const concept = CONCEPTS[conceptId];
    const lesson = CONCEPT_LESSONS[conceptId];
    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are an expert adaptive mathematics tutor. Explain "${concept?.name}" to a student.
                Style: ${style === 'eli5' ? 'Explain like I am 10 with clear everyday analogies' : 'Structured guide with intuition, formula, and step-by-step example'}.
                Under 250 words.`
              }]
            }]
          })
        });
        const data = await response.json();
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }
      } catch (err) {
        console.warn('Backend Gemini API error, using local pedagogical engine:', err.message);
      }
    }

    if (style === 'eli5') {
      return `Think of ${concept?.name} like packing a backpack!
      
Imagine you have different items: apples, oranges, and books. You can't say "I have 3 apple-books" – you group apples with apples, and books with books! In algebra, numbers with x² stay together, and plain numbers stay together. 
When we factor, we are finding what common item everyone in the room has and pulling it outside the front door!`;
    }

    return `${lesson?.explanation || concept?.description}

Key Takeaways:
${(lesson?.keyTakeaways || []).map(k => `• ${k}`).join('\n')}`;
  },

  explainMistake: async (questionObj, chosenOption, correctOption, customApiKey = null) => {
    const concept = CONCEPTS[questionObj.conceptId];
    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are an adaptive AI learning mentor. A student answered this question incorrectly:
                Concept: ${concept?.name}
                Question: ${questionObj.question}
                Student chosen answer: "${chosenOption}"
                Correct answer: "${correctOption}"
                Detailed explanation: "${questionObj.explanation}"
                
                Provide:
                1. Cognitive Trap (why someone might pick that wrong answer).
                2. Core Rule.
                3. Quick Action tip.`
              }]
            }]
          })
        });
        const data = await response.json();
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }
      } catch (err) {
        console.warn('Gemini API call error:', err.message);
      }
    }

    return `### Cognitive Analysis: Why this happened
You selected "${chosenOption}", whereas the correct solution is "${correctOption}".

**The Misconception Trap:**
In ${concept?.name || 'this topic'}, a frequent stumbling block is reversing algebraic signs or partially factoring terms without checking whether every term still contains a common factor.

**The Golden Rule:**
${questionObj.explanation || 'Always check that what you distribute reproduces the initial terms exactly.'}

**Mentor Recommendation:**
Review the prerequisite concept: **${concept?.prerequisites?.[0] ? CONCEPTS[concept.prerequisites[0]]?.name : 'Foundational Operations'}** before attempting hard-tier problems.`;
  },

  chat: async (userMessage, context = {}, customApiKey = null) => {
    const apiKey = customApiKey || process.env.GEMINI_API_KEY;
    const subjectId = context.subjectId || 'mathematics';
    const subjectNames = {
      mathematics: 'Mathematics (Algebra, Functions & Geometry)',
      science: 'Science (Thermodynamics, Biology & Physics)',
      english: 'English (Rhetoric, Grammar & Literary Analysis)',
      history: 'History (World Civilizations & Historiography)'
    };
    const activeSubjectName = subjectNames[subjectId] || 'Mathematics';

    const systemPrompt = `You are CogniAI, an expert adaptive academic tutor specialized in ${activeSubjectName}.
You are guiding a student whose active subject is ${activeSubjectName}.
Active topic/concept: ${context.currentConcept || context.subtopic || 'Core Foundations'}.
Student Competency: ${context.mastery || 60}% mastery.

CRITICAL INSTRUCTION - You MUST structure EVERY substantive response using this exact 3-part layout:

### Core Concept Explanation
Explain the core idea in plain, accessible language and provide a vivid, relatable real-world analogy.

### Step-by-Step Breakdown
Provide a numbered resolution (1., 2., 3., etc.) detailing the problem-solving logic, mathematical mechanics, or analytical workflow.

### Concept Check
Conclude with exactly ONE targeted, diagnostic follow-up question to test whether the student understood the concept.`;

    if (apiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: systemPrompt },
                  { text: `Student query: "${userMessage}"` }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 800
            }
          })
        });

        if (response.status === 429) {
          const retryHeader = response.headers.get('retry-after');
          const err = new Error('Gemini API rate limit exceeded (429)');
          err.status = 429;
          err.retryAfter = retryHeader ? parseInt(retryHeader, 10) : 30;
          throw err;
        }

        if (!response.ok) {
          const errBody = await response.text();
          console.warn(`Gemini API returned status ${response.status}:`, errBody);
        } else {
          const data = await response.json();
          const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText && candidateText.trim()) {
            return {
              reply: candidateText.trim(),
              model: 'gemini-1.5-flash',
              subjectId
            };
          }
        }
      } catch (err) {
        if (err.status === 429) throw err;
        console.warn('Gemini chat error, utilizing dynamic pedagogical engine:', err.message);
      }
    }

    // Dynamic, question-specific pedagogical engine
    return DynamicTutorEngine.generateResponse(userMessage, subjectId, context);
  }
};
