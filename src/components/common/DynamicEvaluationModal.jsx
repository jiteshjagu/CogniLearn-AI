import React from 'react';
import { 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Zap, 
  ShieldCheck, 
  Brain, 
  BookOpen, 
  Target,
  X
} from 'lucide-react';
import { CONCEPTS } from '../../data/conceptsData';

export const DynamicEvaluationModal = ({ 
  isOpen, 
  onClose, 
  evaluation, 
  student, 
  testTitle = 'Assessment Evaluation Report',
  onProceed
}) => {
  if (!isOpen || !evaluation) return null;

  const {
    score = 0,
    rawAccuracy = 0,
    grade = 'Proficient',
    previousOverallMastery = 0,
    newOverallMastery = 0,
    overallDelta = '+0%',
    numericDelta = 0,
    avgTimePerQuestion = 15,
    learningVelocity = 'Steady',
    conceptDeltas = [],
    cognitiveDiagnoses = [],
    resolvedGaps = [],
    persistentGaps = [],
    rootPrerequisiteBottleneck = null,
    rootBottleneckName = null,
    prescription = {}
  } = evaluation;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close evaluation report"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Dynamic Result Evaluation</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-900">
              {grade}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {testTitle}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
            Continuous Bayesian performance analysis for <strong className="text-white">{student?.name}</strong>. Real-time mastery deltas and cognitive misconception tracking calibrated.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <div className="text-[10px] uppercase font-bold text-blue-200">Weighted Score</div>
              <div className="text-2xl font-black text-white mt-0.5">{score}%</div>
              <div className="text-[10px] text-blue-200">{rawAccuracy}% raw accuracy</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <div className="text-[10px] uppercase font-bold text-blue-200">Overall Mastery</div>
              <div className="text-2xl font-black text-amber-300 mt-0.5 flex items-center gap-1">
                <span>{newOverallMastery}%</span>
                <span className="text-xs font-bold text-emerald-300">
                  ({overallDelta})
                </span>
              </div>
              <div className="text-[10px] text-blue-200">From {previousOverallMastery}%</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <div className="text-[10px] uppercase font-bold text-blue-200">Learning Velocity</div>
              <div className="text-sm font-black text-white mt-1.5 truncate">
                {learningVelocity}
              </div>
              <div className="text-[10px] text-blue-200">{avgTimePerQuestion}s avg / question</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <div className="text-[10px] uppercase font-bold text-blue-200">Gap Resolution</div>
              <div className="text-sm font-black text-emerald-300 mt-1.5 truncate">
                {resolvedGaps.length > 0 ? `${resolvedGaps.length} Resolved! 🎉` : 'In Calibration'}
              </div>
              <div className="text-[10px] text-blue-200">{persistentGaps.length} gaps remaining</div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          
          {/* Section 1: Concept Mastery Growth & Deltas */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Concept Progress & Mastery Recalibration</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Real-time shift in mathematical competency vectors calculated after this assessment.
            </p>

            <div className="space-y-3">
              {conceptDeltas.map(d => (
                <div key={d.conceptId} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="w-48 sm:w-60 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{d.conceptName}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        d.status.includes('Resolved')
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : d.numericDelta > 0
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {d.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {d.questionsCount} tested • {d.testAccuracy}% accuracy
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex-1 max-w-md">
                    <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                      <span className="text-slate-500">Prior: {d.previousMastery}%</span>
                      <span className="text-slate-900 font-extrabold flex items-center gap-1">
                        Now: {d.newMastery}%
                        <span className={d.numericDelta >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                          ({d.delta})
                        </span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          d.newMastery >= 75 ? 'bg-emerald-500' : d.newMastery >= 60 ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${d.newMastery}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Cognitive Misconception Diagnosis */}
          {cognitiveDiagnoses.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Cognitive Misconceptions Detected ({cognitiveDiagnoses.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                The adaptive engine identified the exact conceptual traps that caused incorrect responses.
              </p>

              <div className="space-y-3">
                {cognitiveDiagnoses.map((diag, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 text-[11px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{diag.trapTitle}</span>
                        <span className="text-[10px] text-amber-700 font-semibold px-2 py-0.5 rounded bg-amber-100">
                          {diag.conceptName}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-800 font-medium mb-3 italic">
                      "{diag.question}"
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                      <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-start gap-1.5">
                        <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-[10px] uppercase block">Selected Distractor:</span>
                          <span>{diag.selectedOption}</span>
                        </div>
                      </div>

                      <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-start gap-1.5">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-[10px] uppercase block">Correct Answer:</span>
                          <span>{diag.correctOption}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-amber-200 text-xs text-slate-700 space-y-1">
                      <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-amber-600" />
                        <span>Cognitive Trap Analysis:</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed text-[11px]">
                        {diag.trapExplanation}
                      </p>
                      <div className="mt-1 pt-1 border-t border-slate-100 text-[11px] text-emerald-700 font-semibold">
                        💡 Key Rule: {diag.remedy}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: AI Pedagogical Prescription */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-2xl border border-indigo-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>AI Pedagogical Prescription & Action Plan</span>
            </h3>
            <p className="text-xs text-indigo-800/80 mb-3">
              {prescription.summary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
              <div className="bg-white/80 p-3 rounded-xl border border-indigo-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1 mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Demonstrated Strengths
                </span>
                <ul className="space-y-1 text-slate-700 text-[11px]">
                  {(prescription.strengths || []).map((s, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/80 p-3 rounded-xl border border-indigo-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1 mb-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-600" /> Priority Remedial Focus
                </span>
                <ul className="space-y-1 text-slate-700 text-[11px]">
                  {(prescription.focusAreas || []).map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-600 text-white text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-200 shrink-0" />
                <span className="font-medium text-[11px]">
                  <strong className="font-bold text-white">Recommended Next Step:</strong> {prescription.recommendedAction}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:px-6 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Evaluation archived to student portfolio & synced with Academic Mentor.
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
            >
              Close Report
            </button>
            {onProceed && (
              <button
                onClick={() => {
                  onClose();
                  onProceed();
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors"
              >
                <span>Proceed to Next Stage</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
