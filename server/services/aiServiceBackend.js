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
        console.warn('Gemini chat error, utilizing grounded fallback engine:', err.message);
      }
    }

    // High-fidelity structured fallback adhering strictly to the 3-part specification
    const msg = userMessage.toLowerCase();
    
    if (subjectId === 'science') {
      return {
        reply: `### Core Concept Explanation
In science, physical systems operate under fundamental conservation laws. Think of thermodynamic entropy like an organized bedroom: without deliberate energy and work put in to tidy up, natural chaos and heat dispersion steadily increase over time!

### Step-by-Step Breakdown
1. **Define the System & Surroundings**: Clearly isolate the boundaries where energy exchange occurs.
2. **Track Energy Transfer**: Apply the First Law: $\\Delta U = Q - W$, measuring heat absorbed ($Q$) and work done ($W$).
3. **Assess Equilibrium**: Calculate whether the process is spontaneous by determining if Gibbs Free Energy $\\Delta G = \\Delta H - T\\Delta S < 0$.

### Concept Check
If a chemical reaction absorbs heat from its surroundings ($Q > 0$) while becoming more disordered ($\\Delta S > 0$), what happens to spontaneity at high temperatures?`,
        model: 'offline-grounded-engine',
        subjectId: 'science'
      };
    }

    if (subjectId === 'english') {
      return {
        reply: `### Core Concept Explanation
In analytical writing, constructing an argument is like building a suspension bridge: your thesis statement is the central roadway, and your topic sentences and textual citations are the reinforced steel cables holding it steady against opposing counterarguments.

### Step-by-Step Breakdown
1. **State the Claim**: Formulate an arguable assertion rather than a simple factual statement.
2. **Embed Contextual Evidence**: Integrate a quotation or primary citation seamlessly into your sentence syntax.
3. **Analyze the Rhetorical Mechanism**: Explain *how* the author's diction, syntax, or figurative appeal supports their ultimate purpose.

### Concept Check
Can you identify whether the following is a fact or an arguable claim: *"Shakespeare's Hamlet reflects the existential anxiety of the Renaissance."*?`,
        model: 'offline-grounded-engine',
        subjectId: 'english'
      };
    }

    if (subjectId === 'history') {
      return {
        reply: `### Core Concept Explanation
Studying history is like detective work with multiple eyewitness testimonies. We examine primary documents (letters, treaties, speeches) and evaluate the author's point of view, intended audience, and geopolitical pressures.

### Step-by-Step Breakdown
1. **Contextualize the Event**: Anchor the situation in its precise timeframe and geographical location.
2. **Corroborate Sources**: Compare differing accounts from opposing parties to cross-examine credibility.
3. **Synthesize Causation**: Distinguish between immediate triggers (short-term) and systemic structural roots (long-term).

### Concept Check
What was the primary ideological difference between the Truman Doctrine and George Kennan's original containment telegram?`,
        model: 'offline-grounded-engine',
        subjectId: 'history'
      };
    }

    // Default to Mathematics
    return {
      reply: `### Core Concept Explanation
When solving algebraic relationships or factoring polynomials, think of the algebraic equation like a perfectly balanced kitchen scale. Whatever operation you apply to one side, you must apply to the other to keep balance intact! Factoring is simply un-multiplying—finding the common ingredient every term shares and pulling it out front.

### Step-by-Step Breakdown
1. **Identify Common Factors (GCF)**: Check coefficients and variable powers to extract the largest shared component.
2. **Recognize Structural Patterns**: Look for difference of squares ($a^2 - b^2 = (a-b)(a+b)$) or quadratic trinomials ($ax^2 + bx + c$).
3. **Verify by Distribution**: Multiply back through (FOIL) to ensure you reproduce the starting expression precisely.

### Concept Check
If you factor $2x^2 + 8x$, what is the greatest common factor (GCF) that you pull outside the parentheses?`,
      model: 'offline-grounded-engine',
      subjectId: 'mathematics'
    };
  }
};
