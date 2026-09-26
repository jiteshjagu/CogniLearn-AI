import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Sparkles,
  BarChart,
  ShieldAlert
} from 'lucide-react';
import { QUESTION_BANK, DIAGNOSTIC_QUESTION_IDS } from '../../data/questionBank';
import { CONCEPTS } from '../../data/conceptsData';

export const DiagnosticAssessment = ({ student, onCompleteDiagnostic }) => {
  // Filter questions for the diagnostic test
  const diagnosticQuestions = DIAGNOSTIC_QUESTION_IDS
    .map(id => QUESTION_BANK.find(q => q.id === id))
    .filter(Boolean);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [questionTimes, setQuestionTimes] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQ = diagnosticQuestions[currentIndex];
  const totalQ = diagnosticQuestions.length;
  const isLastQuestion = currentIndex === totalQ - 1;
  const answeredCount = Object.keys(selectedAnswers).length;

  useEffect(() => {
    setQuestionStartTime(Date.now());
    setShowHint(false);
  }, [currentIndex]);

  const handleSelectOption = (optionIndex) => {
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - questionStartTime) / 1000));
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIndex
    }));
    setQuestionTimes(prev => ({
      ...prev,
      [currentQ.id]: (prev[currentQ.id] || 0) + elapsedSeconds
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQ - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Compile comprehensive answer log
    const answersPayload = diagnosticQuestions.map(q => {
      const studentAnswerIndex = selectedAnswers[q.id] ?? -1;
      const isCorrect = studentAnswerIndex === q.correctIndex;
      const timeSpent = questionTimes[q.id] || 15;

      return {
        questionId: q.id,
        conceptId: q.conceptId,
        conceptName: CONCEPTS[q.conceptId]?.name || 'Algebra',
        difficulty: q.difficulty,
        question: q.question,
        options: q.options,
        studentAnswerIndex,
        correctIndex: q.correctIndex,
        isCorrect,
        timeSpentSeconds: timeSpent,
        explanation: q.explanation
      };
    });

    setTimeout(() => {
      onCompleteDiagnostic(answersPayload);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto py-4">
      
      {/* Test Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
              Stage 1: Calibration
            </span>
            <h2 className="text-lg font-bold text-slate-900">Baseline Diagnostic Assessment</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluates foundational skills across 7 concepts to detect knowledge gaps and prerequisite bottlenecks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Progress</div>
            <div className="text-sm font-black text-blue-600">{answeredCount} of {totalQ} Answered</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-200">
            {Math.round((answeredCount / totalQ) * 100)}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-1.5 mb-6 overflow-hidden">
        <div 
          className="bg-blue-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalQ) * 100}%` }}
        />
      </div>

      {/* Active Question Card */}
      {currentQ && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 animate-in fade-in duration-150">
          
          {/* Question Metadata */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">
                Question {currentIndex + 1} / {totalQ}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                {CONCEPTS[currentQ.conceptId]?.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                currentQ.difficulty === 'hard'
                  ? 'bg-purple-100 text-purple-700'
                  : currentQ.difficulty === 'medium'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-emerald-100 text-emerald-700'
              }`}>
                {currentQ.difficulty} Tier
              </span>
            </div>
          </div>

          {/* Question Prompt */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-6">
            {currentQ.question}
          </h3>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentQ.id] === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between text-xs sm:text-sm font-semibold ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Hint Expander */}
          <div className="mb-6">
            {!showHint ? (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Need a conceptual hint?</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Pedagogical Hint: </strong>
                  {currentQ.hint}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Bottom Controls */}
          <div className="flex items-center justify-between pt-5 border-t border-slate-100">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={handlePrev}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {!isLastQuestion ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQ.id] === undefined}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || answeredCount < totalQ}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Analyzing Knowledge State...</span>
                  ) : (
                    <>
                      <span>Complete Diagnostic & Analyze Gaps</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Quick Jump Dot Palette */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {diagnosticQuestions.map((q, idx) => {
          const isAnswered = selectedAnswers[q.id] !== undefined;
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                isCurrent
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                  : isAnswered
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-white border border-slate-200 text-slate-400'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

    </div>
  );
};
