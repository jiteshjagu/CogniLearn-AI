import React, { useState } from 'react';
import { 
  Milestone, 
  BookOpen, 
  HelpCircle, 
  Flame, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Sparkles, 
  X,
  ExternalLink,
  Award,
  ArrowRight
} from 'lucide-react';
import { SUBJECTS_MAP } from '../../../data/subjectRegistry';

/**
 * Personalized Learning Path Component
 * Milestone-based roadmap dynamically generated from the Knowledge Gap data.
 * Each milestone references the specific gap it addresses.
 */
export const PersonalizedLearningRoadmap = ({ 
  milestones = [], 
  onToggleCompletion, 
  onStartMicroQuiz,
  onStartPractice,
  selectedSubjectId = 'all'
}) => {
  const [activeReading, setActiveReading] = useState(null);

  // Empty State: explicitly handled when there are no detected gaps
  if (!milestones || milestones.length === 0) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-indigo-600 rounded-full" />
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            3. Personalized Learning Path
          </h2>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 border-2 border-emerald-200/80 rounded-3xl p-8 sm:p-10 text-center shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 mb-4 animate-bounce">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            You're Completely On Track! 🎉
          </h3>
          <p className="text-sm text-slate-600 max-w-lg mx-auto mt-2 leading-relaxed">
            No active knowledge gaps detected across your enrolled curriculum. All prerequisite foundations and analytical skills meet or exceed target mastery thresholds.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-white border border-emerald-200 text-xs font-bold text-emerald-800 shadow-2xs">
              ✓ All Foundational Bottlenecks Cleared
            </div>
            <div className="px-4 py-2 rounded-xl bg-white border border-emerald-200 text-xs font-bold text-emerald-800 shadow-2xs">
              ✓ High Retention Velocity Maintained
            </div>
          </div>
        </div>
      </section>
    );
  }

  const completedCount = milestones.filter(m => m.isCompleted).length;
  const progressPercent = Math.round((completedCount / milestones.length) * 100);

  return (
    <section className="space-y-4">
      
      {/* Header & Roadmap Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 bg-indigo-600 rounded-full" />
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              3. Personalized Learning Path
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {completedCount} of {milestones.length} Completed
            </span>
          </div>
          <p className="text-xs text-slate-500 ml-4 mt-0.5">
            Sequential mastery roadmap generated directly from your detected conceptual gaps
          </p>
        </div>

        {/* Mini progress tracker */}
        <div className="flex items-center gap-3 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold text-slate-700">Roadmap Progress:</span>
          <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-indigo-600">{progressPercent}%</span>
        </div>
      </div>

      {/* Roadmap Timeline / Milestone Cards */}
      <div className="space-y-4 relative">
        {/* Vertical decorative connecting line */}
        <div className="hidden sm:block absolute left-6 top-8 bottom-8 w-0.5 bg-slate-200 -z-1" />

        {milestones.map((ms, index) => {
          const subject = SUBJECTS_MAP[ms.subjectId] || SUBJECTS_MAP.mathematics;
          const isDone = ms.isCompleted;

          return (
            <div
              key={ms.id}
              className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 relative ${
                isDone 
                  ? 'border-emerald-200/80 bg-emerald-50/20' 
                  : 'border-slate-200/90 hover:border-indigo-300 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                
                {/* Milestone Step Number Pill & Completion Checkbox */}
                <div className="flex items-center sm:flex-col gap-2 shrink-0">
                  <button
                    onClick={() => onToggleCompletion && onToggleCompletion(ms.id)}
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200'
                    }`}
                    title={isDone ? 'Mark as Incomplete' : 'Mark as Completed'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="text-xs font-black font-mono">0{index + 1}</span>
                    )}
                  </button>

                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    isDone ? 'text-emerald-700' : 'text-slate-400'
                  }`}>
                    {isDone ? 'Complete' : 'Sprint'}
                  </span>
                </div>

                {/* Milestone Content */}
                <div className="flex-1 space-y-3">
                  
                  {/* Top Meta Line: Strictly referencing the Knowledge Gap */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${subject.colorToken.badge}`}>
                      {subject.label}
                    </span>
                    <span className="text-xs font-bold text-slate-400">Addressing Gap:</span>
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      {ms.gapSubtopic}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase ${
                      ms.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {ms.severity === 'critical' ? 'Critical' : 'Needs Review'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className={`text-base font-bold tracking-tight ${
                    isDone ? 'text-slate-600 line-through' : 'text-slate-900'
                  }`}>
                    {ms.title}
                  </h3>

                  {/* Action Cards Row: 1. Recommended Reading, 2. Micro-Quiz, 3. Targeted Practice */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                    
                    {/* 1. Recommended Reading */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col justify-between hover:bg-blue-50/40 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-blue-600 text-xs font-bold">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Recommended Reading</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                          {ms.recommendedReading.title}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {ms.recommendedReading.summary}
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveReading(ms.recommendedReading)}
                        className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 self-start"
                      >
                        <span>Read Lesson ({ms.recommendedReading.estimatedMinutes}m)</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* 2. Micro-Quiz Action */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col justify-between hover:bg-emerald-50/40 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Micro-Quiz Assessment</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                          {ms.microQuiz.title}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {ms.microQuiz.questionCount} adaptive validation questions
                        </p>
                      </div>
                      <button
                        onClick={() => onStartMicroQuiz && onStartMicroQuiz(ms)}
                        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs self-start transition-colors"
                      >
                        <span>{ms.microQuiz.actionLabel}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* 3. Targeted Practice Module Action */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col justify-between hover:bg-purple-50/40 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-purple-600 text-xs font-bold">
                          <Flame className="w-3.5 h-3.5 text-amber-500" />
                          <span>Targeted Practice Drill</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                          {ms.practiceModule.title}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {ms.practiceModule.problemCount} with instant hints
                        </p>
                      </div>
                      <button
                        onClick={() => onStartPractice && onStartPractice(ms)}
                        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-2xs self-start transition-colors"
                      >
                        <span>{ms.practiceModule.actionLabel}</span>
                        <Sparkles className="w-3 h-3 text-amber-300" />
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Reading Modal */}
      {activeReading && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-blue-600">
                <BookOpen className="w-5 h-5" />
                <h4 className="font-bold text-sm text-slate-900">{activeReading.title}</h4>
              </div>
              <button
                onClick={() => setActiveReading(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-700 leading-relaxed space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <p className="font-medium text-slate-900 bg-blue-50 p-3 rounded-xl border border-blue-100">
                {activeReading.summary}
              </p>
              <h5 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-slate-500">Core Principles:</h5>
              <p>
                1. Always identify the governing axioms before manipulating equations or formulas.
              </p>
              <p>
                2. Test boundary conditions and sign changes carefully during intermediate steps.
              </p>
              <p>
                3. Re-verify solutions by back-substituting into original conditions.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveReading(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
