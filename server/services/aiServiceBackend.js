// Server-Side AI Pedagogical Tutor Service

import { CONCEPTS, CONCEPT_LESSONS } from '../../src/data/conceptsData.js';

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

    if (apiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are CogniAI, an empathetic and brilliant adaptive learning tutor.
                Student Context:
                - Active Concept: ${context.currentConcept || 'Algebra'}
                - Current Mastery: ${context.mastery || '50'}%
                
                Student says: "${userMessage}"
                
                Respond in an encouraging pedagogical tone with markdown.`
              }]
            }]
          })
        });
        const data = await response.json();
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }
      } catch (err) {
        console.warn('Gemini chat error:', err.message);
      }
    }

    const msg = userMessage.toLowerCase();
    if (msg.includes('help') || msg.includes('stuck')) {
      return `Don't worry, being stuck is the first sign your brain is building new neural connections! 💡
      
Here is the 3-step strategy to unlock this problem:
1. **Identify the Given Information**: Write down what variables and constants are explicitly provided.
2. **Locate the Target**: What single quantity or expression are you asked to isolate?
3. **Work in Reverse**: Apply inverse operations.
      
Would you like me to guide you through this step-by-step?`;
    }

    return `Great question! When dealing with **${context.currentConcept || 'algebraic concepts'}**, the most reliable approach is to connect it back to what you already master.
    
Check your arithmetic signs first, and re-multiply factored expressions to verify accuracy!`;
  }
};
