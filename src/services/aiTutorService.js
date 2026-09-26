// AI Learning Support Service (Gemini API Integration + Offline Pedagogical Knowledge Engine)

import { CONCEPTS, CONCEPT_LESSONS } from '../data/conceptsData';
import { StorageService } from './storageService';

export const AiTutorService = {
  /**
   * Generates a pedagogical explanation for a concept tailored to user style
   */
  explainConcept: async (conceptId, style = 'standard') => {
    const concept = CONCEPTS[conceptId];
    const lesson = CONCEPT_LESSONS[conceptId];
    const apiKey = StorageService.getApiKey();

    if (apiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are an expert adaptive mathematics tutor. Explain the concept "${concept.name}" (${concept.category}) to a student.
                Style required: ${style === 'eli5' ? 'Explain like I am 10 years old with vivid everyday analogies' : 'Clear, structured educational guide with intuition, formula, and step-by-step example'}.
                Keep it concise (under 250 words), engaging, and encouraging.`
              }]
            }]
          })
        });
        const data = await response.json();
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local pedagogical engine:', err);
      }
    }

    // High quality offline fallback
    if (style === 'eli5') {
      return `Think of ${concept.name} like packing a backpack!
      
Imagine you have different items: apples, oranges, and books. You can't say "I have 3 apple-books" – you group the apples with apples, and the books with books! In algebra, numbers with x² stay together, and plain numbers stay together. 
When we factor, we are simply finding what secret ingredient was distributed to everyone in the room and pulling it outside the front door!`;
    }

    return `${lesson?.explanation || concept.description}

Key Intuition:
${(lesson?.keyTakeaways || []).map(k => `• ${k}`).join('\n')}

Pro-Tip:
Always verify your answer by expanding or substituting test values back into the original expression!`;
  },

  /**
   * Analyzes student mistake and provides personalized remedial feedback
   */
  explainMistake: async (questionObj, chosenOption, correctOption, studentConceptMastery = 50) => {
    const concept = CONCEPTS[questionObj.conceptId];
    const apiKey = StorageService.getApiKey();

    if (apiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are an adaptive AI learning mentor. A student answered this question incorrectly:
                Concept: ${concept?.name || 'Algebra'}
                Question: ${questionObj.question}
                Student chosen answer: "${chosenOption}"
                Correct answer: "${correctOption}"
                Detailed explanation: "${questionObj.explanation}"
                
                Provide a 3-part diagnostic response:
                1. "Cognitive Trap": Why someone might pick that wrong answer (e.g. sign error, missed GCF).
                2. "Core Rule": The fundamental law to apply.
                3. "Quick Fix Action": One sentence actionable rule to never repeat this mistake.`
              }]
            }]
          })
        });
        const data = await response.json();
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }
      } catch (err) {
        console.warn('Gemini API call error:', err);
      }
    }

    // Smart Local Heuristic Breakdown
    return `### Cognitive Analysis: Why this happened
You selected "${chosenOption}", whereas the correct solution is "${correctOption}".

**The Misconception Trap:**
In ${concept?.name || 'this topic'}, a frequent stumbling block is reversing algebraic signs or partially factoring terms without checking whether every term still contains a common factor.

**The Golden Rule:**
${questionObj.explanation || 'Always check that what you distribute reproduces the initial terms exactly.'}

**Mentor Recommendation:**
Review the prerequisite concept: **${concept?.prerequisites?.[0] ? CONCEPTS[concept.prerequisites[0]]?.name : 'Foundational Operations'}** before attempting hard-tier problems.`;
  },

  /**
   * Interactive AI tutor dialog response
   */
  askTutor: async (userMessage, context = {}) => {
    const apiKey = StorageService.getApiKey();

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
                - Gaps: ${JSON.stringify(context.gaps || [])}
                
                Student says: "${userMessage}"
                
                Respond in a friendly, encouraging pedagogical tone. Break mathematical steps down clearly. Use bullet points and markdown.`
              }]
            }]
          })
        });
        const data = await response.json();
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }
      } catch (err) {
        console.warn('Gemini chat error, fallback to offline tutor:', err);
      }
    }

    // Contextual local responses
    const msg = userMessage.toLowerCase();
    if (msg.includes('help') || msg.includes('how to start') || msg.includes('stuck')) {
      return `Don't worry, being stuck is the first sign your brain is building new neural connections! 💡
      
Here is the 3-step strategy to unlock this problem:
1. **Identify the Given Information**: Write down what variables and constants are explicitly provided.
2. **Locate the Target**: What single quantity or expression are you asked to isolate?
3. **Work in Reverse**: Apply inverse operations (if it's added, subtract it; if multiplied, divide it).
      
Would you like me to guide you through this step-by-step without giving away the final answer?`;
    }

    if (msg.includes('formula') || msg.includes('equation')) {
      return `Here are the foundational formulas for this unit:
      
• **Linear Isolation**: $ax + b = c \\implies x = \\frac{c - b}{a}$
• **Difference of Squares**: $a^2 - b^2 = (a - b)(a + b)$
• **Quadratic Formula**: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$
• **Discriminant**: $\\Delta = b^2 - 4ac$ (determines number and nature of roots).
      
Which of these would you like to explore with a worked example?`;
    }

    if (msg.includes('example') || msg.includes('practice')) {
      return `Here is a custom guided example just for you! 🎯
      
**Problem**: Factor $x^2 - 6x + 8 = 0$
1. We need two numbers that **multiply to 8** and **add to -6**.
2. Look at factor pairs of 8:
   - $1 \\times 8$ (sum = 9)
   - $2 \\times 4$ (sum = 6)
   - $(-2) \\times (-4)$ (sum = -6) ✅ Bingo!
3. Write as factored binomials: $(x - 2)(x - 4) = 0$.
4. Setting each equal to zero yields roots $x = 2$ and $x = 4$.
      
Try testing $(x - 3)(x - 2)$ yourself and see what you get!`;
    }

    return `Great question! When dealing with **${context.currentConcept || 'algebraic concepts'}**, the most reliable approach is to connect it back to what you already master.
    
Remember:
- Check your arithmetic signs first (over 60% of algebra errors are negative-sign slips!).
- Whenever you factor an expression, mentally re-multiply it to verify you arrive back at the starting formula.
    
Is there a specific part of the current question that feels ambiguous? I'm right here with you! 🚀`;
  }
};
