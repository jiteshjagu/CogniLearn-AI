// Adaptive Learning Engine: Diagnostic Analysis, Gap Detection, Dynamic Difficulty Adjustment

import { CONCEPTS, CONCEPT_LIST } from '../data/conceptsData';
import { QUESTION_BANK } from '../data/questionBank';

export const AdaptiveEngine = {
  /**
   * Evaluates answers to the Diagnostic Assessment and computes concept masteries & gaps
   * @param {Array} answers - Array of { questionId, studentAnswerIndex, isCorrect, conceptId, difficulty }
   */
  analyzeDiagnostic: (answers) => {
    const conceptScores = {};
    const conceptTotals = {};

    // Initialize all concepts
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

    // Compute percentage mastery per concept
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
        conceptMastery[c.id] = 50; // default uncalibrated
      }
    });

    // Detect Root Prerequisite Bottleneck
    // If a concept has a gap, find if any of its prerequisites also has a gap
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
   * Generates a sequenced, dynamic learning path respecting prerequisite dependency trees
   */
  generatePersonalizedLearningPath: (student) => {
    const conceptMastery = student.conceptMastery || {};
    const criticalGaps = student.criticalGaps || [];
    const path = [];

    // Topological sorting helper
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

    // Construct path items based on mastery & gaps
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

      // Check if prerequisites are satisfied
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

    // Prioritize urgent gaps and prerequisite bridges first
    return path.sort((a, b) => {
      const priorityWeights = { 'urgent_gap': 3, 'developing': 2, 'mastered': 1 };
      return (priorityWeights[b.status] || 0) - (priorityWeights[a.status] || 0);
    });
  },

  /**
   * Dynamic real-time adaptive quiz engine
   * Chooses next question and modulates difficulty based on live performance
   */
  getNextAdaptiveQuestion: ({
    conceptId,
    currentDifficulty = 'medium',
    answeredIds = [],
    lastAnswerCorrect = null,
    consecutiveCorrect = 0,
    consecutiveIncorrect = 0
  }) => {
    // 1. Determine new difficulty level based on adaptive feedback loop
    let nextDifficulty = currentDifficulty;

    if (lastAnswerCorrect === true) {
      if (currentDifficulty === 'easy') {
        nextDifficulty = 'medium';
      } else if (currentDifficulty === 'medium') {
        nextDifficulty = 'hard';
      }
      // If already hard, remains hard (mastery challenge)
    } else if (lastAnswerCorrect === false) {
      if (currentDifficulty === 'hard') {
        nextDifficulty = 'medium';
      } else if (currentDifficulty === 'medium') {
        nextDifficulty = 'easy';
      }
      // If already easy and failing, engine reinforces foundation
    }

    // 2. Filter available questions matching target concept and difficulty
    let candidates = QUESTION_BANK.filter(q => 
      q.conceptId === conceptId && 
      q.difficulty === nextDifficulty && 
      !answeredIds.includes(q.id)
    );

    // Fallback: If no candidate at exact difficulty, try adjacent difficulties for same concept
    if (candidates.length === 0) {
      candidates = QUESTION_BANK.filter(q => 
        q.conceptId === conceptId && 
        !answeredIds.includes(q.id)
      );
    }

    // Secondary Fallback: If all questions for this concept are exhausted, pick from related prerequisite
    if (candidates.length === 0) {
      const prereqs = CONCEPTS[conceptId]?.prerequisites || [];
      candidates = QUESTION_BANK.filter(q => 
        prereqs.includes(q.conceptId) && 
        !answeredIds.includes(q.id)
      );
    }

    // Pick random question from candidates
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

    return null; // Quiz completed or bank exhausted
  },

  /**
   * Updates student's continuous profile after taking an assessment
   */
  updateStudentProfileAfterTest: (student, submission) => {
    const updatedConceptMastery = { ...(student.conceptMastery || {}) };
    const answers = submission.answers || [];

    // Group answers by concept
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

    // Update mastery with Exponential Moving Average (EMA)
    Object.keys(conceptPerformance).forEach(cId => {
      const perf = conceptPerformance[cId];
      const testScore = Math.round((perf.correct / perf.total) * 100);
      const prevMastery = updatedConceptMastery[cId] ?? 50;
      // 55% weight to recent test, 45% to prior baseline
      updatedConceptMastery[cId] = Math.min(100, Math.max(0, Math.round(prevMastery * 0.45 + testScore * 0.55)));
    });

    // Recalculate critical gaps
    const criticalGaps = Object.keys(updatedConceptMastery).filter(
      cId => updatedConceptMastery[cId] < 60
    );

    // Calculate new overall mastery
    const masteryValues = Object.values(updatedConceptMastery);
    const overallMastery = Math.round(
      masteryValues.reduce((a, b) => a + b, 0) / (masteryValues.length || 1)
    );

    // Determine status
    let status = 'On Track';
    if (criticalGaps.length >= 2 || overallMastery < 55) {
      status = 'Needs Intervention';
    } else if (overallMastery >= 85) {
      status = 'Mastering';
    }

    // Determine root prerequisite bottleneck
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
  },

  /**
   * Comprehensive Dynamic Result Evaluation & Progress Tracker
   * Evaluates accuracy, weighted difficulty, concept mastery deltas, misconception diagnostics,
   * learning velocity, and generates AI/pedagogical prescriptions.
   */
  evaluateAssessmentResult: (student, { answers = [], testType = 'Adaptive Quiz', title = '', durationMinutes = 5 }) => {
    const totalQuestions = answers.length || 1;
    const correctCount = answers.filter(a => a.isCorrect).length;
    const rawAccuracy = Math.round((correctCount / totalQuestions) * 100);

    let earnedWeightedPoints = 0;
    let totalWeightedPoints = 0;
    let totalTimeSeconds = 0;

    answers.forEach(a => {
      const weight = a.difficulty === 'hard' ? 3 : a.difficulty === 'medium' ? 2 : 1;
      totalWeightedPoints += weight;
      if (a.isCorrect) earnedWeightedPoints += weight;
      totalTimeSeconds += (a.timeSpentSeconds || 15);
    });

    const weightedScore = totalWeightedPoints > 0 
      ? Math.round((earnedWeightedPoints / totalWeightedPoints) * 100) 
      : rawAccuracy;

    const avgTimePerQuestion = Math.round(totalTimeSeconds / totalQuestions);

    let grade = 'Developing';
    if (weightedScore >= 90) grade = 'Exemplary Mastery';
    else if (weightedScore >= 75) grade = 'Proficient';
    else if (weightedScore >= 60) grade = 'Functional Foundation';
    else grade = 'Requires Targeted Intervention';

    const previousConceptMastery = { ...(student.conceptMastery || {}) };
    const updatedConceptMastery = { ...previousConceptMastery };

    const conceptPerformance = {};
    answers.forEach(ans => {
      const cId = ans.conceptId || 'c4';
      if (!conceptPerformance[cId]) {
        conceptPerformance[cId] = { correct: 0, total: 0, time: 0, errors: [] };
      }
      conceptPerformance[cId].total += 1;
      conceptPerformance[cId].time += (ans.timeSpentSeconds || 15);
      if (ans.isCorrect) {
        conceptPerformance[cId].correct += 1;
      } else {
        conceptPerformance[cId].errors.push(ans);
      }
    });

    const conceptDeltas = [];
    Object.keys(conceptPerformance).forEach(cId => {
      const perf = conceptPerformance[cId];
      const testScore = Math.round((perf.correct / perf.total) * 100);
      const prev = previousConceptMastery[cId] ?? 50;

      let updated;
      if (testType === 'Diagnostic Assessment') {
        updated = testScore;
      } else {
        updated = Math.min(100, Math.max(0, Math.round(prev * 0.40 + testScore * 0.60)));
      }
      updatedConceptMastery[cId] = updated;

      const delta = updated - prev;
      let statusLabel = 'Steady';
      if (prev < 60 && updated >= 60) {
        statusLabel = 'Resolved Gap! 🎉';
      } else if (delta > 10) {
        statusLabel = 'Rapid Progress 🚀';
      } else if (delta > 0) {
        statusLabel = 'Improving 📈';
      } else if (delta < 0) {
        statusLabel = 'Needs Reinforcement ⚠️';
      }

      conceptDeltas.push({
        conceptId: cId,
        conceptName: CONCEPTS[cId]?.name || cId,
        previousMastery: prev,
        newMastery: updated,
        delta: (delta >= 0 ? `+${delta}%` : `${delta}%`),
        numericDelta: delta,
        testAccuracy: testScore,
        questionsCount: perf.total,
        status: statusLabel
      });
    });

    const previousOverallMastery = student.overallMastery || 0;
    const allMasteries = Object.values(updatedConceptMastery);
    const newOverallMastery = Math.round(
      allMasteries.reduce((a, b) => a + b, 0) / (allMasteries.length || 1)
    );
    const overallDelta = newOverallMastery - previousOverallMastery;

    const previousGaps = student.criticalGaps || [];
    const newCriticalGaps = Object.keys(updatedConceptMastery).filter(
      cId => updatedConceptMastery[cId] < 60
    );

    const resolvedGaps = previousGaps.filter(g => !newCriticalGaps.includes(g));
    const persistentGaps = previousGaps.filter(g => newCriticalGaps.includes(g));
    const newlyIdentifiedGaps = newCriticalGaps.filter(g => !previousGaps.includes(g));

    let rootPrerequisiteBottleneck = null;
    for (const gapId of newCriticalGaps) {
      const prereqs = CONCEPTS[gapId]?.prerequisites || [];
      const failingPrereq = prereqs.find(pId => newCriticalGaps.includes(pId));
      if (failingPrereq) {
        rootPrerequisiteBottleneck = failingPrereq;
        break;
      } else if (!rootPrerequisiteBottleneck) {
        rootPrerequisiteBottleneck = gapId;
      }
    }

    const incorrectAnswers = answers.filter(a => !a.isCorrect);
    const cognitiveDiagnoses = [];

    incorrectAnswers.forEach(ans => {
      const concept = CONCEPTS[ans.conceptId];
      const selectedText = ans.options ? ans.options[ans.studentAnswerIndex] : 'Chosen Option';
      const correctText = ans.options ? ans.options[ans.correctIndex] : 'Correct Option';

      let trapTitle = 'Conceptual Misapplication';
      let trapExplanation = ans.misconceptionAnalysis || ans.explanation || 'Distractor option selected.';
      let remedy = 'Double-check inverse mathematical operations.';

      const qText = (ans.question || '').toLowerCase();
      if (qText.includes('factor') || ans.conceptId === 'c4') {
        trapTitle = 'Binomial Sign / Factoring Trap';
        remedy = 'Multiply the outer and inner terms of your binomial factors to verify they reconstruct the middle coefficient.';
      } else if (qText.includes('pemdas') || qText.includes('order of operations') || ans.conceptId === 'c1') {
        trapTitle = 'Precedence Hierarchy Slip';
        remedy = 'Execute all multiplication and division before performing any addition or subtraction.';
      } else if (qText.includes('inequality') || qText.includes('≤') || qText.includes('≥')) {
        trapTitle = 'Inequality Negative Inversion Trap';
        remedy = 'Always flip the direction of the inequality (≤ becomes ≥) when dividing by a negative number.';
      } else if (qText.includes('vertex') || ans.conceptId === 'c6') {
        trapTitle = 'Vertex Sign Inversion Error';
        remedy = 'In vertex form y = a(x - h)² + k, the horizontal vertex coordinate has the opposite sign: (h, k).';
      }

      cognitiveDiagnoses.push({
        questionId: ans.questionId,
        conceptId: ans.conceptId,
        conceptName: concept?.name || 'Algebra',
        question: ans.question,
        selectedOption: selectedText,
        correctOption: correctText,
        trapTitle,
        trapExplanation,
        remedy
      });
    });

    let learningVelocity = 'Steady';
    if (weightedScore >= 80 && avgTimePerQuestion <= 25) {
      learningVelocity = 'Accelerating 🚀';
    } else if (weightedScore >= 75) {
      learningVelocity = 'Steady';
    } else if (avgTimePerQuestion > 45 && weightedScore >= 60) {
      learningVelocity = 'Deliberate & Methodical';
    } else {
      learningVelocity = 'Needs Support';
    }

    let status = 'On Track';
    if (newCriticalGaps.length >= 2 || newOverallMastery < 55) {
      status = 'Needs Intervention';
    } else if (newOverallMastery >= 85) {
      status = 'Mastering';
    }

    const strengthsList = conceptDeltas
      .filter(d => d.newMastery >= 70 || d.numericDelta > 15)
      .map(d => `${d.conceptName} (${d.newMastery}% mastery)`);

    const focusList = newCriticalGaps.map(g => CONCEPTS[g]?.name || g);

    const prescription = {
      summary: overallDelta >= 0
        ? `Impressive progress! Student gained ${overallDelta >= 0 ? '+' : ''}${overallDelta}% overall mastery during this assessment.`
        : `Diagnostic assessment complete. Baseline calibrated across foundational competencies.`,
      strengths: strengthsList.length > 0 ? strengthsList : ['Arithmetic Fundamentals'],
      focusAreas: focusList.length > 0 ? focusList : ['Advanced Polynomial Analysis'],
      recommendedAction: rootPrerequisiteBottleneck 
        ? `Focus next sprint on ${CONCEPTS[rootPrerequisiteBottleneck]?.name || rootPrerequisiteBottleneck} to resolve the critical bottleneck unlocking higher-level units.`
        : 'Continue to advanced non-linear algebra and polynomial functions.',
      mentorInsight: resolvedGaps.length > 0 
        ? `Student successfully overcame ${resolvedGaps.map(g => CONCEPTS[g]?.name || g).join(', ')}. Readiness to tackle downstream topics increased.`
        : `Student is calibrating baseline performance. Recommended to assign targeted remedial practice for ${newCriticalGaps.map(g => CONCEPTS[g]?.name || g).join(', ')}.`
    };

    const evaluation = {
      score: weightedScore,
      rawAccuracy,
      grade,
      previousOverallMastery,
      newOverallMastery,
      overallDelta: (overallDelta >= 0 ? `+${overallDelta}%` : `${overallDelta}%`),
      numericDelta: overallDelta,
      avgTimePerQuestion,
      learningVelocity,
      conceptDeltas,
      cognitiveDiagnoses,
      resolvedGaps: resolvedGaps.map(g => CONCEPTS[g]?.name || g),
      persistentGaps: persistentGaps.map(g => CONCEPTS[g]?.name || g),
      newlyIdentifiedGaps: newlyIdentifiedGaps.map(g => CONCEPTS[g]?.name || g),
      rootPrerequisiteBottleneck,
      rootBottleneckName: rootPrerequisiteBottleneck ? CONCEPTS[rootPrerequisiteBottleneck]?.name : null,
      prescription
    };

    const updatedStudent = {
      ...student,
      initialTestTaken: true,
      overallMastery: newOverallMastery,
      conceptMastery: updatedConceptMastery,
      criticalGaps: newCriticalGaps,
      rootPrerequisiteBottleneck,
      status,
      learningVelocity,
      testsTaken: (student.testsTaken || 0) + 1,
      lastActive: new Date().toLocaleDateString()
    };

    const submissionRecord = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      studentId: student.id,
      studentName: student.name,
      testType,
      title: title || `${testType} - ${new Date().toLocaleDateString()}`,
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      score: weightedScore,
      rawAccuracy,
      totalQuestions,
      correctCount,
      durationMinutes: Math.max(1, durationMinutes || Math.round(totalTimeSeconds / 60)),
      difficultyReached: answers[answers.length - 1]?.difficulty?.toUpperCase() || 'MEDIUM',
      answers,
      evaluation
    };

    return {
      evaluation,
      student: updatedStudent,
      submission: submissionRecord
    };
  }
};
