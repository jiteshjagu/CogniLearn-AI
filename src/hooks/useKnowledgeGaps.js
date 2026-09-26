import { useState, useMemo, useCallback } from 'react';
import { CONCEPTS } from '../data/conceptsData.js';
import { SUBJECTS_MAP } from '../data/subjectRegistry.js';

/**
 * KnowledgeGap Data Shape
 * @typedef {Object} KnowledgeGap
 * @property {string} id
 * @property {string} subjectId
 * @property {string} subtopic
 * @property {'critical' | 'needs-review'} severity
 * @property {string} [lastAssessed]
 * @property {string} [conceptId]
 * @property {number} [accuracy]
 * @property {string} [remedyTip]
 */

/**
 * Placeholder mock gap fetcher for non-math subjects or external gaps endpoint
 * [NOTE: SWAPPABLE] - When a dedicated backend `/api/gaps/:subjectId` is deployed,
 * replace this function with an `apiClient.getSubjectGaps(subjectId, studentId)` call.
 */
export const fetchSubjectGapsMock = (subjectId, studentId = 's1') => {
  const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  switch (subjectId) {
    case 'science':
      return [
        {
          id: `gap_sci_1_${studentId}`,
          subjectId: 'science',
          subtopic: 'Thermodynamics: Heat Transfer & Entropy',
          severity: 'critical',
          lastAssessed: now,
          accuracy: 38,
          remedyTip: 'Differentiate between adiabatic and isothermal transitions; review the Second Law of Thermodynamics.'
        },
        {
          id: `gap_sci_2_${studentId}`,
          subjectId: 'science',
          subtopic: 'Chemical Kinetics & Rate Laws',
          severity: 'needs-review',
          lastAssessed: now,
          accuracy: 58,
          remedyTip: 'Practice calculating reaction orders from initial rate experimental trials.'
        }
      ];
    case 'english':
      return [
        {
          id: `gap_eng_1_${studentId}`,
          subjectId: 'english',
          subtopic: 'Rhetorical Fallacies & Argumentation',
          severity: 'needs-review',
          lastAssessed: now,
          accuracy: 62,
          remedyTip: 'Distinguish between ad hominem, straw man, and false dichotomy in argumentative text.'
        },
        {
          id: `gap_eng_2_${studentId}`,
          subjectId: 'english',
          subtopic: 'Parallelism & Dangling Modifiers',
          severity: 'critical',
          lastAssessed: now,
          accuracy: 34,
          remedyTip: 'Ensure introductory participle phrases match the grammatical subject of the main clause.'
        }
      ];
    case 'history':
      return [
        {
          id: `gap_hist_1_${studentId}`,
          subjectId: 'history',
          subtopic: 'Cold War Treaties & Containment Strategy',
          severity: 'needs-review',
          lastAssessed: now,
          accuracy: 55,
          remedyTip: 'Review the Marshall Plan, Truman Doctrine, and NATO formation timelines (1947–1949).'
        }
      ];
    default:
      return [];
  }
};

/**
 * Derives dynamic mathematics gaps from the student's actual concept mastery profile
 */
const deriveMathGapsFromStudent = (student) => {
  if (!student) return [];
  const mathGaps = [];
  const now = student.lastActive || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const mastery = student.conceptMastery || {};
  const criticalList = student.criticalGaps || [];

  // Check each concept in the mathematical graph
  Object.entries(CONCEPTS).forEach(([conceptId, concept]) => {
    const score = mastery[conceptId] !== undefined ? mastery[conceptId] : 50;
    const isCritical = criticalList.includes(conceptId) || score < 45;
    const needsReview = score >= 45 && score < 70;

    if (isCritical) {
      mathGaps.push({
        id: `gap_math_${conceptId}`,
        subjectId: 'mathematics',
        subtopic: `${concept.name}`,
        severity: 'critical',
        lastAssessed: now,
        conceptId,
        accuracy: score,
        remedyTip: `Prerequisite bottleneck detected. Prioritize ${concept.name} foundations before advanced units.`
      });
    } else if (needsReview) {
      mathGaps.push({
        id: `gap_math_${conceptId}`,
        subjectId: 'mathematics',
        subtopic: `${concept.name}`,
        severity: 'needs-review',
        lastAssessed: now,
        conceptId,
        accuracy: score,
        remedyTip: `Approaching fluency. Complete targeted practice on tricky boundary cases to reach mastery.`
      });
    }
  });

  return mathGaps;
};

/**
 * Primary Hook for Knowledge Gap Detection & Personalized Learning Roadmap Generation
 */
export const useKnowledgeGaps = (student, selectedSubjectId = 'all') => {
  // Track milestone completion states in local memory
  const [completedMilestoneIds, setCompletedMilestoneIds] = useState(() => new Set());

  // 1. Gather all gaps across subjects
  const allGaps = useMemo(() => {
    if (!student) return [];
    const mathGaps = deriveMathGapsFromStudent(student);
    const sciGaps = fetchSubjectGapsMock('science', student.id);
    const engGaps = fetchSubjectGapsMock('english', student.id);
    const histGaps = fetchSubjectGapsMock('history', student.id);

    return [...mathGaps, ...sciGaps, ...engGaps, ...histGaps];
  }, [student]);

  // 2. Filter gaps by active subject
  const filteredGaps = useMemo(() => {
    if (selectedSubjectId === 'all') return allGaps;
    return allGaps.filter(g => g.subjectId === selectedSubjectId);
  }, [allGaps, selectedSubjectId]);

  // 3. Generate Roadmap Milestones directly referencing each Knowledge Gap
  const milestones = useMemo(() => {
    return filteredGaps.map((gap, index) => {
      const milestoneId = `ms_${gap.id}`;
      const subject = SUBJECTS_MAP[gap.subjectId] || SUBJECTS_MAP.mathematics;
      const isCompleted = completedMilestoneIds.has(milestoneId);

      return {
        id: milestoneId,
        milestoneNumber: index + 1,
        gapId: gap.id,
        gapSubtopic: gap.subtopic,
        subjectId: gap.subjectId,
        subjectLabel: subject.label,
        severity: gap.severity,
        title: `Milestone ${index + 1}: ${gap.subtopic} Mastery Sprint`,
        recommendedReading: {
          title: `Comprehensive Guide: ${gap.subtopic}`,
          estimatedMinutes: 6,
          summary: `Core review addressing ${gap.remedyTip || 'foundational rules and common cognitive traps.'}`
        },
        microQuiz: {
          title: `Diagnostic Micro-Quiz (${gap.subtopic})`,
          estimatedMinutes: 3,
          questionCount: 3,
          conceptId: gap.conceptId || 'c4',
          actionLabel: 'Launch Micro-Quiz'
        },
        practiceModule: {
          title: `Targeted Practice Drill`,
          estimatedMinutes: 8,
          problemCount: 5,
          conceptId: gap.conceptId || 'c4',
          actionLabel: 'Start Practice'
        },
        isCompleted
      };
    });
  }, [filteredGaps, completedMilestoneIds]);

  const toggleMilestoneCompletion = useCallback((milestoneId) => {
    setCompletedMilestoneIds(prev => {
      const next = new Set(prev);
      if (next.has(milestoneId)) {
        next.delete(milestoneId);
      } else {
        next.add(milestoneId);
      }
      return next;
    });
  }, []);

  const markMilestoneComplete = useCallback((milestoneId) => {
    setCompletedMilestoneIds(prev => new Set(prev).add(milestoneId));
  }, []);

  return {
    allGaps,
    filteredGaps,
    milestones,
    hasGaps: filteredGaps.length > 0,
    criticalGapsCount: filteredGaps.filter(g => g.severity === 'critical').length,
    needsReviewCount: filteredGaps.filter(g => g.severity === 'needs-review').length,
    completedCount: milestones.filter(m => m.isCompleted).length,
    totalMilestones: milestones.length,
    toggleMilestoneCompletion,
    markMilestoneComplete
  };
};
