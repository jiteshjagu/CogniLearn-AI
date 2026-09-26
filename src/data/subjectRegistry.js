// Canonical Subject Registry - Single Source of Truth
// Exactly: Mathematics, Science, English, History

export const SUBJECTS_REGISTRY = [
  {
    id: 'mathematics',
    slug: 'mathematics',
    label: 'Mathematics',
    iconName: 'Calculator',
    description: 'Algebraic Foundations, Functions, Polynomials & Quadratics',
    route: '/subjects/mathematics',
    defaultProgress: 68,
    colorToken: {
      primary: 'blue',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      badgeActive: 'bg-blue-600 text-white border-blue-600',
      accentText: 'text-blue-600',
      border: 'border-blue-200',
      cardHover: 'hover:border-blue-300 hover:shadow-blue-500/10',
      bgLight: 'bg-blue-50/60',
      ring: 'ring-blue-500',
      gradient: 'from-blue-600 to-indigo-600',
      progressFill: 'bg-gradient-to-r from-blue-500 to-indigo-600'
    },
    subtopics: [
      'Arithmetic & Number Properties',
      'Linear Equations & Inequalities',
      'Polynomial Operations',
      'Factoring Polynomials',
      'Quadratic Equations & Roots',
      'Parabolic Graphs & Vertex Forms',
      'Exponential Functions'
    ]
  },
  {
    id: 'science',
    slug: 'science',
    label: 'Science',
    iconName: 'Atom',
    description: 'Thermodynamics, Cellular Biology, Chemical Kinetics & Mechanics',
    route: '/subjects/science',
    defaultProgress: 54,
    colorToken: {
      primary: 'emerald',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badgeActive: 'bg-emerald-600 text-white border-emerald-600',
      accentText: 'text-emerald-600',
      border: 'border-emerald-200',
      cardHover: 'hover:border-emerald-300 hover:shadow-emerald-500/10',
      bgLight: 'bg-emerald-50/60',
      ring: 'ring-emerald-500',
      gradient: 'from-emerald-600 to-teal-600',
      progressFill: 'bg-gradient-to-r from-emerald-500 to-teal-600'
    },
    subtopics: [
      'Thermodynamics: Heat Transfer & Entropy',
      'Cellular Respiration & Photosynthesis',
      'Chemical Bonding & Valence Shells',
      'Newtonian Mechanics & Force Vectors',
      'Wave Mechanics & Optics'
    ]
  },
  {
    id: 'english',
    slug: 'english',
    label: 'English',
    iconName: 'BookOpen',
    description: 'Rhetorical Analysis, Argumentation, Grammar & Literary Mechanics',
    route: '/subjects/english',
    defaultProgress: 72,
    colorToken: {
      primary: 'amber',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      badgeActive: 'bg-amber-600 text-white border-amber-600',
      accentText: 'text-amber-600',
      border: 'border-amber-200',
      cardHover: 'hover:border-amber-300 hover:shadow-amber-500/10',
      bgLight: 'bg-amber-50/60',
      ring: 'ring-amber-500',
      gradient: 'from-amber-600 to-orange-600',
      progressFill: 'bg-gradient-to-r from-amber-500 to-orange-500'
    },
    subtopics: [
      'Rhetorical Fallacies & Argumentation',
      'Complex Sentence Mechanics & Parallelism',
      'Textual Evidence Synthesis',
      'Tone & Figurative Language Analysis',
      'Thematic Essay Development'
    ]
  },
  {
    id: 'history',
    slug: 'history',
    label: 'History',
    iconName: 'Landmark',
    description: 'World Civilizations, Constitutional Law, Historiography & Timelines',
    route: '/subjects/history',
    defaultProgress: 61,
    colorToken: {
      primary: 'purple',
      badge: 'bg-purple-50 text-purple-700 border-purple-200',
      badgeActive: 'bg-purple-600 text-white border-purple-600',
      accentText: 'text-purple-600',
      border: 'border-purple-200',
      cardHover: 'hover:border-purple-300 hover:shadow-purple-500/10',
      bgLight: 'bg-purple-50/60',
      ring: 'ring-purple-500',
      gradient: 'from-purple-600 to-violet-600',
      progressFill: 'bg-gradient-to-r from-purple-500 to-violet-600'
    },
    subtopics: [
      'Cold War Geopolitics & Treaties',
      'The Enlightenment & Social Contract',
      'Industrial Revolution Socio-Economics',
      'Constitutional Principles & Bill of Rights',
      'Global Decolonization Movements'
    ]
  }
];

export const SUBJECTS_MAP = SUBJECTS_REGISTRY.reduce((acc, subject) => {
  acc[subject.id] = subject;
  return acc;
}, {});

export const getSubjectById = (subjectId) => {
  return SUBJECTS_MAP[subjectId] || SUBJECTS_REGISTRY[0];
};

/**
 * Computes live subject progress based on student data or baseline
 */
export const calculateSubjectProgress = (student, subjectId) => {
  if (!student) return 0;
  
  if (subjectId === 'mathematics') {
    return student.overallMastery !== undefined ? student.overallMastery : 68;
  }
  
  // Non-math subject progress derived from student's profile or baseline
  const base = SUBJECTS_MAP[subjectId]?.defaultProgress || 50;
  const variance = ((student.id?.charCodeAt(student.id.length - 1) || 0) % 15) - 7;
  return Math.min(100, Math.max(25, base + variance));
};
