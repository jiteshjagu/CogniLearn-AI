// Server-Side Adaptive Learning Engine

import { db } from '../db.js';
import { CONCEPTS, CONCEPT_LIST } from '../../src/data/conceptsData.js';
import { QUESTION_BANK } from '../../src/data/questionBank.js';

export const AdaptiveEngineBackend = {
  /**
   * Evaluates answers to the Diagnostic Assessment
   */
  analyzeDiagnostic: (answers) => {
    const conceptScores = {};
    const conceptTotals = {};

    CONCEPT_LIST.forEach(c => {
      conceptScores[c.id] = 0;
      conceptTotals[c.id] = 0;
    });

    let totalPoints = 0;
    let earnedPoints = 0;

    answers.forEach(ans => {
      const weight = ans.difficulty === 'hard' ? 3 : ans.difficulty === 'medium' ? 2 : 1;
      conceptTotals[ans.conceptId] = (conceptTotals[ans.conceptId] || 0) + weight;
      totalPoints += weight;

      if (ans.isCorrect) {
        conceptScores[ans.conceptId] = (conceptScores[ans.conceptId] || 0) + weight;
        earnedPoints += weight;
      }
    });

    const conceptMastery = {};
    const criticalGaps = [];

    CONCEPT_LIST.forEach(c => {
      const total = conceptTotals[c.id];
      if (total > 0) {
        const pct = Math.round((conceptScores[c.id] / total) * 100);
        conceptMastery[c.id] = pct;
        if (pct < 60) {
          criticalGaps.push(c.id);
        }
      } else {
        conceptMastery[c.id] = 50;
      }
    });

    // Detect Root Prerequisite Bottleneck
    let rootPrerequisiteBottleneck = null;
    for (const gapId of criticalGaps) {
      const prereqs = CONCEPTS[gapId]?.prerequisites || [];
      const failingPrereq = prereqs.find(pId => criticalGaps.includes(pId));
      if (failingPrereq) {
        rootPrerequisiteBottleneck = failingPrereq;
        break;
      } else if (!rootPrerequisiteBottleneck) {
        rootPrerequisiteBottleneck = gapId;
      }
    }

    const overallMastery = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

    return {
      conceptMastery,
      criticalGaps,
      rootPrerequisiteBottleneck,
      overallMastery,
      totalQuestions: answers.length,
      correctCount: answers.filter(a => a.isCorrect).length,
      recommendedStartingDifficulty: overallMastery >= 75 ? 'hard' : overallMastery >= 50 ? 'medium' : 'easy'
    };
  },

  /**
   * Generates a personalized learning path respecting prerequisites
   */
  generatePersonalizedLearningPath: (student) => {
    const conceptMastery = student.conceptMastery || {};
    const criticalGaps = student.criticalGaps || [];
    const path = [];

    const visited = new Set();
    const orderedConcepts = [];

    const visit = (cId) => {
      if (visited.has(cId)) return;
      visited.add(cId);
      const concept = CONCEPTS[cId];
      if (concept && concept.prerequisites) {
        concept.prerequisites.forEach(pId => visit(pId));
      }
      orderedConcepts.push(cId);
    };

    CONCEPT_LIST.forEach(c => visit(c.id));

    orderedConcepts.forEach((cId, index) => {
      const concept = CONCEPTS[cId];
      const mastery = conceptMastery[cId] ?? 0;
      const isCriticalGap = criticalGaps.includes(cId);

      let status = 'mastered';
      let priority = 'Normal';
      let rationale = '';

      if (mastery < 50 || isCriticalGap) {
        status = 'urgent_gap';
        priority = 'High Priority';
        rationale = `Identified critical conceptual gap (${mastery}% mastery). Must be resolved to unlock downstream topics.`;
      } else if (mastery < 75) {
        status = 'developing';
        priority = 'Medium Priority';
        rationale = `Developing proficiency (${mastery}%). Needs targeted practice to solidify mastery.`;
      } else {
        status = 'mastered';
        priority = 'Low Priority';
        rationale = `Demonstrated strong mastery (${mastery}%). Quick reinforcement or optional enrichment.`;
      }

      const missingPrereqs = (concept.prerequisites || []).filter(pId => (conceptMastery[pId] || 0) < 60);
      const isLockedByPrereq = missingPrereqs.length > 0;

      path.push({
        stepNumber: index + 1,
        conceptId: cId,
        title: concept.name,
        category: concept.category,
        description: concept.description,
        mastery,
        status,
        priority,
        rationale,
        isLockedByPrereq,
        missingPrereqs: missingPrereqs.map(pId => CONCEPTS[pId]?.name || pId),
        estimatedMinutes: status === 'urgent_gap' ? 20 : status === 'developing' ? 12 : 5
      });
    });

    return path.sort((a, b) => {
      const priorityWeights = { 'urgent_gap': 3, 'developing': 2, 'mastered': 1 };
      return (priorityWeights[b.status] || 0) - (priorityWeights[a.status] || 0);
    });
  },

  /**
   * Real-time dynamic difficulty adjustment
   */
  getNextAdaptiveQuestion: ({
    conceptId,
    currentDifficulty = 'medium',
    answeredIds = [],
    lastAnswerCorrect = null,
    consecutiveCorrect = 0,
    consecutiveIncorrect = 0
  }) => {
    let nextDifficulty = currentDifficulty;

    if (lastAnswerCorrect === true) {
      if (currentDifficulty === 'easy') {
        nextDifficulty = 'medium';
      } else if (currentDifficulty === 'medium') {
        nextDifficulty = 'hard';
      }
    } else if (lastAnswerCorrect === false) {
      if (currentDifficulty === 'hard') {
        nextDifficulty = 'medium';
      } else if (currentDifficulty === 'medium') {
        nextDifficulty = 'easy';
      }
    }

    let candidates = QUESTION_BANK.filter(q => 
      q.conceptId === conceptId && 
      q.difficulty === nextDifficulty && 
      !answeredIds.includes(q.id)
    );

    if (candidates.length === 0) {
      candidates = QUESTION_BANK.filter(q => 
        q.conceptId === conceptId && 
        !answeredIds.includes(q.id)
      );
    }

    if (candidates.length === 0) {
      const prereqs = CONCEPTS[conceptId]?.prerequisites || [];
      candidates = QUESTION_BANK.filter(q => 
        prereqs.includes(q.conceptId) && 
        !answeredIds.includes(q.id)
      );
    }

    if (candidates.length > 0) {
      const randomIndex = Math.floor(Math.random() * candidates.length);
      const chosenQuestion = candidates[randomIndex];
      return {
        question: chosenQuestion,
        difficulty: chosenQuestion.difficulty,
        adaptiveTriggerReason: lastAnswerCorrect === null 
          ? 'Calibrated initial difficulty' 
          : lastAnswerCorrect 
            ? `Increased difficulty to ${chosenQuestion.difficulty.toUpperCase()} after correct answer`
            : `Adapted difficulty to ${chosenQuestion.difficulty.toUpperCase()} to provide supportive reinforcement`
      };
    }

    return null;
  },

  /**
   * Updates student profile after an assessment
   */
  updateStudentProfile: (student, submission) => {
    const updatedConceptMastery = { ...(student.conceptMastery || {}) };
    const answers = submission.answers || [];

    const conceptPerformance = {};
    answers.forEach(ans => {
      if (!conceptPerformance[ans.conceptId]) {
        conceptPerformance[ans.conceptId] = { correct: 0, total: 0 };
      }
      conceptPerformance[ans.conceptId].total += 1;
      if (ans.isCorrect) {
        conceptPerformance[ans.conceptId].correct += 1;
      }
    });

    Object.keys(conceptPerformance).forEach(cId => {
      const perf = conceptPerformance[cId];
      const testScore = Math.round((perf.correct / perf.total) * 100);
      const prevMastery = updatedConceptMastery[cId] ?? 50;
      updatedConceptMastery[cId] = Math.min(100, Math.max(0, Math.round(prevMastery * 0.45 + testScore * 0.55)));
    });

    const criticalGaps = Object.keys(updatedConceptMastery).filter(
      cId => updatedConceptMastery[cId] < 60
    );

    const masteryValues = Object.values(updatedConceptMastery);
    const overallMastery = Math.round(
      masteryValues.reduce((a, b) => a + b, 0) / (masteryValues.length || 1)
    );

    let status = 'On Track';
    if (criticalGaps.length >= 2 || overallMastery < 55) {
      status = 'Needs Intervention';
    } else if (overallMastery >= 85) {
      status = 'Mastering';
    }

    let rootPrerequisiteBottleneck = null;
    for (const gapId of criticalGaps) {
      const prereqs = CONCEPTS[gapId]?.prerequisites || [];
      const failingPrereq = prereqs.find(pId => criticalGaps.includes(pId));
      if (failingPrereq) {
        rootPrerequisiteBottleneck = failingPrereq;
        break;
      } else if (!rootPrerequisiteBottleneck) {
        rootPrerequisiteBottleneck = gapId;
      }
    }

    return {
      ...student,
      initialTestTaken: true,
      overallMastery,
      conceptMastery: updatedConceptMastery,
      criticalGaps,
      rootPrerequisiteBottleneck,
      status,
      testsTaken: (student.testsTaken || 0) + 1,
      lastActive: new Date().toLocaleDateString()
    };
  }
};
