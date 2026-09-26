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
  Brain
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { AdaptiveEngine } from '../../services/adaptiveEngine';
import { DiagnosticAssessment } from './DiagnosticAssessment';
import { KnowledgeAnalysisView } from './KnowledgeAnalysisView';
import { PersonalizedLearningPath } from './PersonalizedLearningPath';
import { AdaptiveQuizView } from './AdaptiveQuizView';
import { UpdatedRecommendationsView } from './UpdatedRecommendationsView';
import { AiTutorDrawer } from './AiTutorDrawer';

export const StudentDashboard = ({ currentUser, onBackToLogin, onUpdateCurrentUser }) => {
  const [student, setStudent] = useState(currentUser);
  
  // Stages: 1 = Diagnostic, 2 = Knowledge Analysis, 3 = Personalized Learning, 4 = Adaptive Quiz, 5 = Updated Recommendations
  const [currentStage, setCurrentStage] = useState(
    student.initialTestTaken ? 2 : 1
  );

  const [activeQuizConceptId, setActiveQuizConceptId] = useState(
    student.rootPrerequisiteBottleneck || 'c4'
  );
  const [latestSubmission, setLatestSubmission] = useState(null);

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

    // Record submission
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
    setCurrentStage(2); // Advance to Knowledge Analysis
  };

  // Stage 4 Completion handler
  const handleCompleteQuiz = (submissionPayload, updatedStudentFromEval) => {
    if (updatedStudentFromEval && submissionPayload) {
      setLatestSubmission(submissionPayload);
      refreshStudentState(updatedStudentFromEval);
      setCurrentStage(5);
      return;
    }

    const sub = StorageService.addSubmission(submissionPayload);
    const updated = AdaptiveEngine.updateStudentProfileAfterTest(student, submissionPayload);
    StorageService.updateStudent(student.id, updated);

    setLatestSubmission(sub);
    refreshStudentState(updated);
    setCurrentStage(5); // Advance to Updated Recommendations
  };

  // Navigations
  const handleStartAdaptiveQuiz = (conceptId) => {
    setActiveQuizConceptId(conceptId);
    setCurrentStage(4);
  };

  const handleRestartCycle = () => {
    setCurrentStage(1);
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
      
      {/* Student Top Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Student Info */}
            <div className="flex items-center gap-3.5">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-400 shadow-xs shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {student.name}
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    student.status === 'Needs Intervention'
                      ? 'bg-red-100 text-red-800'
                      : student.status === 'Mastering'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                  }`}>
                    {student.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                  <span>Overall Mastery: <strong className="text-slate-900 font-bold">{student.overallMastery}%</strong></span>
                  <span>•</span>
                  <span>Tests Taken: <strong className="text-slate-900 font-bold">{student.testsTaken}</strong></span>
                </div>
              </div>
            </div>

            {/* Back Buttons (Strictly honoring prompt requirement: back option and back to login page) */}
            <div className="flex items-center gap-2.5">
              {currentStage > 1 && (
                <button
                  onClick={() => setCurrentStage(prev => Math.max(1, prev - 1))}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold shadow-2xs transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous Step</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* 5-Stage Adaptive Workflow Stepper */}
      <div className="bg-white/80 border-b border-slate-200/80 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between overflow-x-auto gap-2 py-1">
            {stagesList.map((stg, i) => {
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
        </div>
      </div>

      {/* Main Stage Content */}
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
            onRestartCycle={handleRestartCycle}
            onStartAnotherQuiz={(cId) => handleStartAdaptiveQuiz(cId)}
            onViewAllLessons={() => setCurrentStage(3)}
          />
        )}

      </main>

      {/* Embedded Floating AI Study Companion */}
      <AiTutorDrawer
        student={student}
        currentConceptId={activeQuizConceptId}
      />

    </div>
  );
};
