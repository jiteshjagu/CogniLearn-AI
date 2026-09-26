import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  Play, 
  Brain, 
  ChevronRight, 
  HelpCircle,
  Clock,
  Layers,
  Zap,
  RotateCcw
} from 'lucide-react';
import { CONCEPTS, CONCEPT_LESSONS } from '../../data/conceptsData';
import { AdaptiveEngine } from '../../services/adaptiveEngine';
import { AiTutorService } from '../../services/aiTutorService';

export const PersonalizedLearningPath = ({ student, onStartAdaptiveQuiz }) => {
  const learningPath = AdaptiveEngine.generatePersonalizedLearningPath(student);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [aiExplanationStyle, setAiExplanationStyle] = useState('standard'); // 'standard' | 'eli5'
  const [customAiText, setCustomAiText] = useState(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const activeModule = learningPath[activeStepIndex] || learningPath[0];
  const concept = CONCEPTS[activeModule?.conceptId];
  const lesson = CONCEPT_LESSONS[activeModule?.conceptId];

  const handleRequestAiExplanation = async (style) => {
    setIsLoadingAi(true);
    setAiExplanationStyle(style);
    try {
      const text = await AiTutorService.explainConcept(activeModule.conceptId, style);
      setCustomAiText(text);
    } catch {
      setCustomAiText('Failed to generate AI explanation. Please check connection or try again.');
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
              Stage 3: Targeted Remediation
            </span>
            <h2 className="text-xl font-bold text-slate-900">Dynamic Personalized Learning Path</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Path sequenced dynamically based on prerequisite dependencies and your detected knowledge gaps.
          </p>
        </div>

        <button
          onClick={() => onStartAdaptiveQuiz(activeModule.conceptId)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all shrink-0"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Launch Adaptive Quiz on {activeModule.title}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Dynamic Path Stepper */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              Sequenced Modules ({learningPath.length})
            </h3>
            <span className="text-[10px] font-semibold text-slate-400">Topological Sort</span>
          </div>

          <div className="space-y-2.5">
            {learningPath.map((item, idx) => {
              const isActive = idx === activeStepIndex;
              const isUrgent = item.status === 'urgent_gap';
              const isMastered = item.status === 'mastered';

              return (
                <div
                  key={item.conceptId}
                  onClick={() => {
                    setActiveStepIndex(idx);
                    setCustomAiText(null);
                  }}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    isActive
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                      : isUrgent
                        ? 'border-red-200 bg-red-50/20 hover:border-red-300'
                        : isMastered
                          ? 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-300'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      isUrgent
                        ? 'bg-red-100 text-red-700'
                        : isMastered
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.priority}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      ~{item.estimatedMinutes}m
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {item.stepNumber}. {item.title}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span>Mastery: <strong>{item.mastery}%</strong></span>
                    <span className="text-indigo-600 font-semibold flex items-center gap-0.5">
                      <span>Study</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Learning Module & Interactive AI Tutor Content */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs lg:col-span-2 space-y-6">
          
          {/* Module Banner */}
          <div className="pb-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  {concept?.category}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Est. {activeModule?.estimatedMinutes} min
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">{lesson?.title || activeModule?.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{lesson?.summary}</p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleRequestAiExplanation('eli5')}
                disabled={isLoadingAi}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors"
                title="Explain like I am 10 with everyday analogy"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>Explain Simply (ELI10)</span>
              </button>

              <button
                type="button"
                onClick={() => handleRequestAiExplanation('standard')}
                disabled={isLoadingAi}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
                title="Deep dive mathematical guide"
              >
                <Brain className="w-3.5 h-3.5 text-indigo-600" />
                <span>AI Breakdown</span>
              </button>
            </div>
          </div>

          {/* AI Custom Generated Section (if toggled) */}
          {customAiText && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-blue-50/50 border-2 border-indigo-200/80 shadow-xs animate-in fade-in duration-150">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
                    {aiExplanationStyle === 'eli5' ? 'AI Simplified Intuition (ELI10)' : 'AI Pedagogical Explainer'}
                  </span>
                </div>
                <button
                  onClick={() => setCustomAiText(null)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600"
                >
                  Dismiss
                </button>
              </div>

              <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                {customAiText}
              </div>
            </div>
          )}

          {/* Key Takeaways */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Core Conceptual Principles
            </h4>
            <div className="space-y-2">
              {(lesson?.keyTakeaways || []).map((point, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    {i + 1}
                  </span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Formula Card */}
          {lesson?.visualFormula && (
            <div className="p-4 rounded-xl bg-slate-900 text-white shadow-xs">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                Mathematical Model & Working Law
              </div>
              <div className="font-mono text-base sm:text-lg font-bold text-amber-300 py-1">
                {lesson.visualFormula}
              </div>
            </div>
          )}

          {/* Step-by-Step Explanation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Worked Proof & Guided Steps
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 whitespace-pre-line font-mono leading-relaxed">
              {lesson?.explanation}
            </div>
          </div>

          {/* Quick Practice Prompt */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
                Instant Check for Understanding
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                {lesson?.practicePrompt}
              </div>
            </div>

            <button
              onClick={() => onStartAdaptiveQuiz(activeModule.conceptId)}
              className="shrink-0 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Test with Adaptive Quiz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
