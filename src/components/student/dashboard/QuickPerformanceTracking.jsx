import React from 'react';
import { 
  Target, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Award,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { StorageService } from '../../../services/storageService';
import { calculateSubjectProgress, getSubjectById } from '../../../data/subjectRegistry';

export const QuickPerformanceTracking = ({ 
  student, 
  selectedSubjectId = 'all', 
  onTakeAssessment,
  latestSubmission: propLatestSubmission
}) => {
  if (!student) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded-md w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="h-24 bg-slate-100 rounded-2xl"></div>
          <div className="h-24 bg-slate-100 rounded-2xl"></div>
          <div className="h-24 bg-slate-100 rounded-2xl"></div>
          <div className="h-24 bg-slate-100 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  // Fetch student's test history
  const allSubmissions = StorageService.getSubmissionsByStudent(student.id) || [];
  const latestSubmission = propLatestSubmission || allSubmissions[allSubmissions.length - 1] || null;

  // Compute average accuracy across completed tests
  const avgAccuracy = allSubmissions.length > 0
    ? Math.round(allSubmissions.reduce((acc, s) => acc + (s.score || 0), 0) / allSubmissions.length)
    : student.overallMastery || 65;

  const subjectProgress = selectedSubjectId !== 'all' 
    ? calculateSubjectProgress(student, selectedSubjectId)
    : student.overallMastery || 68;

  const activeSubjectMeta = selectedSubjectId !== 'all' ? getSubjectById(selectedSubjectId) : null;

  return (
    <section className="space-y-4">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 bg-blue-600 rounded-full" />
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              1. Quick Performance Tracking
            </h2>
            {activeSubjectMeta && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${activeSubjectMeta.colorToken.badge}`}>
                {activeSubjectMeta.label}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 ml-4 mt-0.5">
            Real-time competency velocity, test accuracy, and latest assessment metrics
          </p>
        </div>

        {onTakeAssessment && (
          <button
            onClick={onTakeAssessment}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Launch Adaptive Quiz</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Metric 1: Overall Mastery */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {selectedSubjectId === 'all' ? 'Overall Mastery' : `${activeSubjectMeta?.label} Mastery`}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {subjectProgress}%
            </span>
            <span className={`text-[11px] font-bold ${
              subjectProgress >= 75 ? 'text-emerald-600' : subjectProgress >= 50 ? 'text-blue-600' : 'text-amber-600'
            }`}>
              {subjectProgress >= 75 ? 'Proficient' : subjectProgress >= 50 ? 'Developing' : 'Intervention'}
            </span>
          </div>
          {/* Visual progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${subjectProgress}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Average Quiz Accuracy */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:border-emerald-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Mean Test Accuracy
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {avgAccuracy}%
            </span>
            <span className="text-[11px] font-bold text-emerald-600">
              {allSubmissions.length} Test{allSubmissions.length !== 1 ? 's' : ''} Analyzed
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 truncate">
            Based on completed adaptive runs
          </p>
        </div>

        {/* Metric 3: Learning Velocity */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:border-amber-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Learning Velocity
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-slate-900">
              {student.learningVelocity || 'Steady Progress'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-3">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Response cadence steady</span>
          </div>
        </div>

        {/* Metric 4: Diagnostic / Quiz Volume */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:border-purple-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Assessments Taken
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {student.testsTaken || allSubmissions.length || 1}
            </span>
            <span className="text-[11px] font-bold text-purple-600">
              Active Session
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 truncate">
            Last active: {student.lastActive || 'Today'}
          </p>
        </div>

      </div>

      {/* Recent Test Summary Card */}
      {latestSubmission && (
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-4 sm:p-5 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Latest Assessment Summary
              </span>
              <span className="text-xs text-slate-400">
                {latestSubmission.date || 'Recent'}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {latestSubmission.title || latestSubmission.testType || 'Adaptive Competency Evaluation'}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span>Score: <strong className="text-white font-mono">{latestSubmission.score}%</strong></span>
              <span>•</span>
              <span>Questions: <strong className="text-white font-mono">{latestSubmission.correctCount ?? '—'} / {latestSubmission.totalQuestions ?? '—'} Correct</strong></span>
              <span>•</span>
              <span>Duration: <strong className="text-white font-mono">{latestSubmission.durationMinutes || 8} mins</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/10 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Difficulty</p>
              <p className="text-xs font-black text-amber-300 mt-0.5 font-mono">
                {latestSubmission.difficultyReached || 'MEDIUM'}
              </p>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-blue-600/30 border border-blue-400/30 text-center">
              <p className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">Result Grade</p>
              <p className="text-xs font-black text-white mt-0.5 font-mono">
                {latestSubmission.score >= 80 ? 'Mastery 🏆' : latestSubmission.score >= 60 ? 'Developing 📈' : 'Needs Support ⚠️'}
              </p>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
