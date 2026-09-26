import React, { useState } from 'react';
import { 
  GraduationCap, 
  ArrowLeft, 
  LogOut, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  Layers, 
  Target, 
  RotateCcw,
  Zap,
  TrendingUp,
  Brain,
  LayoutDashboard,
  PlayCircle
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { AdaptiveEngine } from '../../services/adaptiveEngine';
import { DiagnosticAssessment } from './DiagnosticAssessment';
import { KnowledgeAnalysisView } from './KnowledgeAnalysisView';
import { PersonalizedLearningPath } from './PersonalizedLearningPath';
import { AdaptiveQuizView } from './AdaptiveQuizView';
import { UpdatedRecommendationsView } from './UpdatedRecommendationsView';
import { AiTutorDrawer } from './AiTutorDrawer';

// Section Components (Exact Sequence: Quick Performance Tracking -> Knowledge Gap Detection -> Personalized Learning Path)
import { SubjectFilterBar } from './dashboard/SubjectFilterBar';
import { QuickPerformanceTracking } from './dashboard/QuickPerformanceTracking';
import { KnowledgeGapDetection } from './dashboard/KnowledgeGapDetection';
import { PersonalizedLearningRoadmap } from './dashboard/PersonalizedLearningRoadmap';
import { useKnowledgeGaps } from '../../hooks/useKnowledgeGaps';
import { SUBJECTS_REGISTRY, getSubjectById } from '../../data/subjectRegistry';

export const StudentDashboard = ({ currentUser, onBackToLogin, onUpdateCurrentUser }) => {
  const [student, setStudent] = useState(currentUser);
  
  // Active subject filter (Single Source of Truth: SUBJECTS_REGISTRY)
  const [selectedSubjectId, setSelectedSubjectId] = useState('all');

  // View modes: 'dashboard' (overview with 3 sequential sections) | 'stage' (interactive assessment runner)
  const [viewMode, setViewMode] = useState('dashboard');
  
  // Stages: 1 = Diagnostic, 2 = Knowledge Analysis, 3 = Personalized Learning, 4 = Adaptive Quiz, 5 = Updated Recommendations
  const [currentStage, setCurrentStage] = useState(
    student?.initialTestTaken ? 2 : 1
  );

  const [activeQuizConceptId, setActiveQuizConceptId] = useState(
    student?.rootPrerequisiteBottleneck || 'c4'
  );
  const [latestSubmission, setLatestSubmission] = useState(null);

  // Hook for Knowledge Gap Detection & Personalized Roadmap Generation
  const {
    filteredGaps,
    milestones,
    hasGaps,
    toggleMilestoneCompletion
  } = useKnowledgeGaps(student, selectedSubjectId);

  // Synchronize student updates
  const refreshStudentState = (updatedStudent) => {
    setStudent(updatedStudent);
    if (onUpdateCurrentUser) {
      onUpdateCurrentUser(updatedStudent);
    }
  };

  // Stage 1 Completion handler
  const handleCompleteDiagnostic = (answers, updatedStudentFromEval, subFromEval) => {
    if (updatedStudentFromEval && subFromEval) {
      setLatestSubmission(subFromEval);
      refreshStudentState(updatedStudentFromEval);
      setViewMode('dashboard');
      setCurrentStage(2);
      return;
    }

    const analysis = AdaptiveEngine.analyzeDiagnostic(answers);

    const updated = StorageService.updateStudent(student.id, {
      initialTestTaken: true,
      overallMastery: analysis.overallMastery,
      conceptMastery: analysis.conceptMastery,
      criticalGaps: analysis.criticalGaps,
      rootPrerequisiteBottleneck: analysis.rootPrerequisiteBottleneck,
      status: analysis.criticalGaps.length >= 2 ? 'Needs Intervention' : analysis.overallMastery >= 75 ? 'Mastering' : 'On Track',
      testsTaken: (student.testsTaken || 0) + 1
    });

    const sub = StorageService.addSubmission({
      studentId: student.id,
      studentName: student.name,
      testType: 'Diagnostic Assessment',
      title: 'Baseline Algebra Readiness Diagnostic',
      score: analysis.overallMastery,
      totalQuestions: analysis.totalQuestions,
      correctCount: analysis.correctCount,
      durationMinutes: 12,
      difficultyReached: analysis.recommendedStartingDifficulty.toUpperCase(),
      answers
    });

    setLatestSubmission(sub);
    refreshStudentState(updated);
    setViewMode('dashboard');
    setCurrentStage(2);
  };

  // Stage 4 Completion handler
  const handleCompleteQuiz = (submissionPayload, updatedStudentFromEval) => {
    if (updatedStudentFromEval && submissionPayload) {
      setLatestSubmission(submissionPayload);
      refreshStudentState(updatedStudentFromEval);
      setViewMode('dashboard');
      setCurrentStage(5);
      return;
    }

    const sub = StorageService.addSubmission(submissionPayload);
    const updated = AdaptiveEngine.updateStudentProfileAfterTest(student, submissionPayload);
    StorageService.updateStudent(student.id, updated);

    setLatestSubmission(sub);
    refreshStudentState(updated);
    setViewMode('dashboard');
    setCurrentStage(5);
  };

  // Navigation Actions
  const handleStartAdaptiveQuiz = (conceptId = 'c4') => {
    setActiveQuizConceptId(conceptId);
    setCurrentStage(4);
    setViewMode('stage');
  };

  const handleStartDiagnostic = () => {
    setCurrentStage(1);
    setViewMode('stage');
  };

  // Format Login ID: User ID: #STU-8821 or real field
  const getFormattedUserId = () => {
    if (!student?.id) return 'User ID: —';
    const idStr = String(student.id).replace(/^s/i, '').padStart(4, '0');
    return `User ID: #STU-${idStr}`;
  };

  const stagesList = [
    { id: 1, name: 'Diagnostic Assessment', desc: 'Initial baseline calibration' },
    { id: 2, name: 'Knowledge Analysis', desc: 'Prerequisite graph & gaps' },
    { id: 3, name: 'Personalized Learning', desc: 'Topological study path' },
    { id: 4, name: 'Adaptive Quiz', desc: 'Dynamic difficulty test' },
    { id: 5, name: 'Updated Recommendations', desc: 'Continuous profile growth' }
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      
      {/* ========================================================= */}
      {/* 1. Header & User Identity (Typography-Only, No Avatar)   */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Authenticated User Identity */}
            {!student ? (
              // Explicit Loading / Unauthenticated State
              <div className="animate-pulse space-y-2">
                <div className="h-4 w-32 bg-slate-200 rounded-md"></div>
                <div className="h-7 w-48 bg-slate-300 rounded-md"></div>
                <div className="h-3 w-40 bg-slate-200 rounded-md"></div>
              </div>
            ) : (
              // Typography-Only Identity Element (No profile avatar/photo container)
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Authenticated Login ID Tag */}
                  <span className="font-mono text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/80 shadow-2xs">
                    {getFormattedUserId()}
                  </span>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <span className="text-xs text-slate-500 font-mono">
                    {student.email || '—'}
                  </span>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    student.status === 'Needs Intervention'
                      ? 'bg-red-100 text-red-800'
                      : student.status === 'Mastering'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                  }`}>
                    {student.status || 'Active'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {student.name || '—'}
                  </h1>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                  <span>Overall Mastery: <strong className="text-slate-900 font-bold">{student.overallMastery ?? '—'}%</strong></span>
                  <span>•</span>
                  <span>Tests Completed: <strong className="text-slate-900 font-bold">{student.testsTaken ?? 0}</strong></span>
                  <span>•</span>
                  <span>Enrolled Stream: <strong className="text-slate-900 font-bold">Standard 4-Subject STEM & Humanities</strong></span>
                </div>
              </div>
            )}

            {/* Header Action Affordances */}
            <div className="flex items-center gap-2.5">
              {viewMode === 'stage' ? (
                <button
                  onClick={() => setViewMode('dashboard')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold shadow-2xs transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Dashboard</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartAdaptiveQuiz('c4')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Take Adaptive Quiz</span>
                  </button>

                  <button
                    onClick={handleStartDiagnostic}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold shadow-2xs transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Retake Diagnostic</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* View Switcher / Mode Rendering                            */}
      {/* ========================================================= */}
      {viewMode === 'dashboard' ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8">
          
          {/* 2. Subjects Catalog & Filtering (Dynamic single source of truth) */}
          <SubjectFilterBar
            selectedSubjectId={selectedSubjectId}
            onSelectSubject={setSelectedSubjectId}
            student={student}
          />

          {/* ========================================================= */}
          {/* 3. Dashboard Section Order (Exact Required Sequence)      */}
          {/* ========================================================= */}
          
          {/* 1. Quick Performance Tracking */}
          <QuickPerformanceTracking
            student={student}
            selectedSubjectId={selectedSubjectId}
            onTakeAssessment={() => handleStartAdaptiveQuiz('c4')}
            latestSubmission={latestSubmission}
          />

          {/* 2. Knowledge Gap Detection (new) */}
          <KnowledgeGapDetection
            gaps={filteredGaps}
            selectedSubjectId={selectedSubjectId}
            onAddressGap={(gap) => {
              if (gap.conceptId) {
                handleStartAdaptiveQuiz(gap.conceptId);
              }
            }}
          />

          {/* 3. Personalized Learning Path (new) */}
          <PersonalizedLearningRoadmap
            milestones={milestones}
            onToggleCompletion={toggleMilestoneCompletion}
            onStartMicroQuiz={(ms) => handleStartAdaptiveQuiz(ms.microQuiz?.conceptId || 'c4')}
            onStartPractice={(ms) => handleStartAdaptiveQuiz(ms.practiceModule?.conceptId || 'c4')}
            selectedSubjectId={selectedSubjectId}
          />

        </main>
      ) : (
        /* Interactive Assessment Workflow Stepper (Stages 1 to 5) */
        <div>
          <div className="bg-white/80 border-b border-slate-200/80 sticky top-16 z-30 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {stagesList.map((stg) => {
                  const isActive = currentStage === stg.id;
                  const isPassed = currentStage > stg.id;
                  const isAvailable = student.initialTestTaken || stg.id === 1;

                  return (
                    <button
                      key={stg.id}
                      disabled={!isAvailable}
                      onClick={() => setCurrentStage(stg.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                          : isPassed
                            ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                            : isAvailable
                              ? 'text-slate-600 hover:bg-slate-100'
                              : 'text-slate-300 pointer-events-none'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                        isActive
                          ? 'bg-white text-blue-600'
                          : isPassed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isPassed ? '✓' : stg.id}
                      </span>
                      <span>{stg.name}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setViewMode('dashboard')}
                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                <span>Back to Overview</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            {currentStage === 1 && (
              <DiagnosticAssessment
                student={student}
                onCompleteDiagnostic={handleCompleteDiagnostic}
              />
            )}

            {currentStage === 2 && (
              <KnowledgeAnalysisView
                student={student}
                onProceedToLearningPath={() => setCurrentStage(3)}
              />
            )}

            {currentStage === 3 && (
              <PersonalizedLearningPath
                student={student}
                onStartAdaptiveQuiz={handleStartAdaptiveQuiz}
              />
            )}

            {currentStage === 4 && (
              <AdaptiveQuizView
                student={student}
                targetConceptId={activeQuizConceptId}
                onCompleteQuiz={handleCompleteQuiz}
              />
            )}

            {currentStage === 5 && (
              <UpdatedRecommendationsView
                student={student}
                latestSubmission={latestSubmission}
                onRestartCycle={handleStartDiagnostic}
                onStartAnotherQuiz={(cId) => handleStartAdaptiveQuiz(cId)}
                onViewAllLessons={() => setCurrentStage(3)}
              />
            )}
          </main>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. Gemini API Chatbot Integration (Floating AI Companion) */}
      {/* ========================================================= */}
      <AiTutorDrawer
        student={student}
        currentSubjectId={selectedSubjectId === 'all' ? 'mathematics' : selectedSubjectId}
      />

    </div>
  );
};
