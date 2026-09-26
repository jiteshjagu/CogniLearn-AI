import React from 'react';
import { 
  Award, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw, 
  BookOpen, 
  Unlock, 
  Zap, 
  Layers,
  ChevronRight,
  ShieldCheck,
  Brain
} from 'lucide-react';
import { CONCEPTS, CONCEPT_LIST } from '../../data/conceptsData';

export const UpdatedRecommendationsView = ({ 
  student, 
  latestSubmission, 
  onRestartCycle, 
  onStartAnotherQuiz,
  onViewAllLessons
}) => {
  const conceptMastery = student.conceptMastery || {};
  const criticalGaps = student.criticalGaps || [];
  const rootBottleneck = student.rootPrerequisiteBottleneck;

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      
      {/* Celebration Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Cycle Complete: Recommendations Updated</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Continuous Learning Profile Recalibrated!
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
              Your test performance has been ingested into the continuous Bayesian knowledge model. Mastery levels and prerequisite unlock paths have dynamically updated.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-blue-200">Latest Quiz Score</div>
              <div className="text-3xl font-black text-white mt-0.5">{latestSubmission?.score || 80}%</div>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-blue-200">New Overall Mastery</div>
              <div className="text-3xl font-black text-amber-300 mt-0.5">{student.overallMastery}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recalibrated Mastery Radar / Meters */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>Updated Concept-Level Mastery Vector</span>
            </h3>
            <p className="text-xs text-slate-500">Continuous skill growth measured after adaptive assessments</p>
          </div>

          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
            {student.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONCEPT_LIST.map(concept => {
            const mastery = conceptMastery[concept.id] || 0;
            const isResolved = !criticalGaps.includes(concept.id) && mastery >= 60;
            const isCritical = criticalGaps.includes(concept.id);

            return (
              <div
                key={concept.id}
                className={`p-4 rounded-xl border transition-all ${
                  isResolved && mastery >= 75
                    ? 'bg-emerald-50/30 border-emerald-200'
                    : isCritical
                      ? 'bg-red-50/30 border-red-200'
                      : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900 truncate" title={concept.name}>
                    {concept.name}
                  </span>
                  <span className={`text-xs font-black px-2 py-0.5 rounded ${
                    mastery >= 75
                      ? 'bg-emerald-100 text-emerald-800'
                      : mastery >= 50
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {mastery}%
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      mastery >= 75 ? 'bg-emerald-500' : mastery >= 50 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${mastery}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{concept.category}</span>
                  {isResolved ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="text-red-600 font-bold">Needs Focus</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Dynamic Next-Step Action Recommendations */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Dynamically Generated Next Steps</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Recommendation 1 */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">
              <Unlock className="w-3.5 h-3.5" />
              <span>Downstream Concept Unlocked</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Progress to: Quadratic Equations & Roots
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              With prerequisite factoring skills reinforced, you now possess the algebraic foundation to solve 2nd-degree trinomials using factoring and the quadratic formula.
            </p>
            <button
              onClick={() => onStartAnotherQuiz('c5')}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              <span>Launch Quiz on Quadratic Equations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Recommendation 2 */}
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wide mb-1">
              <Brain className="w-3.5 h-3.5" />
              <span>Mastery Challenge Ready</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Advanced Parabolic Graphing & Vertex Optimization
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Challenge yourself with coordinate geometry problems, finding vertex maxima and minima for projectile physics curves.
            </p>
            <button
              onClick={() => onStartAnotherQuiz('c6')}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-800"
            >
              <span>Explore Hard-Tier Graphing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Cycle Navigation Bottom Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 text-white">
        <div>
          <h4 className="text-sm font-bold">Adaptive Learning Cycle Completed</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            You can rerun the diagnostic, take another adaptive quiz, or explore dynamic lessons.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRestartCycle}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Diagnostic</span>
          </button>

          <button
            onClick={onViewAllLessons}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <span>Return to Learning Path</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
