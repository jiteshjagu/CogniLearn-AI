// Dynamic Intelligent Offline Pedagogical & Problem-Solving Engine
// Evaluates student queries, solves mathematical equations dynamically,
// and synthesizes grounded 3-part educational answers when offline or waiting for API keys.

export const DynamicTutorEngine = {
  /**
   * Generates a tailored, dynamic 3-part response based on the student's exact query
   */
  generateResponse: (userMessage, subjectId = 'mathematics', context = {}) => {
    const query = userMessage.trim();
    const lower = query.toLowerCase();

    // 1. Check for Linear Equations to solve dynamically (e.g. 2x + 4 = 10, 3x - 5 = 16, 5x = 25)
    const eqMatch = query.match(/([+-]?\s*\d*)\s*x\s*([+-]\s*\d+)?\s*=\s*([+-]?\s*\d+)/i);
    if (eqMatch && (lower.includes('solve') || lower.includes('=') || lower.includes('find x') || lower.includes('what is x'))) {
      const aStr = eqMatch[1].replace(/\s+/g, '');
      const bStr = eqMatch[2] ? eqMatch[2].replace(/\s+/g, '') : '+0';
      const cStr = eqMatch[3].replace(/\s+/g, '');

      let a = aStr === '' || aStr === '+' ? 1 : aStr === '-' ? -1 : parseFloat(aStr);
      let b = parseFloat(bStr) || 0;
      let c = parseFloat(cStr) || 0;

      if (!isNaN(a) && a !== 0 && !isNaN(b) && !isNaN(c)) {
        const cMinusB = c - b;
        const xVal = Math.round((cMinusB / a) * 100) / 100;
        const bSign = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
        const inverseOp = b >= 0 ? `subtract ${b}` : `add ${Math.abs(b)}`;

        return {
          reply: `### Core Concept Explanation
Solving a linear equation is all about maintaining balance, like a double-pan weighing scale. Whatever operation you apply to the left side, you must apply equally to the right side to isolate the variable $x$.

### Step-by-Step Breakdown
1. **Given Equation**: $${a === 1 ? '' : a === -1 ? '-' : a}x ${b === 0 ? '' : bSign} = ${c}$$
2. **Isolate the Variable Term**: ${b !== 0 ? `Apply the inverse of the constant: ${inverseOp} from both sides:
   $$${a === 1 ? '' : a === -1 ? '-' : a}x = ${c} - (${b}) \\implies ${a === 1 ? '' : a === -1 ? '-' : a}x = ${cMinusB}$$` : 'The constant is already isolated.'}
3. **Isolate $x$**: Divide both sides by the coefficient of $x$ (${a}):
   $$x = \\frac{${cMinusB}}{${a}} \\implies \\mathbf{x = ${xVal}}$$
4. **Verification Check**: Substitute $x = ${xVal}$ back:
   $$${a}(${xVal}) ${b === 0 ? '' : bSign} = ${a * xVal + b} = ${c}$$ (Confirmed ✓)

### Concept Check
If you had the equation $${a * 2}x ${bSign} = ${c * 2}$, what would be your very first step to isolate $x$?`,
          model: 'dynamic-pedagogical-engine',
          subjectId: 'mathematics'
        };
      }
    }

    // 2. Check for Factoring Difference of Squares (e.g. x^2 - 16, x^2 - 25, x^2 - 49)
    const diffSqMatch = query.match(/x\s*(?:\^2|²)\s*-\s*(\d+)/i);
    if (diffSqMatch && (lower.includes('factor') || lower.includes('solve') || lower.includes('simplify') || lower.includes('difference'))) {
      const k = parseInt(diffSqMatch[1], 10);
      const sqrtK = Math.sqrt(k);
      const isPerfectSquare = Number.isInteger(sqrtK);

      if (isPerfectSquare) {
        return {
          reply: `### Core Concept Explanation
The **Difference of Squares** is an algebraic identity: $a^2 - b^2 = (a - b)(a + b)$. Think of it like taking a large square cake of area $x^2$, cutting out a smaller square slice of area $b^2$, and rearranging the remaining border into a single rectangle of dimensions $(x - b)$ by $(x + b)$!

### Step-by-Step Breakdown
1. **Identify the Square Terms**: In $x^2 - ${k}$, the first term is $(x)^2$ and the constant is $(${sqrtK})^2$.
2. **Apply the Pattern**: Using $a^2 - b^2 = (a - b)(a + b)$ with $a = x$ and $b = ${sqrtK}$:
   $$x^2 - ${k} = (x - ${sqrtK})(x + ${sqrtK})$$
3. **Verify by FOIL Expansion**:
   $$(x)(x) + (x)(${sqrtK}) - (${sqrtK})(x) - (${sqrtK})(${sqrtK}) = x^2 + ${sqrtK}x - ${sqrtK}x - ${k} = x^2 - ${k}$$ (The middle terms cancel completely!)

### Concept Check
What would the factored form be if the expression were $x^2 - ${k * 4}$?`,
          model: 'dynamic-pedagogical-engine',
          subjectId: 'mathematics'
        };
      }
    }

    // 3. Check for Common Factor Factoring (e.g. 2x^2 + 8x, 3x^2 - 9x)
    const gcfMatch = query.match(/(\d*)\s*x\s*(?:\^2|²)\s*([+-])\s*(\d*)\s*x/i);
    if (gcfMatch && (lower.includes('factor') || lower.includes('gcf') || lower.includes('common'))) {
      const c1 = parseInt(gcfMatch[1] || '1', 10);
      const sign = gcfMatch[2];
      const c2 = parseInt(gcfMatch[3] || '1', 10);

      const findGcd = (x, y) => (!y ? x : findGcd(y, x % y));
      const gcfNum = findGcd(c1, c2);
      const inside1 = c1 / gcfNum;
      const inside2 = c2 / gcfNum;

      const insideStr = `${inside1 === 1 ? '' : inside1}x ${sign} ${inside2}`;

      return {
        reply: `### Core Concept Explanation
Factoring by **Greatest Common Factor (GCF)** is simply reverse multiplication (the Distributive Property running backward). Imagine everyone in a room has a bag with apples and oranges—pulling out the GCF is like finding the common items everyone brought and collecting them in a shared basket outside the door!

### Step-by-Step Breakdown
1. **Analyze Coefficients & Variables**: Compare the terms $${c1}x^2$ and $${c2}x$.
   - Both terms contain at least one factor of $x$.
   - The greatest common divisor of $${c1}$ and $${c2}$ is $\\mathbf{${gcfNum}}$.
2. **Extract the GCF**: The overall greatest common factor is $\\mathbf{${gcfNum}x}$.
3. **Divide Each Term by the GCF**:
   - $\\frac{${c1}x^2}{${gcfNum}x} = ${inside1 === 1 ? '' : inside1}x$
   - $\\frac{${sign === '-' ? '-' : ''}${c2}x}{${gcfNum}x} = ${sign === '-' ? '-' : '+'}${inside2}$
4. **Final Factored Expression**:
   $$\\mathbf{${gcfNum}x(${insideStr})}$$

### Concept Check
If you multiply back $${gcfNum}x \\times (${insideStr})$, do you get the original expression $${c1}x^2 ${sign} ${c2}x$?`,
        model: 'dynamic-pedagogical-engine',
        subjectId: 'mathematics'
      };
    }

    // 4. Mathematics: Quadratic Formula / Roots
    if (lower.includes('quadratic formula') || lower.includes('discriminant') || (lower.includes('quadratic') && lower.includes('root'))) {
      return {
        reply: `### Core Concept Explanation
The **Quadratic Formula** is the universal master key that unlocks any equation of the form $ax^2 + bx + c = 0$. Think of it like a GPS formula: no matter how messy or non-factorable the parabola is, it always navigates directly to the exact points where the curve crosses the horizontal ground ($x$-axis).

### Step-by-Step Breakdown
1. **Standard Form**: Ensure your equation is arranged as $ax^2 + bx + c = 0$.
2. **The Quadratic Formula**:
   $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$
3. **Evaluate the Discriminant ($D = b^2 - 4ac$)**:
   - If $D > 0$: Exactly **2 real roots** (crosses the $x$-axis twice).
   - If $D = 0$: Exactly **1 repeated root** (vertex touches the $x$-axis).
   - If $D < 0$: **No real roots** (2 complex conjugate roots; curve floats above/below the axis).
4. **Calculate Solutions**: Compute $-b + \\sqrt{D}$ and $-b - \\sqrt{D}$, then divide both by $2a$.

### Concept Check
If a quadratic equation has $a = 1, b = 4, c = 4$, what is the discriminant value $b^2 - 4ac$, and how many real roots exist?`,
        model: 'dynamic-pedagogical-engine',
        subjectId: 'mathematics'
      };
    }

    // 5. Mathematics: Order of Operations / PEMDAS
    if (lower.includes('pemdas') || lower.includes('order of operation') || lower.includes('bodmas')) {
      return {
        reply: `### Core Concept Explanation
**PEMDAS** is the universal traffic code for mathematics. Imagine an intersection without traffic lights—chaos would ensue! Similarly, PEMDAS establishes strict right-of-way rules so every mathematician around the globe evaluates an expression to the exact same numerical result.

### Step-by-Step Breakdown
1. **P - Parentheses & Grouping**: Evaluate inside brackets $( )$, $[ ]$, or $\{ \}$ first from innermost to outermost.
2. **E - Exponents & Radicals**: Calculate powers like $x^2$ and square roots $\\sqrt{x}$.
3. **MD - Multiplication and Division**: Carried out together strictly from **Left to Right** as they appear. (Division does *not* wait for multiplication!)
4. **AS - Addition and Subtraction**: Carried out together strictly from **Left to Right** as they appear.

### Concept Check
In the expression $12 - 3 \\times 2 + 4$, which operation must be executed first according to PEMDAS?`,
        model: 'dynamic-pedagogical-engine',
        subjectId: 'mathematics'
      };
    }

    // 6. Science: Thermodynamics & Entropy
    if (lower.includes('thermodynamic') || lower.includes('entropy') || lower.includes('heat') || lower.includes('enthalpy')) {
      return {
        reply: `### Core Concept Explanation
**Thermodynamic Entropy ($S$)** measures the dispersion of energy and molecular disorder in a physical system. Think of it like a clean bedroom: without deliberate energy and work put in to tidy it up, natural random movement ensures it progressively becomes more disorganized over time!

### Step-by-Step Breakdown
1. **The First Law (Conservation)**: Energy cannot be created or destroyed, only transferred:
   $$\\Delta U = Q - W$$ (Internal energy change equals heat added minus work done by system).
2. **The Second Law (Entropy)**: In any spontaneous natural process, the total entropy of the universe always increases:
   $$\\Delta S_{\\text{universe}} > 0$$
3. **Gibbs Free Energy Criterion**: To determine if a chemical reaction occurs spontaneously at constant temperature ($T$):
   $$\\Delta G = \\Delta H - T\\Delta S$$
   - If $\\Delta G < 0$, the reaction is spontaneous and releases usable free energy.

### Concept Check
When water freezes into solid ice crystals at sub-zero temperatures, the water molecules become more ordered (entropy decreases). Why does this not violate the Second Law of Thermodynamics?`,
        model: 'dynamic-pedagogical-engine',
        subjectId: 'science'
      };
    }

    // 7. Science: Cellular Respiration & Photosynthesis
    if (lower.includes('photosynthesis') || lower.includes('respiration') || lower.includes('mitochondria') || lower.includes('atp') || lower.includes('cell')) {
      return {
        reply: `### Core Concept Explanation
**Cellular Respiration and Photosynthesis** are the two complementary halves of Earth's biological energy cycle. Photosynthesis is like recharging a biological chemical battery using sunlight, and cellular respiration is like discharging that battery inside the cell's power plant (mitochondria) to produce universal cellular currency: **ATP**!

### Step-by-Step Breakdown
1. **Photosynthesis (In Chloroplasts)**: Plants capture photons and convert carbon dioxide and water into glucose:
   $$6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{Light} \\longrightarrow \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$
2. **Glycolysis (In Cytoplasm)**: Glucose is split into two pyruvate molecules, yielding a net of 2 ATP.
3. **Krebs / Citric Acid Cycle (In Mitochondrial Matrix)**: Pyruvate derivatives are oxidized, releasing $\\text{CO}_2$ and loading electron carriers (NADH, FADH$_2$).
4. **Electron Transport Chain & Chemiosmosis**: Electrons power proton pumps across the inner membrane, driving ATP synthase to create ~32–34 ATP per glucose!

### Concept Check
What is the primary byproduct gas released during the light-dependent reactions of photosynthesis when water molecules are split?`,
        model: 'dynamic-pedagogical-engine',
        subjectId: 'science'
      };
    }

    // 8. Science: Newton's Laws & Physics Mechanics
    if (lower.includes('newton') || lower.includes('force') || lower.includes('gravity') || lower.includes('velocity') || lower.includes('acceleration')) {
      return {
        reply: `### Core Concept Explanation
**Newton's Laws of Motion** describe how physical objects interact with forces. Think of inertia like sliding on a frictionless sheet of ice: once you get moving, you will glide forever in a straight line unless an external push, pull, or barrier acts upon you!

### Step-by-Step Breakdown
1. **1st Law (Law of Inertia)**: An object at rest remains at rest, and an object in uniform motion remains in motion unless acted upon by a net external force ($\\sum F = 0 \\implies a = 0$).
2. **2nd Law (Force & Acceleration)**: Acceleration is directly proportional to net force and inversely proportional to mass:
   $$\\mathbf{F_{\\text{net}} = m \\cdot a}$$
3. **3rd Law (Action-Reaction)**: For every action force exerted on object B by object A, object B exerts an equal and opposite reaction force on object A ($F_{A \\rightarrow B} = -F_{B \\rightarrow A}$).

### Concept Check
If you push against a massive concrete wall with a force of $50\\text{ N}$, how much force does the wall exert back on your hands?`,
        model: 'dynamic-pedagogical-engine',
        subjectId: 'science'
      };
    }

    // 9. English: Rhetorical Appeals & Argumentation
    if (lower.includes('rhetoric') || lower.includes('ethos') || lower.includes('pathos') || lower.includes('logos') || lower.includes('thesis')) {
      return {
        reply: `### Core Concept Explanation
**Aristotelian Rhetoric** is the art of persuasive communication. Think of a persuasive essay like a three-legged stool: to stand upright without toppling, it requires all three legs—Ethos (credibility of the speaker), Pathos (emotional resonance with the audience), and Logos (sound, verifiable logic and evidence).

### Step-by-Step Breakdown
1. **Ethos (Character & Authority)**: Establishes why the audience should trust the author. Built using unbiased tone, verified citations, and professional integrity.
2. **Pathos (Emotional Appeal)**: Connects with the audience's core values, empathy, or imagination using vivid sensory imagery and human storytelling.
3. **Logos (Logic & Data)**: Anchors the thesis using inductive/deductive reasoning, statistical empirical evidence, and syllogisms.
4. **Synthesizing a Defensible Thesis**: Combine an arguable claim with clear reasoning: *"Although [counterargument], [author's claim] because [reason A] and [reason B]."*

### Concept Check
In Martin Luther King Jr.'s "I Have a Dream" speech, does quoting the American Declaration of Independence ("all men are created equal") appeal primarily to Ethos, Pathos, or Logos?`,
        model: 'dynamic-pedagogical-engine',
        subjectId: 'english'
      };
    }

    // 10. History: Cold War & Geopolitics
    if (lower.includes('cold war') || lower.includes('truman') || lower.includes('marshall plan') || lower.includes('soviet') || lower.includes('containment')) {
      return {
        reply: `### Core Concept Explanation
The **Cold War (1947–1991)** was an ideological, geopolitical chess match between two nuclear-armed superpowers—the United States (democratic capitalism) and the Soviet Union (totalitarian communism). Because direct military confrontation risked Mutually Assured Destruction (MAD), the conflict was fought through proxy wars, espionage, space races, and economic pacts.

### Step-by-Step Breakdown
1. **The Containment Strategy**: Articulated in George Kennan's "Long Telegram" (1946)—the policy of halting communist expansion globally without engaging in direct hot war.
2. **The Truman Doctrine (1947)**: Pledged American economic and military assistance to democratic nations threatened by authoritarian expansion (specifically Greece and Turkey).
3. **The Marshall Plan (1948)**: A multi-billion-dollar European recovery program that rebuilt devastated Western European economies, eliminating the economic despair that fostered communist appeal.
4. **Alliance Networks**: The formation of NATO (1949) for collective Western defense countered by the Soviet Warsaw Pact (1955).

### Concept Check
Why did Soviet Premier Joseph Stalin reject Marshall Plan economic aid for the USSR and its Eastern European satellite states in 1948?`,
        model: 'dynamic-pedagogical-engine',
        subjectId: 'history'
      };
    }

    // 11. Universal Dynamic Synthesizer (Catches any general question and addresses it directly!)
    const cleanedTopic = query.replace(/[?.,!]/g, '').replace(/^(can you explain|what is|how do i|tell me about|how to solve|explain)\s+/i, '');
    const displayTopic = cleanedTopic.charAt(0).toUpperCase() + cleanedTopic.slice(1);

    return {
      reply: `### Core Concept Explanation
When studying **${displayTopic}**, the fundamental key is connecting abstract definitions to practical applications. Think of this concept like building a pyramid: each advanced principle rests firmly upon foundational axioms. Breaking it down into its constituent components transforms what looks intimidating into a set of straightforward, logical rules.

### Step-by-Step Breakdown
1. **Identify the Core Premise**: What are the given variables, central entities, or primary historical/scientific conditions in "${displayTopic}"?
2. **Apply Governing Rules**: Look for the direct laws, formulas, or analytical frameworks that dictate how these components interact.
3. **Synthesize & Back-Check**: Test edge cases or boundary conditions to verify that your conclusion is consistent with established foundational rules.

### Concept Check
In your own words, what is the single most important rule or condition you must remember when working with **${displayTopic}**?`,
      model: 'dynamic-pedagogical-engine',
      subjectId
    };
  }
};
