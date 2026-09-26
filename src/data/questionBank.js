// Comprehensive Question Bank organized by Concept and Difficulty

export const QUESTION_BANK = [
  // --- CONCEPT 1: Arithmetic & Number Properties ---
  {
    id: 'q_c1_e1',
    conceptId: 'c1',
    difficulty: 'easy',
    question: 'What is the value of 14 - 3 × (2 + 1)?',
    options: ['33', '5', '11', '7'],
    correctIndex: 1, // 5
    hint: 'Remember PEMDAS: Parentheses first, then multiplication, then subtraction.',
    explanation: 'First evaluate inside parentheses: (2 + 1) = 3. Next multiply: 3 × 3 = 9. Finally subtract: 14 - 9 = 5.',
    prerequisiteConcept: null
  },
  {
    id: 'q_c1_m1',
    conceptId: 'c1',
    difficulty: 'medium',
    question: 'Simplify the expression: -3(4x - 5) + 2(x + 7)',
    options: ['-10x + 29', '-10x - 1', '-14x + 29', '-10x + 1'],
    correctIndex: 0,
    hint: 'Distribute the negative coefficient carefully: -3 multiplied by -5 becomes positive 15.',
    explanation: '-3(4x - 5) = -12x + 15. Then 2(x + 7) = 2x + 14. Combining like terms: (-12x + 2x) + (15 + 14) = -10x + 29.',
    prerequisiteConcept: null
  },
  {
    id: 'q_c1_h1',
    conceptId: 'c1',
    difficulty: 'hard',
    question: 'Evaluate -|-(3² - 14)| - 2³',
    options: ['-3', '-13', '13', '-11'],
    correctIndex: 1,
    hint: 'Notice 3² is 9, so -(9 - 14) = -(-5) = 5. The absolute value of 5 is 5, with a negative sign outside.',
    explanation: 'Inside the absolute value: 3² - 14 = 9 - 14 = -5. So -(-5) = 5. |5| = 5. With the outer negative: -5. Next, 2³ = 8. Finally, -5 - 8 = -13.',
    prerequisiteConcept: null
  },

  // --- CONCEPT 2: Linear Equations & Inequalities ---
  {
    id: 'q_c2_e1',
    conceptId: 'c2',
    difficulty: 'easy',
    question: 'Solve for x: 3x - 7 = 14',
    options: ['x = 7', 'x = 21', 'x = 3', 'x = 2.33'],
    correctIndex: 0,
    hint: 'Add 7 to both sides first, then divide by 3.',
    explanation: '3x - 7 = 14 => 3x = 14 + 7 = 21 => x = 21 / 3 = 7.',
    prerequisiteConcept: 'c1'
  },
  {
    id: 'q_c2_m1',
    conceptId: 'c2',
    difficulty: 'medium',
    question: 'Solve the inequality: 4 - 3x ≤ 19',
    options: ['x ≥ -5', 'x ≤ -5', 'x ≥ 5', 'x ≤ 5'],
    correctIndex: 0,
    hint: 'When dividing by a negative number (-3), remember to flip the inequality sign from ≤ to ≥.',
    explanation: '4 - 3x ≤ 19 => -3x ≤ 15 => Dividing by -3 reverses inequality: x ≥ -5.',
    prerequisiteConcept: 'c1'
  },
  {
    id: 'q_c2_h1',
    conceptId: 'c2',
    difficulty: 'hard',
    question: 'Solve for x: (2x - 3)/4 - (x + 1)/3 = 1',
    options: ['x = 25/2', 'x = 25', 'x = 13', 'x = 19/2'],
    correctIndex: 1,
    hint: 'Multiply the entire equation by the least common denominator 12 to eliminate fractions.',
    explanation: 'Multiply all terms by 12: 3(2x - 3) - 4(x + 1) = 12 => 6x - 9 - 4x - 4 = 12 => 2x - 13 = 12 => 2x = 25 => x = 25/2. Wait, 25/2 is index 0!',
    correctIndex: 0,
    prerequisiteConcept: 'c1'
  },

  // --- CONCEPT 3: Polynomial Operations ---
  {
    id: 'q_c3_e1',
    conceptId: 'c3',
    difficulty: 'easy',
    question: 'Combine like terms: (4x² - 3x + 8) + (2x² + 7x - 5)',
    options: ['6x² + 4x + 3', '6x² - 10x + 3', '6x⁴ + 4x² + 3', '2x² + 4x + 3'],
    correctIndex: 0,
    hint: 'Add coefficients of terms that have identical powers of x.',
    explanation: '(4x² + 2x²) + (-3x + 7x) + (8 - 5) = 6x² + 4x + 3.',
    prerequisiteConcept: 'c1'
  },
  {
    id: 'q_c3_m1',
    conceptId: 'c3',
    difficulty: 'medium',
    question: 'Expand and simplify: (2x - 3)(3x + 4)',
    options: ['6x² - x - 12', '6x² + x - 12', '6x² - 12', '6x² - 17x - 12'],
    correctIndex: 0,
    hint: 'Use FOIL: (2x*3x) + (2x*4) + (-3*3x) + (-3*4).',
    explanation: 'First: 6x². Outer: +8x. Inner: -9x. Last: -12. Sum: 6x² + (8x - 9x) - 12 = 6x² - x - 12.',
    prerequisiteConcept: 'c2'
  },
  {
    id: 'q_c3_h1',
    conceptId: 'c3',
    difficulty: 'hard',
    question: 'Expand completely: (2x - 1)³',
    options: ['8x³ - 12x² + 6x - 1', '8x³ - 1', '8x³ + 12x² - 6x - 1', '8x³ - 6x² + 6x - 1'],
    correctIndex: 0,
    hint: 'Use binomial expansion: (a - b)³ = a³ - 3a²b + 3ab² - b³.',
    explanation: 'With a = 2x and b = 1: (2x)³ - 3(2x)²(1) + 3(2x)(1)² - (1)³ = 8x³ - 3(4x²) + 6x - 1 = 8x³ - 12x² + 6x - 1.',
    prerequisiteConcept: 'c2'
  },

  // --- CONCEPT 4: Factoring Polynomials ---
  {
    id: 'q_c4_e1',
    conceptId: 'c4',
    difficulty: 'easy',
    question: 'Factor completely: 5x² - 20x',
    options: ['5x(x - 4)', '5(x² - 4x)', 'x(5x - 20)', '(5x - 4)(x + 5)'],
    correctIndex: 0,
    hint: 'Extract the Greatest Common Factor of both terms, which is 5x.',
    explanation: 'Both 5x² and 20x share 5x as a factor: 5x² / 5x = x, and -20x / 5x = -4. Result: 5x(x - 4).',
    prerequisiteConcept: 'c3'
  },
  {
    id: 'q_c4_m1',
    conceptId: 'c4',
    difficulty: 'medium',
    question: 'Factor the quadratic trinomial: x² - 7x + 12',
    options: ['(x - 3)(x - 4)', '(x + 3)(x + 4)', '(x - 2)(x - 6)', '(x + 2)(x - 6)'],
    correctIndex: 0,
    hint: 'Find two numbers that multiply to +12 and add up to -7.',
    explanation: 'The factors of 12 that sum to -7 are -3 and -4 (-3 × -4 = 12 and -3 + -4 = -7). Hence (x - 3)(x - 4).',
    prerequisiteConcept: 'c3'
  },
  {
    id: 'q_c4_h1',
    conceptId: 'c4',
    difficulty: 'hard',
    question: 'Factor completely: 6x² + 11x - 10',
    options: ['(2x + 5)(3x - 2)', '(3x + 5)(2x - 2)', '(6x - 5)(x + 2)', '(2x - 5)(3x + 2)'],
    correctIndex: 0,
    hint: 'AC method: Multiply 6 × -10 = -60. Find factors of -60 that add to 11 (15 and -4).',
    explanation: 'Split 11x into 15x - 4x: 6x² + 15x - 4x - 10 = 3x(2x + 5) - 2(2x + 5) = (2x + 5)(3x - 2).',
    prerequisiteConcept: 'c3'
  },

  // --- CONCEPT 5: Quadratic Equations & Roots ---
  {
    id: 'q_c5_e1',
    conceptId: 'c5',
    difficulty: 'easy',
    question: 'Solve for x using factoring: x² - 9 = 0',
    options: ['x = 3 and x = -3', 'x = 9 only', 'x = 3 only', 'x = 81 and x = -81'],
    correctIndex: 0,
    hint: 'Notice this is a difference of squares: (x - 3)(x + 3) = 0.',
    explanation: 'x² - 9 = (x - 3)(x + 3) = 0. By zero product property, x = 3 or x = -3.',
    prerequisiteConcept: 'c4'
  },
  {
    id: 'q_c5_m1',
    conceptId: 'c5',
    difficulty: 'medium',
    question: 'What is the discriminant of 2x² - 4x + 2 = 0, and what does it tell you about the roots?',
    options: [
      'D = 0; exactly one real root (repeated)',
      'D = 32; two distinct real roots',
      'D = -32; no real roots (two complex)',
      'D = 16; two distinct rational roots'
    ],
    correctIndex: 0,
    hint: 'Discriminant formula is D = b² - 4ac. Here a = 2, b = -4, c = 2.',
    explanation: 'D = (-4)² - 4(2)(2) = 16 - 16 = 0. When D = 0, the equation has one double real root.',
    prerequisiteConcept: 'c4'
  },
  {
    id: 'q_c5_h1',
    conceptId: 'c5',
    difficulty: 'hard',
    question: 'Solve 3x² + 5x - 2 = 0 using the quadratic formula.',
    options: ['x = 1/3 and x = -2', 'x = -1/3 and x = 2', 'x = 1/2 and x = -3', 'x = 2/3 and x = -1'],
    correctIndex: 0,
    hint: 'x = [-5 ± √(25 - 4(3)(-2))] / (2*3).',
    explanation: 'b² - 4ac = 25 - (-24) = 49. √49 = 7. x = (-5 ± 7)/6. Roots are (-5 + 7)/6 = 2/6 = 1/3, and (-5 - 7)/6 = -12/6 = -2.',
    prerequisiteConcept: 'c4'
  },

  // --- CONCEPT 6: Parabolic Graphs & Vertex Forms ---
  {
    id: 'q_c6_e1',
    conceptId: 'c6',
    difficulty: 'easy',
    question: 'What are the coordinates of the vertex for y = (x - 4)² + 3?',
    options: ['(4, 3)', '(-4, 3)', '(4, -3)', '(-4, -3)'],
    correctIndex: 0,
    hint: 'In vertex form y = a(x - h)² + k, the vertex is at (h, k). Note the minus sign in front of h.',
    explanation: 'Comparing with y = a(x - h)² + k: h = 4, k = 3. The vertex point is (4, 3).',
    prerequisiteConcept: 'c5'
  },
  {
    id: 'q_c6_m1',
    conceptId: 'c6',
    difficulty: 'medium',
    question: 'Find the axis of symmetry for the parabola given by y = 2x² - 8x + 5.',
    options: ['x = 2', 'x = 4', 'x = -2', 'x = -4'],
    correctIndex: 0,
    hint: 'The axis of symmetry formula is x = -b / (2a).',
    explanation: 'Here a = 2 and b = -8. x = -(-8) / (2 * 2) = 8 / 4 = 2. So the axis of symmetry is x = 2.',
    prerequisiteConcept: 'c5'
  },
  {
    id: 'q_c6_h1',
    conceptId: 'c6',
    difficulty: 'hard',
    question: 'A projectile height is h(t) = -5t² + 20t + 25. What is the maximum height reached?',
    options: ['45 meters', '40 meters', '25 meters', '50 meters'],
    correctIndex: 0,
    hint: 'Maximum occurs at vertex time t = -b/(2a). Substitute that time back into h(t).',
    explanation: 't_vertex = -20 / (2 * -5) = 2 seconds. h(2) = -5(2)² + 20(2) + 25 = -20 + 40 + 25 = 45 meters.',
    prerequisiteConcept: 'c5'
  },

  // --- CONCEPT 7: Exponential Functions ---
  {
    id: 'q_c7_e1',
    conceptId: 'c7',
    difficulty: 'easy',
    question: 'If f(x) = 3 · 2^x, what is the value of f(4)?',
    options: ['48', '24', '36', '16'],
    correctIndex: 0,
    hint: 'Compute 2^4 first, then multiply by 3.',
    explanation: '2^4 = 16. Then f(4) = 3 × 16 = 48.',
    prerequisiteConcept: 'c3'
  },
  {
    id: 'q_c7_m1',
    conceptId: 'c7',
    difficulty: 'medium',
    question: 'A population of bacteria starts at 400 and triples every hour. Which equation models the population P after t hours?',
    options: ['P(t) = 400(3)^t', 'P(t) = 3(400)^t', 'P(t) = 400 + 3t', 'P(t) = 400(t)³'],
    correctIndex: 0,
    hint: 'Standard exponential model is InitialValue × (GrowthFactor)^t.',
    explanation: 'Initial population a = 400. Factor of tripling b = 3. Therefore P(t) = 400 · 3^t.',
    prerequisiteConcept: 'c2'
  },
  {
    id: 'q_c7_h1',
    conceptId: 'c7',
    difficulty: 'hard',
    question: 'Solve for x: 4^(2x - 1) = 64',
    options: ['x = 2', 'x = 3/2', 'x = 1', 'x = 5/2'],
    correctIndex: 0,
    hint: 'Express 64 as a power of 4: 64 = 4³.',
    explanation: '4^(2x - 1) = 4³ => Since the bases are equal, 2x - 1 = 3 => 2x = 4 => x = 2.',
    prerequisiteConcept: 'c3'
  }
];

// Diagnostic test uses a cross-section of foundational to intermediate questions
export const DIAGNOSTIC_QUESTION_IDS = [
  'q_c1_e1',
  'q_c1_m1',
  'q_c2_e1',
  'q_c2_m1',
  'q_c3_e1',
  'q_c3_m1',
  'q_c4_e1',
  'q_c4_m1',
  'q_c5_e1',
  'q_c5_m1',
  'q_c6_e1',
  'q_c7_e1'
];
