import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  ArrowLeft, 
  LogOut, 
  ArrowRight, 
  Layers, 
  AlertCircle, 
  CheckCircle2, 
  BarChart3, 
  Scale, 
  Search,
  BookOpen,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { CONCEPTS, CONCEPT_LIST } from '../../data/conceptsData';
import { StorageService } from '../../services/storageService';

export const AdminDashboard = ({ currentUser, onBackToLogin, onNavigateStudent }) => {
  const [classes, setClasses] = useState(StorageService.getClasses());
  const [students, setStudents] = useState(StorageService.getStudents());
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [compareClassAId, setCompareClassAId] = useState('class-a');
  const [compareClassBId, setCompareClassBId] = useState('class-b');
  const [searchQuery, setSearchQuery] = useState('');

  // Helper calculations
  const getClassStudents = (classId) => {
    return students.filter(s => s.classId === classId);
  };

  const calculateClassMetrics = (classId) => {
    const classStudents = getClassStudents(classId);
    if (classStudents.length === 0) {
      return { avgMastery: 0, totalTests: 0, gapsCount: 0, interventionCount: 0, avgByConcept: {} };
    }

    const totalMastery = classStudents.reduce((acc, s) => acc + (s.overallMastery || 0), 0);
    const avgMastery = Math.round(totalMastery / classStudents.length);
    const totalTests = classStudents.reduce((acc, s) => acc + (s.testsTaken || 0), 0);
    const interventionCount = classStudents.filter(s => s.status === 'Needs Intervention').length;

    // Concept breakdown
    const avgByConcept = {};
    CONCEPT_LIST.forEach(c => {
      const sum = classStudents.reduce((acc, s) => acc + (s.conceptMastery?.[c.id] || 0), 0);
      avgByConcept[c.id] = Math.round(sum / classStudents.length);
    });

    return {
      avgMastery,
      totalTests,
      testsPerStudent: (totalTests / classStudents.length).toFixed(1),
      interventionCount,
      interventionRate: Math.round((interventionCount / classStudents.length) * 100),
      avgByConcept,
      studentCount: classStudents.length
    };
  };

  // Institutional KPI calculations
  const totalStudentsCount = students.length;
  const platformAvgMastery = Math.round(
    students.reduce((acc, s) => acc + (s.overallMastery || 0), 0) / (totalStudentsCount || 1)
  );
  const platformTotalTests = students.reduce((acc, s) => acc + (s.testsTaken || 0), 0);
  const totalNeedingIntervention = students.filter(s => s.status === 'Needs Intervention').length;

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const selectedClassStudents = selectedClassId ? getClassStudents(selectedClassId) : [];

  const classAMetrics = calculateClassMetrics(compareClassAId);
  const classBMetrics = calculateClassMetrics(compareClassBId);
  const classA = classes.find(c => c.id === compareClassAId);
  const classB = classes.find(c => c.id === compareClassBId);

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      
      {/* Top Banner & Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Administrator Command Center
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    Institutional Scope
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Logged in as <span className="font-semibold text-slate-700">{currentUser?.name}</span> • Curriculum & Academic Operations
                </p>
              </div>
            </div>

            {/* Navigation Buttons: Back to Login & View Switchers */}
            <div className="flex items-center gap-2.5">
              
              {selectedClassId && (
                <button
                  onClick={() => setSelectedClassId(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold shadow-2xs transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to All Classes</span>
                </button>
              )}

              {comparisonMode && (
                <button
                  onClick={() => setComparisonMode(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold shadow-2xs transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Overview</span>
                </button>
              )}

              {!comparisonMode && !selectedClassId && (
                <button
                  onClick={() => setComparisonMode(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors"
                >
                  <Scale className="w-4 h-4" />
                  <span>Compare Classes</span>
                </button>
              )}

            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">

        {/* Global Key Metrics Overview */}
        {!selectedClassId && !comparisonMode && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Enrolled</span>
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">{totalStudentsCount}</div>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <span className="text-emerald-600 font-bold">100%</span> active cohort participation
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Average Mastery</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">{platformAvgMastery}%</div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    platformAvgMastery >= 75 ? 'bg-emerald-500' : platformAvgMastery >= 50 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${platformAvgMastery}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Adaptive Tests Given</span>
                <Layers className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">{platformTotalTests}</div>
              <p className="text-[11px] text-slate-500 mt-1">
                {(platformTotalTests / (totalStudentsCount || 1)).toFixed(1)} tests avg per student
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Intervention Rate</span>
                <AlertCircle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-600">
                {Math.round((totalNeedingIntervention / (totalStudentsCount || 1)) * 100)}%
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {totalNeedingIntervention} students flagged with prerequisite gaps
              </p>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 1: COMPARISON MODE (Compare Class A vs Class B)               */}
        {/* ------------------------------------------------------------------ */}
        {comparisonMode && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Header & Class Selectors */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Scale className="w-5 h-5 text-indigo-600" />
                    Comparative Class Analysis
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Benchmarking curriculum progress, knowledge gaps, and adaptive test results across cohorts
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-600">Benchmark Selector:</span>
                  <select
                    value={compareClassAId}
                    onChange={(e) => setCompareClassAId(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-800 bg-slate-50 focus:ring-2 focus:ring-indigo-500 text-xs"
                  >
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <span className="font-bold text-slate-400">vs</span>
                  <select
                    value={compareClassBId}
                    onChange={(e) => setCompareClassBId(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-800 bg-slate-50 focus:ring-2 focus:ring-indigo-500 text-xs"
                  >
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Side-by-side Top Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                
                {/* Class A Card */}
                <div className="p-5 rounded-2xl border-2 border-blue-200 bg-blue-50/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Cohort A</span>
                      <h3 className="text-base font-bold text-slate-900">{classA?.name} ({classA?.subject})</h3>
                      <p className="text-xs text-slate-500">Mentor: {classA?.mentorName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-blue-700">{classAMetrics.avgMastery}%</div>
                      <span className="text-[10px] text-slate-500">Average Mastery</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-blue-200/60 text-center">
                    <div className="p-2 rounded-lg bg-white border border-blue-100">
                      <div className="text-xs font-bold text-slate-800">{classAMetrics.studentCount}</div>
                      <div className="text-[10px] text-slate-400">Enrolled</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-blue-100">
                      <div className="text-xs font-bold text-slate-800">{classAMetrics.totalTests}</div>
                      <div className="text-[10px] text-slate-400">Tests Taken</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-blue-100">
                      <div className="text-xs font-bold text-amber-600">{classAMetrics.interventionRate}%</div>
                      <div className="text-[10px] text-slate-400">Needs Help</div>
                    </div>
                  </div>
                </div>

                {/* Class B Card */}
                <div className="p-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Cohort B</span>
                      <h3 className="text-base font-bold text-slate-900">{classB?.name} ({classB?.subject})</h3>
                      <p className="text-xs text-slate-500">Mentor: {classB?.mentorName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-emerald-700">{classBMetrics.avgMastery}%</div>
                      <span className="text-[10px] text-slate-500">Average Mastery</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-emerald-200/60 text-center">
                    <div className="p-2 rounded-lg bg-white border border-emerald-100">
                      <div className="text-xs font-bold text-slate-800">{classBMetrics.studentCount}</div>
                      <div className="text-[10px] text-slate-400">Enrolled</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-emerald-100">
                      <div className="text-xs font-bold text-slate-800">{classBMetrics.totalTests}</div>
                      <div className="text-[10px] text-slate-400">Tests Taken</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-emerald-100">
                      <div className="text-xs font-bold text-amber-600">{classBMetrics.interventionRate}%</div>
                      <div className="text-[10px] text-slate-400">Needs Help</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Concept-by-Concept Side-by-Side Comparison Table */}
              <div className="mt-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  Concept-by-Concept Mastery Benchmark
                </h4>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Concept & Category</th>
                        <th className="py-3 px-4 text-center">{classA?.name} Mastery</th>
                        <th className="py-3 px-4 text-center">{classB?.name} Mastery</th>
                        <th className="py-3 px-4 text-center">Variance (Delta)</th>
                        <th className="py-3 px-4">Pedagogical Insight</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {CONCEPT_LIST.map(concept => {
                        const scoreA = classAMetrics.avgByConcept[concept.id] || 0;
                        const scoreB = classBMetrics.avgByConcept[concept.id] || 0;
                        const delta = scoreA - scoreB;

                        return (
                          <tr key={concept.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900">{concept.name}</div>
                              <span className="text-[10px] text-slate-400">{concept.category}</span>
                            </td>

                            <td className="py-3 px-4 text-center">
                              <span className={`inline-block font-bold px-2 py-0.5 rounded text-xs ${
                                scoreA >= 75 ? 'bg-emerald-100 text-emerald-800' : scoreA >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {scoreA}%
                              </span>
                            </td>

                            <td className="py-3 px-4 text-center">
                              <span className={`inline-block font-bold px-2 py-0.5 rounded text-xs ${
                                scoreB >= 75 ? 'bg-emerald-100 text-emerald-800' : scoreB >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {scoreB}%
                              </span>
                            </td>

                            <td className="py-3 px-4 text-center font-bold">
                              {delta > 0 ? (
                                <span className="text-blue-600">+{delta}% ({classA?.name})</span>
                              ) : delta < 0 ? (
                                <span className="text-emerald-600">+{Math.abs(delta)}% ({classB?.name})</span>
                              ) : (
                                <span className="text-slate-400">Parity (0%)</span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-slate-600">
                              {concept.id === 'c4' ? (
                                <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                  Critical Divergence: {classB?.name} has persistent factoring gaps hindering quadratics.
                                </span>
                              ) : delta > 25 ? (
                                <span className="text-slate-600">{classA?.name} exhibits significant lead due to prior diagnostic mastery.</span>
                              ) : (
                                <span className="text-slate-500">Consistent performance across both cohorts.</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AI Cohort Analysis Report */}
              <div className="mt-6 p-4 rounded-xl bg-purple-50/60 border border-purple-200 text-xs">
                <div className="flex items-center gap-2 font-bold text-purple-900 mb-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>AI Curriculum Optimization Recommendation</span>
                </div>
                <p className="text-purple-800 leading-relaxed">
                  Comparative analysis reveals a marked 35% gap in <strong>Factoring Polynomials</strong> in {classB?.name}. Because Factoring serves as the essential prerequisite for Quadratic Equations and Parabolic Graphs, students in {classB?.name} are currently blocked from progressing to advanced coordinate geometry. We recommend allocating two 30-minute adaptive remedial sprints targeting trinomial decomposition for {classB?.name}.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 2: SINGLE CLASS DRILLDOWN (Student roster & individual progress)*/}
        {/* ------------------------------------------------------------------ */}
        {selectedClassId && selectedClass && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Class Hero Header */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-700">
                    {selectedClass.name}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">{selectedClass.subject}</h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Mentor: <span className="font-semibold text-slate-700">{selectedClass.mentorName}</span> • Room: {selectedClass.room} • {selectedClass.schedule}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-medium">Class Average</div>
                  <div className="text-2xl font-black text-slate-900">
                    {calculateClassMetrics(selectedClass.id).avgMastery}%
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm">
                  {selectedClassStudents.length} St.
                </div>
              </div>
            </div>

            {/* Students Roster & Progress in this Class */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Enrolled Students & Adaptive Progress</h3>
                  <p className="text-xs text-slate-500">Track individual mastery, tests given, and knowledge gaps</p>
                </div>
                
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search student..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 w-48 sm:w-60 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4 text-center">Tests Taken</th>
                      <th className="py-3 px-4">Overall Mastery</th>
                      <th className="py-3 px-4">Critical Knowledge Gaps</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedClassStudents
                      .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(student => (
                        <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={student.avatar}
                                alt={student.name}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                              />
                              <div>
                                <div className="font-bold text-slate-900">{student.name}</div>
                                <div className="text-[11px] text-slate-400">{student.email}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-slate-100 text-xs">
                              {student.testsTaken} tests
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="w-36">
                              <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                                <span className="text-slate-700">{student.overallMastery}%</span>
                                <span className="text-slate-400">{student.learningVelocity}</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    student.overallMastery >= 75
                                      ? 'bg-emerald-500'
                                      : student.overallMastery >= 50
                                        ? 'bg-amber-500'
                                        : 'bg-red-500'
                                  }`}
                                  style={{ width: `${student.overallMastery}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            {student.criticalGaps && student.criticalGaps.length > 0 ? (
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {student.criticalGaps.map(gapId => (
                                  <span
                                    key={gapId}
                                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200"
                                  >
                                    {CONCEPTS[gapId]?.name || gapId}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5" /> No critical gaps
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              student.status === 'Mastering'
                                ? 'bg-emerald-100 text-emerald-800'
                                : student.status === 'On Track'
                                  ? 'bg-blue-100 text-blue-800'
                                  : student.status === 'Needs Intervention'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-slate-100 text-slate-700'
                            }`}>
                              {student.status}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => onNavigateStudent(student)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              <span>View Path</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 3: MAIN CLASSES OVERVIEW GRID                                 */}
        {/* ------------------------------------------------------------------ */}
        {!selectedClassId && !comparisonMode && (
          <div className="space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-purple-600" />
                  Institutional Classes Overview
                </h2>
                <p className="text-xs text-slate-500">
                  Click on any class to inspect student progress, test volume, and knowledge gaps
                </p>
              </div>

              <button
                onClick={() => setComparisonMode(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 text-xs font-bold shadow-2xs transition-colors"
              >
                <Scale className="w-4 h-4" />
                <span>Compare Cohorts</span>
              </button>
            </div>

            {/* Classes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {classes.map(c => {
                const metrics = calculateClassMetrics(c.id);
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedClassId(c.id)}
                    className="bg-white rounded-2xl border-2 border-slate-200/80 hover:border-purple-300 p-6 shadow-xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Class Badge & Term */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-purple-100 text-purple-700 tracking-wide">
                          {c.name}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {c.academicTerm}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-900 transition-colors">
                        {c.subject}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Mentor: {c.mentorName}
                      </p>

                      {/* Schedule info */}
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-100">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{c.room} • {c.schedule}</span>
                      </div>

                      {/* Performance Bar */}
                      <div className="mt-5">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-slate-500 font-semibold">Average Cohort Mastery</span>
                          <span className="font-black text-slate-900">{metrics.avgMastery}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              metrics.avgMastery >= 75
                                ? 'bg-emerald-500'
                                : metrics.avgMastery >= 50
                                  ? 'bg-amber-500'
                                  : 'bg-red-500'
                            }`}
                            style={{ width: `${metrics.avgMastery}%` }}
                          />
                        </div>
                      </div>

                      {/* Key stats row */}
                      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="text-xs font-bold text-slate-800">{metrics.studentCount}</div>
                          <div className="text-[10px] text-slate-400">Students</div>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="text-xs font-bold text-slate-800">{metrics.totalTests}</div>
                          <div className="text-[10px] text-slate-400">Tests</div>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="text-xs font-bold text-amber-600">{metrics.interventionCount}</div>
                          <div className="text-[10px] text-slate-400">Gaps</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700 group-hover:text-purple-800">
                      <span>Click to view student progress</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
