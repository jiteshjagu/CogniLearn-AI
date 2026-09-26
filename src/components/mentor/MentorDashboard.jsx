import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Search, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Sparkles, 
  ChevronRight, 
  Send,
  Layers,
  HelpCircle,
  TrendingUp,
  Brain,
  UserPlus,
  X,
  Mail,
  User
} from 'lucide-react';
import { CONCEPTS, CONCEPT_LIST } from '../../data/conceptsData';
import { StorageService } from '../../services/storageService';
import { ApiClient } from '../../services/apiClient';
import { AdaptiveEngine } from '../../services/adaptiveEngine';
import { DynamicEvaluationModal } from '../common/DynamicEvaluationModal';

export const MentorDashboard = ({ currentUser, onBackToLogin, onNavigateStudent }) => {
  const [students, setStudents] = useState(StorageService.getStudents());
  const [classes, setClasses] = useState(StorageService.getClasses());
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  
  // Default to null so the mentor SEES all students' names first
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [showEvalModal, setShowEvalModal] = useState(false);
  
  const [mentorNoteInput, setMentorNoteInput] = useState('');
  const [noteSuccess, setNoteSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Student Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newClassId, setNewClassId] = useState('class-a');
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  // Mentors assigned classes
  const assignedClassIds = currentUser?.assignedClasses || ['class-a', 'class-b'];
  const mentorClasses = classes.filter(c => assignedClassIds.includes(c.id));

  // Filter students based on mentor's classes
  const rawMentorStudents = students.filter(s => {
    const isInMentorClass = assignedClassIds.includes(s.classId);
    if (!isInMentorClass) return false;
    if (selectedClassFilter !== 'all' && s.classId !== selectedClassFilter) return false;
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase()) && !s.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Deduplicate mentorStudents strictly by name, email, and ID so no duplicate names ever appear
  const mentorStudents = [];
  const seenMentorStudentKeys = new Set();
  for (const s of rawMentorStudents) {
    if (!s) continue;
    const nameKey = s.name?.trim().toLowerCase();
    const emailKey = s.email?.trim().toLowerCase();
    const idKey = s.id;
    if ((nameKey && seenMentorStudentKeys.has(nameKey)) || 
        (emailKey && seenMentorStudentKeys.has(emailKey)) || 
        (idKey && seenMentorStudentKeys.has(idKey))) {
      continue;
    }
    if (nameKey) seenMentorStudentKeys.add(nameKey);
    if (emailKey) seenMentorStudentKeys.add(emailKey);
    if (idKey) seenMentorStudentKeys.add(idKey);
    mentorStudents.push(s);
  }

  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const studentSubmissions = selectedStudent ? StorageService.getSubmissionsByStudent(selectedStudent.id) : [];
  const selectedSubmission = studentSubmissions.find(sub => sub.id === selectedSubmissionId) || studentSubmissions[0];

  const activeSubmissionEval = selectedSubmission?.evaluation || (
    selectedSubmission && selectedStudent
      ? AdaptiveEngine.evaluateAssessmentResult(selectedStudent, {
          answers: selectedSubmission.answers || [],
          testType: selectedSubmission.testType,
          title: selectedSubmission.title
        }).evaluation
      : null
  );

  const handleOpenStudentReport = (student) => {
    setSelectedStudentId(student.id);
    const subs = StorageService.getSubmissionsByStudent(student.id);
    setSelectedSubmissionId(subs[0]?.id || null);
  };

  const handleSaveMentorNote = (e) => {
    e.preventDefault();
    if (!mentorNoteInput.trim() || !selectedStudent) return;

    const newNote = {
      date: new Date().toISOString().split('T')[0],
      author: currentUser?.name || 'Academic Mentor',
      note: mentorNoteInput.trim()
    };

    const updatedNotes = [...(selectedStudent.mentorNotes || []), newNote];
    StorageService.updateStudent(selectedStudent.id, { mentorNotes: updatedNotes });
    ApiClient.addMentorNote(selectedStudent.id, mentorNoteInput.trim(), currentUser?.name);
    
    setStudents(StorageService.getStudents());
    setMentorNoteInput('');
    setNoteSuccess(true);
    setTimeout(() => setNoteSuccess(false), 2000);
  };

  const handleAddStudentSubmit = (e) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');

    if (!newName.trim() || !newEmail.trim()) {
      setModalError('Please enter both student name and email address.');
      return;
    }

    // Verify email format (e.g. xyz@gmail.com)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(newEmail.trim().toLowerCase())) {
      setModalError('Invalid email format. Please use the correct format (example: xyz@gmail.com).');
      return;
    }

    // Check if email or name already registered
    const normEmail = newEmail.trim().toLowerCase();
    const normName = newName.trim().toLowerCase();
    const existing = StorageService.getStudents().find(
      s => s.email?.toLowerCase().trim() === normEmail || s.name?.toLowerCase().trim() === normName
    );
    if (existing) {
      setModalError(`A student named "${existing.name}" or with this email already exists.`);
      return;
    }

    const created = StorageService.addStudent({
      name: newName.trim(),
      email: normEmail,
      classId: newClassId
    });

    ApiClient.addStudent(created);

    setStudents(StorageService.getStudents());
    setModalSuccess(`Student "${created.name}" added successfully!`);

    setTimeout(() => {
      setNewName('');
      setNewEmail('');
      setModalSuccess('');
      setShowAddModal(false);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      
      {/* Top Banner & Sub-header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Academic Mentor Portal
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Diagnostics & Evaluation
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Logged in as <span className="font-semibold text-slate-700">{currentUser?.name}</span> • {currentUser?.title}
                </p>
              </div>
            </div>

            {/* Top Action Controls */}
            <div className="flex items-center gap-2.5">
              {selectedStudentId && (
                <button
                  onClick={() => {
                    setSelectedStudentId(null);
                    setSelectedSubmissionId(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold shadow-2xs transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Student Roster</span>
                </button>
              )}

              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Student</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 1: STUDENT ROSTER (List of student names, tests given & progress) */}
        {/* ------------------------------------------------------------------ */}
        {!selectedStudentId ? (
          <div className="space-y-6">
            
            {/* Filter and Search Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
                  <span>Assigned Student Cohort ({mentorStudents.length} Students)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click on any student name to inspect their full progress report, historical tests, and question answers.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Class selector */}
                <select
                  value={selectedClassFilter}
                  onChange={(e) => setSelectedClassFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-slate-50"
                >
                  <option value="all">All Assigned Classes</option>
                  {mentorClasses.map(c => (
                    <option key={c.id} value={c.id}>{c.name} - {c.subject}</option>
                  ))}
                </select>

                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by student name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 w-52 sm:w-64 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add Student</span>
                </button>
              </div>
            </div>

            {/* Students Table with Clickable Names */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Student Name</th>
                      <th className="py-3.5 px-4">Class</th>
                      <th className="py-3.5 px-4 text-center">Tests Given</th>
                      <th className="py-3.5 px-4">Overall Mastery</th>
                      <th className="py-3.5 px-4">Identified Gaps</th>
                      <th className="py-3.5 px-4">Academic Status</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mentorStudents.map(student => {
                      const studentClass = classes.find(c => c.id === student.classId);
                      return (
                        <tr 
                          key={student.id} 
                          onClick={() => handleOpenStudentReport(student)}
                          className="hover:bg-emerald-50/50 cursor-pointer transition-colors group"
                        >
                          {/* Student Name & Avatar */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={student.avatar}
                                alt={student.name}
                                className="w-10 h-10 rounded-full object-cover border border-slate-200 group-hover:border-emerald-400 shrink-0"
                              />
                              <div>
                                <div className="font-extrabold text-slate-900 group-hover:text-emerald-700 text-sm transition-colors">
                                  {student.name}
                                </div>
                                <div className="text-[11px] text-slate-400">{student.email}</div>
                              </div>
                            </div>
                          </td>

                          {/* Class */}
                          <td className="py-3.5 px-4">
                            <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                              {studentClass?.name || 'Class 10-A'}
                            </span>
                          </td>

                          {/* Number of Tests Given */}
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {student.testsTaken} tests given
                            </span>
                          </td>

                          {/* Progress & Mastery */}
                          <td className="py-3.5 px-4">
                            <div className="w-36">
                              <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                                <span className="text-slate-800">{student.overallMastery}%</span>
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

                          {/* Detected Gaps */}
                          <td className="py-3.5 px-4">
                            {student.criticalGaps && student.criticalGaps.length > 0 ? (
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {student.criticalGaps.map(gId => (
                                  <span key={gId} className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                                    {CONCEPTS[gId]?.name || gId}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> No bottlenecks
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              student.status === 'Needs Intervention'
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : student.status === 'Mastering'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-blue-800'
                            }`}>
                              {student.status}
                            </span>
                          </td>

                          {/* Action Button */}
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenStudentReport(student);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                            >
                              <span>View Progress Report & Answers</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {mentorStudents.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                          No students matching your filter. Click "+ Add Student" to register a new student.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        ) : (
          /* ------------------------------------------------------------------ */
          /* VIEW 2: DETAILED STUDENT PROGRESS REPORT & QUESTION INSPECTOR      */
          /* ------------------------------------------------------------------ */
          selectedStudent && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Back Bar inside view */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedStudentId(null);
                    setSelectedSubmissionId(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold shadow-2xs transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Student Roster</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Student Profile:</span>
                  <span className="text-xs font-black text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {selectedStudent.name}
                  </span>
                </div>
              </div>

              {/* Student Summary Top Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedStudent.avatar}
                      alt={selectedStudent.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-300 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-900">{selectedStudent.name}</h2>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          selectedStudent.status === 'Needs Intervention'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {selectedStudent.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {selectedStudent.email} • Enrolled in {classes.find(c => c.id === selectedStudent.classId)?.name || 'Class 10-A'}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="font-semibold text-slate-700">
                          Total Tests Given: <strong className="text-emerald-700 font-extrabold">{selectedStudent.testsTaken}</strong>
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700">
                          Learning Velocity: <strong className="text-blue-700 font-bold">{selectedStudent.learningVelocity}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center min-w-28">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Overall Mastery</div>
                      <div className="text-2xl font-black text-slate-900 mt-0.5">{selectedStudent.overallMastery}%</div>
                    </div>
                    {selectedStudent.rootPrerequisiteBottleneck && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-left max-w-xs">
                        <div className="text-[10px] uppercase font-bold text-red-600 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Prerequisite Bottleneck
                        </div>
                        <div className="text-xs font-bold text-red-900 mt-0.5">
                          {CONCEPTS[selectedStudent.rootPrerequisiteBottleneck]?.name}
                        </div>
                        <p className="text-[10px] text-red-700 mt-0.5 leading-tight">
                          Blocks downstream comprehension of Quadratic Equations
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Concept Mastery Progress Bars Grid */}
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    Concept-Level Skill Breakdown
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {CONCEPT_LIST.map(concept => {
                      const mastery = selectedStudent.conceptMastery?.[concept.id] || 0;
                      const isGap = selectedStudent.criticalGaps?.includes(concept.id);
                      return (
                        <div
                          key={concept.id}
                          className={`p-3 rounded-xl border ${
                            isGap
                              ? 'bg-red-50/50 border-red-200'
                              : mastery >= 75
                                ? 'bg-emerald-50/30 border-emerald-200'
                                : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-bold mb-1">
                            <span className="truncate text-slate-800" title={concept.name}>{concept.name}</span>
                            <span className={isGap ? 'text-red-600' : 'text-slate-900'}>{mastery}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isGap ? 'bg-red-500' : mastery >= 75 ? 'bg-emerald-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${mastery}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            {isGap ? '⚠️ Action Required' : mastery >= 75 ? '✓ Solid Mastery' : 'Developing'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Test Submissions Selector & Question Inspector */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left: Test History List */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs lg:col-span-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Historical Assessments</h3>
                      <p className="text-xs text-slate-400">{studentSubmissions.length} tests on record</p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {studentSubmissions.map(sub => (
                      <div
                        key={sub.id}
                        onClick={() => setSelectedSubmissionId(sub.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          selectedSubmissionId === sub.id
                            ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-900 truncate">{sub.title}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            sub.score >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {sub.score}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                          <span>{sub.date}</span>
                          <span>{sub.correctCount} / {sub.totalQuestions} correct</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Reached Tier: <strong>{sub.difficultyReached}</strong> • {sub.durationMinutes}m duration
                        </div>
                      </div>
                    ))}

                    {studentSubmissions.length === 0 && (
                      <div className="text-center py-6 px-3 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-xs font-semibold text-slate-600">No tests taken yet</p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          This student has not submitted any assessments yet.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Mentor Notes / Intervention Form */}
                  <div className="mt-6 pt-5 border-t border-slate-200">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      Mentor Notes & Direct Action
                    </h4>

                    {selectedStudent.mentorNotes && selectedStudent.mentorNotes.length > 0 && (
                      <div className="space-y-2 mb-3 max-h-36 overflow-y-auto pr-1">
                        {selectedStudent.mentorNotes.map((n, i) => (
                          <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mb-1">
                              <span>{n.author}</span>
                              <span>{n.date}</span>
                            </div>
                            <p className="text-slate-700">{n.note}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <form onSubmit={handleSaveMentorNote} className="space-y-2">
                      <textarea
                        rows={2}
                        value={mentorNoteInput}
                        onChange={(e) => setMentorNoteInput(e.target.value)}
                        placeholder="Add pedagogical feedback or assign remedial focus..."
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                      {noteSuccess && (
                        <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Note logged successfully!
                        </div>
                      )}
                      <button
                        type="submit"
                        className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3 h-3" />
                        <span>Log Mentor Recommendation</span>
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right: Detailed Question-by-Question Inspector */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs lg:col-span-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-5">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span>Question & Answer Deep Inspector</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        {selectedSubmission ? (
                          <>Inspecting responses for: <strong className="text-slate-700">{selectedSubmission.title}</strong></>
                        ) : (
                          'Awaiting student test submission'
                        )}
                      </p>
                    </div>

                    {selectedSubmission && (
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowEvalModal(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all shadow-2xs"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>View Dynamic Evaluation</span>
                        </button>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                          {selectedSubmission.answers?.filter(a => a.isCorrect).length || 0} Correct
                        </span>
                        <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                          {selectedSubmission.answers?.filter(a => !a.isCorrect).length || 0} Incorrect
                        </span>
                      </div>
                    )}
                  </div>

                  {/* List of Questions with Student's Answer vs Correct Answer */}
                  {selectedSubmission?.answers && selectedSubmission.answers.length > 0 ? (
                    <div className="space-y-4 max-h-[750px] overflow-y-auto pr-1">
                      {selectedSubmission.answers.map((ans, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-xl border transition-all ${
                            ans.isCorrect
                              ? 'bg-emerald-50/20 border-emerald-200'
                              : 'bg-red-50/25 border-red-200'
                          }`}
                        >
                          {/* Question Meta Header */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                              <span className="text-xs font-bold text-slate-800">{ans.conceptName}</span>
                              <span className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase ${
                                ans.difficulty === 'hard'
                                  ? 'bg-purple-100 text-purple-700'
                                  : ans.difficulty === 'medium'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-slate-100 text-slate-700'
                              }`}>
                                {ans.difficulty}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                                <Clock className="w-3 h-3" /> {ans.timeSpentSeconds}s
                              </span>
                              {ans.isCorrect ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100/70 px-2 py-0.5 rounded-full">
                                  <XCircle className="w-3.5 h-3.5" /> Incorrect
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Question Prompt */}
                          <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-3">
                            {ans.question}
                          </p>

                          {/* Options Comparison */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                            {ans.options?.map((opt, optIdx) => {
                              const isStudentPick = optIdx === ans.studentAnswerIndex;
                              const isCorrectAnswer = optIdx === ans.correctIndex;

                              return (
                                <div
                                  key={optIdx}
                                  className={`p-2.5 rounded-lg text-xs flex items-center justify-between border ${
                                    isStudentPick && isCorrectAnswer
                                      ? 'bg-emerald-100/80 border-emerald-400 text-emerald-900 font-bold'
                                      : isStudentPick && !isCorrectAnswer
                                        ? 'bg-red-100 border-red-300 text-red-900 font-bold'
                                        : isCorrectAnswer
                                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                                          : 'bg-white border-slate-200 text-slate-600'
                                  }`}
                                >
                                  <span className="truncate">{opt}</span>
                                  {isStudentPick && !isCorrectAnswer && (
                                    <span className="shrink-0 text-[10px] uppercase font-bold text-red-700 bg-red-200 px-1.5 py-0.5 rounded ml-1">
                                      Student Answer
                                    </span>
                                  )}
                                  {isCorrectAnswer && (
                                    <span className="shrink-0 text-[10px] uppercase font-bold text-emerald-700 bg-emerald-200 px-1.5 py-0.5 rounded ml-1">
                                      Correct Solution
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Pedagogical Explanation & Error Breakdown */}
                          <div className="text-[11px] p-2.5 rounded-lg bg-white border border-slate-200 text-slate-600">
                            <strong className="text-slate-800">Pedagogical Analysis: </strong>
                            {ans.explanation}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-400">
                      <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="text-sm font-semibold text-slate-600">No test questions to inspect yet</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Once this student completes a diagnostic or adaptive quiz, their answers will appear here in detail.
                      </p>
                    </div>
                  )}

                </div>

              </div>

            </div>
          )
        )}

      </div>

      {/* Add New Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add New Student</h3>
                  <p className="text-xs text-slate-500">Register a student to your mentorship roster</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            {modalSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{modalSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAddStudentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Student Full Name
                </label>
                <div className="relative rounded-xl shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Rohan Sharma"
                    className="block w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Student Email Address <span className="font-normal text-slate-400">(format: xyz@gmail.com)</span>
                </label>
                <div className="relative rounded-xl shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. rohan@gmail.com"
                    className="block w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Assign Class
                </label>
                <select
                  value={newClassId}
                  onChange={(e) => setNewClassId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-semibold text-slate-800"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register Student</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic Evaluation Inspection Modal for Mentor */}
      <DynamicEvaluationModal
        isOpen={showEvalModal}
        onClose={() => setShowEvalModal(false)}
        evaluation={activeSubmissionEval}
        student={selectedStudent}
        testTitle={`Mentor Review: ${selectedSubmission?.title || 'Assessment Evaluation'}`}
      />

    </div>
  );
};
