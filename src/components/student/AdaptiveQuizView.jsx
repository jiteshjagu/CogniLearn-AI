import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  HelpCircle, 
  RotateCcw,
  Gauge,
  Clock,
  ShieldCheck,
  Brain
} from 'lucide-react';
import { CONCEPTS } from '../../data/conceptsData';
import { AdaptiveEngine } from '../../services/adaptiveEngine';
import { AiTutorService } from '../../services/aiTutorService';

export const AdaptiveQuizView = ({ student, targetConceptId = 'c4', onCompleteQuiz }) => {
  const concept = CONCEPTS[targetConceptId] || CONCEPTS['c4'];
  const maxQuestions = 5;

  // Adaptive Quiz Session State
  const [currentDifficulty, setCurrentDifficulty] = useState('medium');
  const [answeredIds, setAnsweredIds] = useState([]);
  const [sessionAnswers, setSessionAnswers] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [adaptiveNotification, setAdaptiveNotification] = useState('Calibrating initial difficulty to MEDIUM');
  
  // Single Question Interaction State
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [aiMistakeExplanation, setAiMistakeExplanation] = useState(null);
  const [isLoadingMistakeAi, setIsLoadingMistakeAi] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveIncorrect, setConsecutiveIncorrect] = useState(0);

  // Load first question on mount or concept change
  useEffect(() => {
    fetchNextQuestion('medium', [], null, 0, 0);
  }, [targetConceptId]);

  const fetchNextQuestion = (difficulty, alreadyAnswered, lastCorrect, numCorr, numIncorr) => {
    const nextQResult = AdaptiveEngine.getNextAdaptiveQuestion({
      conceptId: targetConceptId,
      currentDifficulty: difficulty,
      answeredIds: alreadyAnswered,
      lastAnswerCorrect: lastCorrect,
      consecutiveCorrect: numCorr,
      consecutiveIncorrect: numIncorr
    });

    if (nextQResult) {
      setActiveQuestion(nextQResult.question);
      setCurrentDifficulty(nextQResult.difficulty);
      setAdaptiveNotification(nextQResult.adaptiveTriggerReason);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setAiMistakeExplanation(null);
      setQuestionStartTime(Date.now());
    } else {
      // Quiz finished or bank exhausted
      finishQuiz(sessionAnswers);
    }
  };

  const handleSelectOption = (idx) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleCheckAnswer = async () => {
    if (selectedOption === null || !activeQuestion) return;

    const isCorrect = selectedOption === activeQuestion.correctIndex;
    const timeSpent = Math.max(1, Math.round((Date.now() - questionStartTime) / 1000));

    const answerRecord = {
      questionId: activeQuestion.id,
      conceptId: activeQuestion.conceptId,
      conceptName: concept.name,
      difficulty: activeQuestion.difficulty,
      question: activeQuestion.question,
      options: activeQuestion.options,
      studentAnswerIndex: selectedOption,
      correctIndex: activeQuestion.correctIndex,
      isCorrect,
      timeSpentSeconds: timeSpent,
      explanation: activeQuestion.explanation
    };

    const newAnswers = [...sessionAnswers, answerRecord];
    const newAnsweredIds = [...answeredIds, activeQuestion.id];
    setSessionAnswers(newAnswers);
    setAnsweredIds(newAnsweredIds);
    setIsAnswerSubmitted(true);

    const newCorr = isCorrect ? consecutiveCorrect + 1 : 0;
    const newIncorr = !isCorrect ? consecutiveIncorrect + 1 : 0;
    setConsecutiveCorrect(newCorr);
    setConsecutiveIncorrect(newIncorr);

    // If incorrect, fetch AI mistake breakdown
    if (!isCorrect) {
      setIsLoadingMistakeAi(true);
      try {
        const studentChosenText = activeQuestion.options[selectedOption];
        const correctText = activeQuestion.options[activeQuestion.correctIndex];
        const breakdown = await AiTutorService.explainMistake(activeQuestion, studentChosenText, correctText);
        setAiMistakeExplanation(breakdown);
      } catch {
        setAiMistakeExplanation(null);
      } finally {
        setIsLoadingMistakeAi(false);
      }
    }
  };

  const handleNextAdaptiveStep = () => {
    if (sessionAnswers.length >= maxQuestions) {
      finishQuiz(sessionAnswers);
    } else {
      const lastAnswer = sessionAnswers[sessionAnswers.length - 1];
      fetchNextQuestion(
        currentDifficulty,
        answeredIds,
        lastAnswer.isCorrect,
        consecutiveCorrect,
        consecutiveIncorrect
      );
    }
  };

  const finishQuiz = (answers) => {
    const totalScore = Math.round(
      (answers.filter(a => a.isCorrect).length / (answers.length || 1)) * 100
    );

    if (totalScore >= 60) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore if blocked
      }
    }

    const submissionPayload = {
      id: `sub_${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      testType: 'Adaptive Quiz',
      title: `Adaptive Quiz: ${concept.name}`,
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      score: totalScore,
      totalQuestions: answers.length,
      correctCount: answers.filter(a => a.isCorrect).length,
      durationMinutes: Math.max(1, Math.round(answers.reduce((acc, a) => acc + a.timeSpentSeconds, 0) / 60)),
      difficultyReached: currentDifficulty.toUpperCase(),
      answers
    };

    onCompleteQuiz(submissionPayload);
  };

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6">
      
      {/* Adaptive Status & Live Difficulty Gauge Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                Stage 4: Adaptive Testing
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Live Adaptive Quiz: {concept.name}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Difficulty modulates dynamically based on each real-time response.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Question</div>
              <div className="text-sm font-black text-slate-900">
                {sessionAnswers.length + (isAnswerSubmitted ? 0 : 1)} of {maxQuestions}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-200">
              {Math.round((sessionAnswers.length / maxQuestions) * 100)}%
            </div>
          </div>
        </div>

        {/* Live Difficulty Gauge Meter */}
        <div className="mt-4 pt-2">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-600 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-indigo-600" />
              Dynamic Difficulty Level:
            </span>
            <span className={`px-2.5 py-0.5 rounded-full font-black text-xs uppercase tracking-wider ${
              currentDifficulty === 'hard'
                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                : currentDifficulty === 'medium'
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}>
              {currentDifficulty} Tier
            </span>
          </div>

          {/* Stepped Gauge Bar */}
          <div className="grid grid-cols-3 gap-2">
            <div className={`h-2.5 rounded-full transition-all duration-300 ${
              currentDifficulty === 'easy' || currentDifficulty === 'medium' || currentDifficulty === 'hard'
                ? 'bg-emerald-500'
                : 'bg-slate-200'
            }`} />
            <div className={`h-2.5 rounded-full transition-all duration-300 ${
              currentDifficulty === 'medium' || currentDifficulty === 'hard'
                ? 'bg-blue-500'
                : 'bg-slate-200'
            }`} />
            <div className={`h-2.5 rounded-full transition-all duration-300 ${
              currentDifficulty === 'hard'
                ? 'bg-purple-500 shadow-sm shadow-purple-500/40'
                : 'bg-slate-200'
            }`} />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mt-1 px-1">
            <span>Easy (Foundational)</span>
            <span>Medium (Standard)</span>
            <span>Hard (Mastery Challenge)</span>
          </div>

          {/* Adaptive Engine Decision Log Pill */}
          {adaptiveNotification && (
            <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="truncate">
                <strong>Engine State: </strong> {adaptiveNotification}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Active Question Box */}
      {activeQuestion && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 animate-in fade-in duration-150">
          
          {/* Question Prompt */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-6">
            {activeQuestion.question}
          </h3>

          {/* Option Buttons */}
          <div className="space-y-3 mb-6">
            {activeQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === activeQuestion.correctIndex;

              let style = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700';

              if (isAnswerSubmitted) {
                if (isCorrectAnswer) {
                  style = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
                } else if (isSelected && !isCorrectAnswer) {
                  style = 'border-red-500 bg-red-50 text-red-950 font-bold ring-2 ring-red-500/20';
                } else {
                  style = 'border-slate-200 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                style = 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold shadow-xs';
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between text-xs sm:text-sm ${
                    !isAnswerSubmitted ? 'cursor-pointer' : ''
                  } ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isAnswerSubmitted && isCorrectAnswer
                        ? 'bg-emerald-600 text-white'
                        : isAnswerSubmitted && isSelected && !isCorrectAnswer
                          ? 'bg-red-600 text-white'
                          : isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswerSubmitted && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Post-Submit Adaptive Feedback & Cognitive Misconception Breakdown */}
          {isAnswerSubmitted && (
            <div className="space-y-4 pt-4 border-t border-slate-100 animate-in fade-in duration-150">
              
              {selectedOption === activeQuestion.correctIndex ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-sm text-emerald-950">Accurate Response! 🎉</h5>
                    <p className="mt-1 text-emerald-800 leading-relaxed">
                      {activeQuestion.explanation}
                    </p>
                    <div className="mt-2 text-[11px] font-bold text-emerald-700">
                      Adaptive Action: Next question will scale up difficulty to challenge your conceptual depth.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-start gap-2.5">
                  <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h5 className="font-bold text-sm text-red-950">Conceptual Misstep</h5>
                    <p className="mt-1 text-red-800 leading-relaxed">
                      {activeQuestion.explanation}
                    </p>

                    {/* AI Cognitive Breakdown if generated */}
                    {aiMistakeExplanation && (
                      <div className="mt-3 p-3 rounded-lg bg-white/80 border border-red-200 text-slate-700 whitespace-pre-line font-mono text-[11px] leading-relaxed">
                        {aiMistakeExplanation}
                      </div>
                    )}

                    <div className="mt-2 text-[11px] font-bold text-red-700">
                      Adaptive Action: Next question will branch to a foundational reinforcement problem to solidify the underlying rule.
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
            {!isAnswerSubmitted ? (
              <button
                type="button"
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all disabled:opacity-40 disabled:pointer-events-none"
              >
                Submit Answer
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextAdaptiveStep}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <span>
                  {sessionAnswers.length >= maxQuestions ? 'Complete Quiz & View Updated Profile' : 'Continue to Next Adapted Question'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
