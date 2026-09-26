// Educational Knowledge Graph: Concepts and Prerequisite Relationships

export const CONCEPTS = {
  'c1': {
    id: 'c1',
    name: 'Arithmetic & Number Properties',
    category: 'Foundations',
    description: 'Order of operations, distributive property, negative numbers, and basic algebraic axioms.',
    prerequisites: [],
    difficulty: 1,
    weight: 10,
    icon: 'Calculator'
  },
  'c2': {
    id: 'c2',
    name: 'Linear Equations & Inequalities',
    category: 'Linear Algebra',
    description: 'Solving single-variable linear equations, isolating variables, and graphing solutions on a number line.',
    prerequisites: ['c1'],
    difficulty: 2,
    weight: 15,
    icon: 'Sliders'
  },
  'c3': {
    id: 'c3',
    name: 'Polynomial Operations',
    category: 'Algebraic Structures',
    description: 'Combining like terms, multiplying binomials (FOIL), and degree of polynomial terms.',
    prerequisites: ['c1', 'c2'],
    difficulty: 2,
    weight: 15,
    icon: 'Layers'
  },
  'c4': {
    id: 'c4',
    name: 'Factoring Polynomials',
    category: 'Algebraic Structures',
    description: 'Extracting greatest common factors, grouping terms, difference of squares, and trinomial decomposition.',
    prerequisites: ['c3'],
    difficulty: 3,
    weight: 20,
    icon: 'Scissors'
  },
  'c5': {
    id: 'c5',
    name: 'Quadratic Equations & Roots',
    category: 'Non-Linear Functions',
    description: 'Solving via factoring, completing the square, and applying the quadratic formula; discriminant analysis.',
    prerequisites: ['c4'],
    difficulty: 3,
    weight: 20,
    icon: 'Maximize2'
  },
  'c6': {
    id: 'c6',
    name: 'Parabolic Graphs & Vertex Forms',
    category: 'Coordinate Geometry',
    description: 'Graphing parabolas, identifying axis of symmetry, vertex (h, k), intercepts, and domain/range transformations.',
    prerequisites: ['c5'],
    difficulty: 4,
    weight: 20,
    icon: 'Activity'
  },
  'c7': {
    id: 'c7',
    name: 'Exponential Functions',
    category: 'Advanced Functions',
    description: 'Exponential growth and decay curves, compound interest models, and laws of exponents.',
    prerequisites: ['c2', 'c3'],
    difficulty: 4,
    weight: 20,
    icon: 'TrendingUp'
  }
};

export const CONCEPT_LIST = Object.values(CONCEPTS);

// Curated dynamic learning content for each concept
export const CONCEPT_LESSONS = {
  'c1': {
    title: 'Mastering Foundations: Arithmetic & Distributive Laws',
    summary: 'Essential algebra rules that underpin all higher mathematical operations.',
    keyTakeaways: [
      'Multiplication and division take precedence over addition and subtraction (PEMDAS).',
      'Distributive Property: a(b + c) = ab + ac.',
      'A minus sign outside brackets reverses the sign of every internal term.'
    ],
    explanation: `When simplifying algebraic expressions, always begin with grouping symbols. Applying the distributive law allows you to dismantle parentheses safely:
    
Formula: a(b - c) = ab - ac
Example: -3(2x - 5) = -6x + 15 (note the sign flip on -5!).`,
    visualFormula: 'a(b + c) = a \\cdot b + a \\cdot c',
    practicePrompt: 'Simplify: -4(3 - 2x) + 5x'
  },
  'c2': {
    title: 'Balancing Linear Equations & Isolation',
    summary: 'The fundamental principle of mathematical balance: what you do to one side, you do to the other.',
    keyTakeaways: [
      'Isolate the variable term on one side and constants on the other.',
      'Reverse order of operations when solving: add/subtract first, then multiply/divide.',
      'When multiplying or dividing an inequality by a negative number, always flip the inequality sign.'
    ],
    explanation: `To solve 4x - 7 = 21:
    Step 1: Add 7 to both sides: 4x = 28
    Step 2: Divide both sides by 4: x = 7.
    Check: 4(7) - 7 = 28 - 7 = 21. True!`,
    visualFormula: 'ax + b = c \\implies x = \\frac{c - b}{a}',
    practicePrompt: 'Solve for x: 5x + 12 = 2'
  },
  'c3': {
    title: 'Polynomial Operations & FOIL Method',
    summary: 'Operating with algebraic terms containing coefficients and powers.',
    keyTakeaways: [
      'You can only add or subtract like terms (identical variables and exponents).',
      'When multiplying terms with the same base, add their exponents: x^a * x^b = x^(a+b).',
      'Use FOIL: First, Outer, Inner, Last for multiplying two binomials.'
    ],
    explanation: `Multiplying binomials (2x + 3)(x - 4):
    First: (2x)(x) = 2x²
    Outer: (2x)(-4) = -8x
    Inner: (3)(x) = 3x
    Last: (3)(-4) = -12
    Combine like terms: 2x² - 5x - 12.`,
    visualFormula: '(a + b)(c + d) = ac + ad + bc + bd',
    practicePrompt: 'Expand and simplify: (3x - 2)(2x + 5)'
  },
  'c4': {
    title: 'Factoring Polynomials: The Prerequisite Bridge',
    summary: 'Factoring is the reverse of distribution and the primary tool for solving quadratic systems.',
    keyTakeaways: [
      'Step 1: Always factor out the Greatest Common Factor (GCF) first.',
      'Difference of Two Squares: a² - b² = (a - b)(a + b).',
      'Trinomial factoring: x² + bx + c = (x + p)(x + q) where p*q = c and p+q = b.'
    ],
    explanation: `Consider factoring x² - 5x + 6:
    Find two numbers that multiply to +6 and add to -5.
    The factors of 6 are (-1, -6) or (-2, -3).
    Notice (-2) + (-3) = -5, and (-2) * (-3) = 6.
    Therefore, the factored form is: (x - 2)(x - 3).`,
    visualFormula: 'x^2 + (p+q)x + pq = (x+p)(x+q)',
    practicePrompt: 'Factor completely: 2x² - 8'
  },
  'c5': {
    title: 'Quadratic Equations & The Quadratic Formula',
    summary: 'Finding the roots (x-intercepts) of 2nd degree polynomial equations.',
    keyTakeaways: [
      'Standard Form: ax² + bx + c = 0.',
      'Zero Product Property: If AB = 0, then A = 0 or B = 0.',
      'Discriminant (D = b² - 4ac): D > 0 gives two real roots, D = 0 gives one repeated root, D < 0 gives complex roots.'
    ],
    explanation: `When an equation cannot be easily factored, use the universal Quadratic Formula:
    x = [-b ± √(b² - 4ac)] / (2a)
    
    Example for x² - 4x - 5 = 0:
    a = 1, b = -4, c = -5
    D = (-4)² - 4(1)(-5) = 16 + 20 = 36
    x = [4 ± √36] / 2 = [4 ± 6] / 2
    Roots are x = 5 and x = -1.`,
    visualFormula: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    practicePrompt: 'Calculate the discriminant for 3x² - 2x + 5 = 0 and state the nature of roots.'
  },
  'c6': {
    title: 'Parabolas, Vertex Form & Transformations',
    summary: 'Visualizing quadratic functions on the Cartesian plane.',
    keyTakeaways: [
      'Vertex Form: y = a(x - h)² + k, where (h, k) is the turning point / vertex.',
      'If a > 0, parabola opens upward (minimum); if a < 0, it opens downward (maximum).',
      'The axis of symmetry is the vertical line x = h = -b / (2a).'
    ],
    explanation: `Converting to vertex form reveals the apex of motion or optimization:
    Given y = (x - 3)² + 4:
    Vertex is (3, 4).
    Since a = 1 > 0, the minimum value of y is 4, occurring at x = 3.`,
    visualFormula: 'y = a(x - h)^2 + k',
    practicePrompt: 'Find the coordinates of the vertex for y = -2(x + 1)² + 8'
  },
  'c7': {
    title: 'Exponential Functions & Compound Growth',
    summary: 'Modeling rapid continuous growth and decay across real-world systems.',
    keyTakeaways: [
      'Base equation: f(t) = a * b^t where a is initial value and b is growth factor.',
      'If b > 1: exponential growth; if 0 < b < 1: exponential decay.',
      'Horizontal asymptote exists along y = 0.'
    ],
    explanation: `In compound interest: A = P(1 + r/n)^(nt).
    Because the variable t is in the exponent, values scale multiplicatively rather than additively.
    A population doubling every 3 hours grows as N(t) = N_0 * 2^(t/3).`,
    visualFormula: 'A(t) = A_0 e^{kt} \\quad \\text{or} \\quad A(t) = A_0(1 + r)^t',
    practicePrompt: 'A culture starts with 500 bacteria and doubles every 4 hours. How many after 12 hours?'
  }
};
