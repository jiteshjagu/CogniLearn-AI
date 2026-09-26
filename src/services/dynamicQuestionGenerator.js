// Dynamic Question Generator Engine: AI-Powered (Gemini) + Algorithmic Procedural Math Engine

import { CONCEPTS } from '../data/conceptsData.js';

// Helper to shuffle options while preserving the correct index
const shuffleOptions = (optionsWithCorrectness) => {
  const shuffled = [...optionsWithCorrectness];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const options = shuffled.map(o => o.text);
  const correctIndex = shuffled.findIndex(o => o.isCorrect);
  return { options, correctIndex };
};

// Random integer between min and max inclusive
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const nonZeroRandInt = (min, max) => {
  let val = 0;
  while (val === 0) val = randInt(min, max);
  return val;
};

export const DynamicQuestionGenerator = {
  /**
   * Generates mathematically sound procedural questions with authentic distractors
   */
  generateProceduralQuestion: (conceptId, difficulty = 'medium') => {
    const timestamp = Date.now();
    const randSuffix = Math.random().toString(36).substring(2, 6);
    const qId = `dyn_proc_${conceptId}_${difficulty}_${timestamp}_${randSuffix}`;

    switch (conceptId) {
      case 'c1': { // Arithmetic & Pre-Algebra Operations
        if (difficulty === 'easy') {
          const a = randInt(12, 45);
          const b = randInt(5, 20);
          const c = randInt(2, 9);
          const ans = a - b * c;
          const distractors = [
            (a - b) * c, // Order of operations mistake
            a + b * c,   // Sign error
            a - (b + c)  // Addition instead of multiplication
          ];
          const rawOpts = [
            { text: `${ans}`, isCorrect: true },
            { text: `${distractors[0]}`, isCorrect: false },
            { text: `${distractors[1]}`, isCorrect: false },
            { text: `${distractors[2]}`, isCorrect: false }
          ];
          const { options, correctIndex } = shuffleOptions(rawOpts);
          return {
            id: qId,
            conceptId: 'c1',
            difficulty: 'easy',
            question: `Evaluate using the proper order of operations (PEMDAS): ${a} - ${b} × ${c}`,
            options,
            correctIndex,
            explanation: `Multiplication takes precedence over subtraction: ${b} × ${c} = ${b * c}. Then, ${a} - ${b * c} = ${ans}.`,
            misconceptionAnalysis: `A common error is computing (${a} - ${b}) first (${a - b}) and multiplying by ${c} to get ${distractors[0]}, violating PEMDAS.`,
            hint: 'Remember: Multiplication and division must be performed before addition and subtraction.',
            isDynamic: true,
            source: 'Procedural-Math-Engine'
          };
        } else if (difficulty === 'medium') {
          const a = nonZeroRandInt(-15, -4);
          const b = randInt(3, 9);
          const c = nonZeroRandInt(-8, -2);
          const ans = a * b - c;
          const rawOpts = [
            { text: `${ans}`, isCorrect: true },
            { text: `${a * b + c}`, isCorrect: false }, // Double negative error
            { text: `${-a * b - c}`, isCorrect: false }, // Sign slip in product
            { text: `${(a * b) * c}`, isCorrect: false }
          ];
          const { options, correctIndex } = shuffleOptions(rawOpts);
          return {
            id: qId,
            conceptId: 'c1',
            difficulty: 'medium',
            question: `Simplify the integer expression with signed values: (${a}) × (${b}) - (${c})`,
            options,
            correctIndex,
            explanation: `First, multiply (${a}) × (${b}) = ${a * b}. Next, subtract negative ${c}: ${a * b} - (${c}) = ${a * b} + ${Math.abs(c)} = ${ans}.`,
            misconceptionAnalysis: 'Subtracting a negative number is equivalent to adding its positive counterpart. Failing to flip the sign yields a negative offset error.',
            hint: 'Subtracting a negative number turns into addition: a - (-b) = a + b.',
            isDynamic: true,
            source: 'Procedural-Math-Engine'
          };
        } else { // Hard
          const n1 = randInt(2, 6);
          const d1 = randInt(3, 7);
          const n2 = randInt(1, 4);
          const d2 = randInt(2, 5);
          // n1/d1 / n2/d2 = (n1*d2)/(d1*n2)
          const num = n1 * d2;
          const den = d1 * n2;
          const rawOpts = [
            { text: `${num}/${den}`, isCorrect: true },
            { text: `${n1 * n2}/${d1 * d2}`, isCorrect: false }, // Multiplied directly without reciprocal
            { text: `${d1 * n2}/${n1 * d2}`, isCorrect: false }, // Inverted wrong fraction
            { text: `${num + 1}/${den}`, isCorrect: false }
          ];
          const { options, correctIndex } = shuffleOptions(rawOpts);
          return {
            id: qId,
            conceptId: 'c1',
            difficulty: 'hard',
            question: `Divide the rational fractions: (${n1}/${d1}) ÷ (${n2}/${d2})`,
            options,
            correctIndex,
            explanation: `To divide by a fraction, multiply by its reciprocal: (${n1}/${d1}) × (${d2}/${n2}) = (${n1} × ${d2}) / (${d1} × ${n2}) = ${num}/${den}.`,
            misconceptionAnalysis: 'Students often multiply fractions straight across without flipping the divisor, yielding incorrect direct products.',
            hint: 'Keep, Change, Flip: Keep the first fraction, change division to multiplication, flip the second fraction.',
            isDynamic: true,
            source: 'Procedural-Math-Engine'
          };
        }
      }

      case 'c2': { // Linear Equations & Inequalities
        if (difficulty === 'easy') {
          const a = randInt(2, 7);
          const x = randInt(2, 8);
          const b = randInt(3, 15);
          const c = a * x + b;
          const rawOpts = [
            { text: `x = ${x}`, isCorrect: true },
            { text: `x = ${x + 2}`, isCorrect: false },
            { text: `x = ${Math.round((c + b) / a)}`, isCorrect: false }, // Added b instead of subtracting
            { text: `x = ${x - 1}`, isCorrect: false }
          ];
          const { options, correctIndex } = shuffleOptions(rawOpts);
          return {
            id: qId,
            conceptId: 'c2',
            difficulty: 'easy',
            question: `Solve the one-variable linear equation for x: ${a}x + ${b} = ${c}`,
            options,
            correctIndex,
            explanation: `Subtract ${b} from both sides: ${a}x = ${c - b}. Then divide by ${a}: x = ${c - b}/${a} = ${x}.`,
            misconceptionAnalysis: 'Adding the constant to both sides instead of applying the inverse operation (subtraction) is a frequent error.',
            hint: 'Isolate the variable term first by subtracting the constant from both sides.',
            isDynamic: true,
            source: 'Procedural-Math-Engine'
          };
        } else if (difficulty === 'medium') {
          const a = randInt(3, 8);
          const b = randInt(2, 6);
          const c = randInt(1, a - 1);
          const x = randInt(2, 7);
          // a*x - b = c*x + d => (a - c)*x = d + b
          const d = (a - c) * x - b;
          const rawOpts = [
            { text: `x = ${x}`, isCorrect: true },
            { text: `x = ${-x}`, isCorrect: false },
            { text: `x = ${x + 1}`, isCorrect: false },
            { text: `x = ${Math.abs(d - b)}`, isCorrect: false }
          ];
          const { options, correctIndex } = shuffleOptions(rawOpts);
          return {
            id: qId,
            conceptId: 'c2',
            difficulty: 'medium',
            question: `Solve for x with variables on both sides: ${a}x - ${b} = ${c}x + ${d}`,
            options,
            correctIndex,
            explanation: `Subtract ${c}x from both sides: ${a - c}x - ${b} = ${d}. Add ${b} to both sides: ${a - c}x = ${d + b}. Divide by ${a - c}: x = ${x}.`,
            misconceptionAnalysis: 'Combining like terms across the equals sign without reversing their signs causes coefficient inversion.',
            hint: 'Gather all variable terms on one side and all constant terms on the other side.',
            isDynamic: true,
            source: 'Procedural-Math-Engine'
          };
        } else { // Hard (Inequality with negative division)
          const k = randInt(2, 5);
          const a = -k;
          const b = randInt(4, 12);
          const target = randInt(10, 30);
          // -k * x + b <= target
          // -k * x <= target - b
          // x >= (target - b)/(-k)
          const bound = Math.round((target - b) / a);
          const rawOpts = [
            { text: `x ≥ ${bound}`, isCorrect: true },
            { text: `x ≤ ${bound}`, isCorrect: false }, // Forgot to flip inequality sign
            { text: `x > ${bound}`, isCorrect: false },
            { text: `x < ${-bound}`, isCorrect: false }
          ];
          const { options, correctIndex } = shuffleOptions(rawOpts);
          return {
            id: qId,
            conceptId: 'c2',
            difficulty: 'hard',
            question: `Solve the linear inequality and identify the correct solution set: ${a}x + ${b} ≤ ${target}`,
            options,
            correctIndex,
            explanation: `Subtract ${b} from both sides: ${a}x ≤ ${target - b}. When dividing both sides by the negative coefficient (${a}), you MUST reverse the inequality direction: x ≥ ${bound}.`,
            misconceptionAnalysis: 'Neglecting to reverse the direction of the inequality when dividing or multiplying by a negative number is a classic trap.',
            hint: 'CRITICAL RULE: Whenever you divide or multiply an inequality by a negative number, flip the sign (≤ becomes ≥).',
            isDynamic: true,
            source: 'Procedural-Math-Engine'
          };
        }
      }

      case 'c3': { // Polynomial Operations
        const a = randInt(2, 5);
        const b = nonZeroRandInt(-6, 6);
        const c = randInt(1, 4);
        const d = nonZeroRandInt(-5, 5);

        if (difficulty === 'easy') {
          // Addition of polynomials
          const p1 = `${a}x² + ${Math.abs(b)}x - 4`;
          const p2 = `${c}x² - 2x + 7`;
          const sumA = a + c;
          const sumB = b - 2;
          const sumC = -4 + 7;
          const correctText = `${sumA}x² ${sumB >= 0 ? '+' : '-'} ${Math.abs(sumB)}x + ${sumC}`;
          const rawOpts = [
            { text: correctText, isCorrect: true },
            { text: `${sumA}x⁴ + ${sumB}x² + ${sumC}`, isCorrect: false }, // Adding exponents
            { text: `${a * c}x² + ${sumB}x + ${sumC}`, isCorrect: false },
            { text: `${sumA}x² - ${sumB}x - ${sumC}`, isCorrect: false }
          ];
          const { options, correctIndex } = shuffleOptions(rawOpts);
          return {
            id: qId,
            conceptId: 'c3',
            difficulty: 'easy',
            question: `Add the polynomials: (${p1}) + (${p2})`,
            options,
            correctIndex,
            explanation: `Combine like terms: (${a} + ${c})x² = ${sumA}x², (${b} - 2)x = ${sumB}x, and (-4 + 7) = ${sumC}. Exponents never change when adding like terms.`,
            misconceptionAnalysis: 'Adding exponents during polynomial addition (e.g. x² + x² = x⁴) confuses addition with exponent multiplication laws.',
            hint: 'Only add the coefficients of terms having identical variables and exponents.',
            isDynamic: true,
            source: 'Procedural-Math-Engine'
          };
        } else {
          // FOIL Multiplication
          const coefX2 = a * c;
          const coefX = a * d + b * c;
          const constTerm = b * d;
          const sign1 = b >= 0 ? '+' : '-';
          const sign2 = d >= 0 ? '+' : '-';
          const signMid = coefX >= 0 ? '+' : '-';
          const signConst = constTerm >= 0 ? '+' : '-';
          const correctText = `${coefX2}x² ${signMid} ${Math.abs(coefX)}x ${signConst} ${Math.abs(constTerm)}`;
          const distractor1 = `${coefX2}x² ${signConst} ${Math.abs(constTerm)}`; // Forgot outer and inner terms
          const distractor2 = `${coefX2}x² ${signMid === '+' ? '-' : '+'} ${Math.abs(coefX)}x ${signConst} ${Math.abs(constTerm)}`;
          const distractor3 = `${coefX2 + 1}x² + ${coefX}x + ${constTerm}`;

          const rawOpts = [
            { text: correctText, isCorrect: true },
            { text: distractor1, isCorrect: false },
            { text: distractor2, isCorrect: false },
            { text: distractor3, isCorrect: false }
          ];
          const { options, correctIndex } = shuffleOptions(rawOpts);
          return {
            id: qId,
            conceptId: 'c3',
            difficulty: difficulty === 'medium' ? 'medium' : 'hard',
            question: `Expand and simplify using FOIL: (${a}x ${sign1} ${Math.abs(b)})(${c}x ${sign2} ${Math.abs(d)})`,
            options,
            correctIndex,
            explanation: `FOIL: First = (${a}x)(${c}x) = ${coefX2}x²; Outer = (${a}x)(${d}) = ${a * d}x; Inner = (${b})(${c}x) = ${b * c}x; Last = (${b})(${d}) = ${constTerm}. Summing Outer + Inner gives ${coefX}x. Result: ${correctText}.`,
            misconceptionAnalysis: 'Only squaring or multiplying first and last terms (forgetting the cross terms Outer and Inner) is a very frequent blunder.',
            hint: 'Use the FOIL mnemonic: First, Outer, Inner, Last.',
            isDynamic: true,
            source: 'Procedural-Math-Engine'
          };
        }
      }

      case 'c4': { // Factoring Polynomials (Root Bottleneck concept!)
        if (difficulty === 'easy') {
          // Greatest Common Factor (GCF)
          const gcf = randInt(3, 7);
          const p = randInt(2, 5);
          const q = randInt(1, 6);
          const expr = `${gcf * p}x² + ${gcf * q}x`;
          const correctText = `${gcf}x(${p}x + ${q})`;
          const rawOpts = [
            { text: correctText, isCorrect: true },
            { text: `${gcf}(${p}x² + ${q}x)`, isCorrect: false }, // Left variable inside
            { text: `x(${gcf * p}x + ${gcf * q})`, isCorrect: false }, // Left numeric GCF
            { text: `${gcf * p}x(x + ${q})`, isCorrect: false }
          ];
          const { options, correctIndex } = shuffleOptions(rawOpts);
          return {
            id: qId,
            conceptId: 'c4',
            difficulty: 'easy',
            question: `Factor out the greatest common factor (GCF) completely: ${expr}`,
            options,
            correctIndex,
            explanation: `The GCF of coefficients ${gcf * p} and ${gcf * q} is ${gcf}. The GCF of x² and x is x. Factoring ${gcf}x yields ${gcf}x(${p}x + ${q}).`,
            misconceptionAnalysis: 'Partially factoring by only extracting the numeric coefficient or only the variable leaves un-factored common factors.',
            hint: 'Extract the highest common integer divisor AND the lowest power of x present in all terms.',
            isDynamic: true,
            source: 'Procedural-Math-Engine'
          };
        } else if (difficulty === 'medium') {
          // Trinomial Factoring: x^2 + bx + c
          const r1 = randInt(2, 7);
          const r2 = nonZeroRandInt(-7, -1);
          // (x - r1)(x - r2) = x^2 - (r1+r2)x + r1*r2
          // Let's use roots p and q: (x + p)(x + q)
          const p = nonZeroRandInt(-7, 7);
          let q = nonZeroRandInt(-7, 7);
          if (p === -q) q = p + 2; // avoid difference of squares here
          const bCoeff = p + q;
          const cTerm = p * q;
          const signB = bCoeff >= 0 ? '+' : '-';
          const signC = cTerm >= 0 ? '+' : '-';
          const expr = `x² ${signB} ${Math.abs(bCoeff)}x ${signC} ${Math.abs(cTerm)}`;

          const signP = p >= 0 ? '+' : '-';
          const signQ = q >= 0 ? '+' : '-';
          const correctText = `(x ${signP} ${Math.abs(p)})(x ${signQ} ${Math.abs(q)})`;
          // Distractor 1: Sign reversal
          const distractor1 = `(x ${p >= 0 ? '-' : '+'} ${Math.abs(p)})(x ${q >= 0 ? '-' : '+'} ${Math.abs(q)})`;
          // Distractor 2: Swapped signs
          const distractor2 = `(x ${signP} ${Math.abs(p)})(x ${q >= 0 ? '-' : '+'} ${Math.abs(q)})`;
          const distractor3 = `(x + ${Math.abs(cTerm)})(x - 1)`;

          const rawOpts = [
            { text: correctText, isCorrect: true },
            { text: distractor1, isCorrect: false },
            { text: distractor2, isCorrect: false },
            { text: distractor3, isCorrect: false }
          ];
          const { options, correctIndex } = shuffleOptions(rawOpts);
          return {
            id: qId,
            conceptId: 'c4',
            difficulty: 'medium',
            question: `Factor the quadratic trinomial completely: ${expr}`,
            options,
            correctIndex,
            explanation: `We seek two numbers that multiply to ${cTerm} and add to ${bCoeff}. Those numbers are ${p} and ${q} since (${p}) × (${q}) = ${cTerm} and (${p}) + (${q}) = ${bCoeff}. Thus: ${correctText}.`,
            misconceptionAnalysis: 'Reversing the positive and negative signs of the factors is the primary root bottleneck in trinomial factoring.',
            hint: `Find two numbers whose product is ${cTerm} and whose sum is ${bCoeff}. Check your signs carefully!`,
            isDynamic: true,
            source: 'Procedural-Math-Engine'
          };
        } else {
          // Hard: Difference of Squares with coefficients
          const a = randInt(2, 6);
          const b = randInt(3, 9);
          const a2 = a * a;
          const b2 = b * b;
          const expr = `${a2}x² - ${b2}`;
          const correctText = `(${a}x - ${b})(${a}x + ${b})`;
          const rawOpts = [
            { text: correctText, isCorrect: true },
            { text: `(${a}x - ${b})²`, isCorrect: false }, // Squared binomial error
            { text: `(${a2}x - 1)(x + ${b2})`, isCorrect: false },
            { text: `(${a}x + ${b})²`, isCorrect: false }
          ];
          const { options, correctIndex } = shuffleOptions(rawOpts);
          return {
            id: qId,
            conceptId: 'c4',
            difficulty: 'hard',
            question: `Factor using the difference of squares identity: ${expr}`,
            options,
            correctIndex,
            explanation: `Recognize ${a2}x² as (${a}x)² and ${b2} as (${b})². The difference of squares identity a² - b² = (a - b)(a + b) yields ${correctText}.`,
            misconceptionAnalysis: 'Confusing (a - b)(a + b) with the square of a binomial (a - b)² is an algebraic trap that fails to eliminate the middle term.',
            hint: 'Use the formula a² - b² = (a - b)(a + b). Take the square root of each term.',
            isDynamic: true,
            source: 'Procedural-Math-Engine'
          };
        }
      }

      case 'c5': { // Quadratic Equations & Roots
        const r1 = randInt(1, 6);
        const r2 = nonZeroRandInt(-6, -1);
        const sum = r1 + r2;
        const prod = r1 * r2;
        const signSum = sum >= 0 ? '-' : '+';
        const signProd = prod >= 0 ? '+' : '-';
        const eqStr = `x² ${signSum} ${Math.abs(sum)}x ${signProd} ${Math.abs(prod)} = 0`;
        const correctText = `x = ${r1}, x = ${r2}`;
        const rawOpts = [
          { text: correctText, isCorrect: true },
          { text: `x = ${-r1}, x = ${-r2}`, isCorrect: false }, // Forgot zero-product sign flip
          { text: `x = ${r1 * 2}, x = ${r2 * 2}`, isCorrect: false },
          { text: `x = ±${Math.abs(prod)}`, isCorrect: false }
        ];
        const { options, correctIndex } = shuffleOptions(rawOpts);
        return {
          id: qId,
          conceptId: 'c5',
          difficulty: difficulty,
          question: `Find all real roots of the quadratic equation: ${eqStr}`,
          options,
          correctIndex,
          explanation: `Factoring yields (x - ${r1})(x - ${r2}) = 0. By the Zero Product Property, x - ${r1} = 0 gives x = ${r1}, and x - ${r2} = 0 gives x = ${r2}.`,
          misconceptionAnalysis: 'Forgetting to flip signs when solving (x - a) = 0 causes students to choose the factors instead of the actual roots.',
          hint: 'Factor the quadratic into (x - r1)(x - r2) = 0, then set each factor equal to zero.',
          isDynamic: true,
          source: 'Procedural-Math-Engine'
        };
      }

      case 'c6': { // Parabolic Graphs & Vertex Forms
        const h = nonZeroRandInt(-5, 5);
        const k = nonZeroRandInt(-7, 7);
        const a = randInt(1, 3) * (randInt(0, 1) === 0 ? 1 : -1);
        const signH = h >= 0 ? '-' : '+';
        const signK = k >= 0 ? '+' : '-';
        const eqStr = `y = ${a === 1 ? '' : a === -1 ? '-' : a}(x ${signH} ${Math.abs(h)})² ${signK} ${Math.abs(k)}`;
        const correctText = `Vertex: (${h}, ${k}), Opens: ${a > 0 ? 'Upward' : 'Downward'}`;
        const rawOpts = [
          { text: correctText, isCorrect: true },
          { text: `Vertex: (${-h}, ${k}), Opens: ${a > 0 ? 'Upward' : 'Downward'}`, isCorrect: false }, // Sign error in h
          { text: `Vertex: (${h}, ${-k}), Opens: ${a > 0 ? 'Downward' : 'Upward'}`, isCorrect: false },
          { text: `Vertex: (${k}, ${h}), Opens: Upward`, isCorrect: false } // Inverted coordinates
        ];
        const { options, correctIndex } = shuffleOptions(rawOpts);
        return {
          id: qId,
          conceptId: 'c6',
          difficulty: difficulty,
          question: `Determine the vertex coordinates and opening direction for the parabola: ${eqStr}`,
          options,
          correctIndex,
          explanation: `The vertex form is y = a(x - h)² + k. Here, h = ${h} and k = ${k}, so the vertex is (${h}, ${k}). Because leading coefficient a = ${a} is ${a > 0 ? 'positive' : 'negative'}, the parabola opens ${a > 0 ? 'upward' : 'downward'}.`,
          misconceptionAnalysis: 'Students frequently neglect that (x - h) means the x-coordinate has the opposite sign of what appears inside the parenthesis.',
          hint: 'In vertex form y = a(x - h)² + k, the vertex is (h, k). Watch the minus sign in front of h!',
          isDynamic: true,
          source: 'Procedural-Math-Engine'
        };
      }

      case 'c7': // Exponential & Radical Expressions
      default: {
        const base = randInt(2, 4);
        const p1 = randInt(2, 4);
        const p2 = randInt(3, 5);
        const expr = `(${base}^${p1})^${p2} ÷ ${base}^${p1 + 2}`;
        const finalExp = (p1 * p2) - (p1 + 2);
        const correctText = `${base}^${finalExp}`;
        const rawOpts = [
          { text: correctText, isCorrect: true },
          { text: `${base}^${(p1 + p2) - (p1 + 2)}`, isCorrect: false }, // Added power-to-power exponents
          { text: `${base}^${p1 * p2 * (p1 + 2)}`, isCorrect: false },
          { text: `${base * 2}^${finalExp}`, isCorrect: false }
        ];
        const { options, correctIndex } = shuffleOptions(rawOpts);
        return {
          id: qId,
          conceptId: 'c7',
          difficulty: difficulty,
          question: `Simplify using exponent rules: ${expr}`,
          options,
          correctIndex,
          explanation: `Power of a power rule: (${base}^${p1})^${p2} = ${base}^(${p1}×${p2}) = ${base}^${p1 * p2}. Quotient rule: ${base}^${p1 * p2} ÷ ${base}^${p1 + 2} = ${base}^(${p1 * p2} - ${p1 + 2}) = ${base}^${finalExp}.`,
          misconceptionAnalysis: 'Adding exponents during a power-of-a-power operation instead of multiplying is the most common exponent error.',
          hint: 'Remember: (x^a)^b = x^(a×b), and x^m ÷ x^n = x^(m-n).',
          isDynamic: true,
          source: 'Procedural-Math-Engine'
        };
      }
    }
  },

  /**
   * Generates a dynamic AI question using Gemini API with strict structured JSON schema
   */
  generateAiQuestion: async (conceptId, difficulty = 'medium', context = {}, customApiKey = null) => {
    const concept = CONCEPTS[conceptId] || CONCEPTS['c4'];
    const apiKey = customApiKey || 
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
      (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || '';

    if (!apiKey) {
      return DynamicQuestionGenerator.generateProceduralQuestion(conceptId, difficulty);
    }

    try {
      const prompt = `You are an expert adaptive mathematics test designer. Generate ONE authentic, creative multiple-choice question for:
Concept: ${concept.name} (${concept.category})
Target Difficulty: ${difficulty.toUpperCase()}
Student Context: ${JSON.stringify(context)}

CRITICAL REQUIREMENTS:
- Output MUST be valid, raw JSON only (no markdown quotes, no triple backticks, no trailing comments).
- Exactly 4 options.
- The 3 distractors MUST target real cognitive traps (such as sign reversal, order of operations, partial factoring).
- Include explanation, hint, and misconceptionAnalysis.

JSON Schema:
{
  "question": "string",
  "options": ["string", "string", "string", "string"],
  "correctIndex": 0,
  "explanation": "string",
  "misconceptionAnalysis": "string",
  "hint": "string"
}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json"
          }
        })
      });

      if (!res.ok) {
        throw new Error(`Gemini API responded with status ${res.status}`);
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Empty Gemini response');

      const parsed = JSON.parse(rawText.trim());
      if (!parsed.question || !Array.isArray(parsed.options) || parsed.options.length !== 4) {
        throw new Error('Malformed schema from Gemini');
      }

      const qId = `dyn_ai_${conceptId}_${difficulty}_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
      return {
        id: qId,
        conceptId,
        difficulty,
        question: parsed.question,
        options: parsed.options,
        correctIndex: typeof parsed.correctIndex === 'number' ? parsed.correctIndex : 0,
        explanation: parsed.explanation || 'Detailed mathematical derivation.',
        misconceptionAnalysis: parsed.misconceptionAnalysis || 'Common distractor trap analyzed.',
        hint: parsed.hint || 'Think about inverse algebraic operations.',
        isDynamic: true,
        source: 'AI-Gemini-Dynamic'
      };
    } catch (err) {
      console.warn('Gemini dynamic question generation failed, falling back to procedural math engine:', err.message);
      return DynamicQuestionGenerator.generateProceduralQuestion(conceptId, difficulty);
    }
  },

  /**
   * Generates a batch of dynamic questions (e.g. for dynamic diagnostic assessment)
   */
  generateBatch: async ({ conceptIds = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'], difficulty = 'medium', apiKey = null }) => {
    const promises = conceptIds.map(cId => 
      DynamicQuestionGenerator.generateAiQuestion(cId, difficulty, {}, apiKey)
    );
    return Promise.all(promises);
  }
};
