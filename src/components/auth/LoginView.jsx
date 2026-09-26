import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Brain, 
  Target, 
  LineChart, 
  CheckCircle2, 
  Lock,
  Mail,
  Zap
} from 'lucide-react';
import { StorageService } from '../../services/storageService';

export const LoginView = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState('student'); // 'student' | 'mentor' | 'admin'
  const [email, setEmail] = useState('alex.rivera@cognilearn.edu');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');

  const students = StorageService.getStudents();
  const mentors = StorageService.getMentors();
  const admins = StorageService.getAdmins();

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setErrorMsg('');
    if (role === 'student') {
      setEmail('alex.rivera@cognilearn.edu');
    } else if (role === 'mentor') {
      setEmail('marcus.vance@cognilearn.edu');
    } else if (role === 'admin') {
      setEmail('s.jenkins@cognilearn.edu');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (selectedRole === 'student') {
      const student = students.find(s => s.email.toLowerCase() === email.trim().toLowerCase());
      if (student) {
        onLoginSuccess(student, 'student');
      } else {
        setErrorMsg('Student profile not found. Try one of the quick demo profiles below!');
      }
    } else if (selectedRole === 'mentor') {
      const mentor = mentors.find(m => m.email.toLowerCase() === email.trim().toLowerCase());
      if (mentor) {
        onLoginSuccess(mentor, 'mentor');
      } else {
        setErrorMsg('Academic Mentor not found. Try one of the quick demo profiles below!');
      }
    } else if (selectedRole === 'admin') {
      const admin = admins.find(a => a.email.toLowerCase() === email.trim().toLowerCase());
      if (admin) {
        onLoginSuccess(admin, 'admin');
      } else {
        setErrorMsg('Administrator not found. Try one of the quick demo profiles below!');
      }
    }
  };

  const handleQuickLogin = (user, role) => {
    onLoginSuccess(user, role);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-blue-50/20 to-slate-100">
      
      <div className="max-w-4xl mx-auto w-full">

        {/* Hero Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 text-xs font-semibold mb-3 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI-Driven Diagnostic & Dynamic Prerequisite Calibration</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Adaptive Personalized Learning Platform
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Experience the complete closed-loop cycle: Diagnostic Assessment → Knowledge Gap Detection → Personalized Learning → Adaptive Quizzes → Continuous Profile Growth.
          </p>
        </div>

        {/* Main Authentication Container */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden">
          
          {/* Role Selection Tabs */}
          <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50/70 p-2 gap-2">
            
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedRole === 'student'
                  ? 'bg-white text-blue-600 shadow-md shadow-blue-500/10 border border-blue-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className={`p-1 rounded-lg ${selectedRole === 'student' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}`}>
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="tracking-tight">Student Portal</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('mentor')}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedRole === 'mentor'
                  ? 'bg-white text-emerald-600 shadow-md shadow-emerald-500/10 border border-emerald-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className={`p-1 rounded-lg ${selectedRole === 'mentor' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                <Users className="w-4 h-4" />
              </div>
              <span className="tracking-tight">Academic Mentor</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedRole === 'admin'
                  ? 'bg-white text-purple-600 shadow-md shadow-purple-500/10 border border-purple-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className={`p-1 rounded-lg ${selectedRole === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-600'}`}>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="tracking-tight">Administrator</span>
            </button>

          </div>

          <div className="p-6 sm:p-8">

            {/* Role Header Banner */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Selected Viewpoint</span>
                <h2 className="text-base sm:text-lg font-bold text-slate-800 capitalize">
                  {selectedRole === 'student' && 'Student Learning Workspace'}
                  {selectedRole === 'mentor' && 'Academic Mentor & Diagnostics Portal'}
                  {selectedRole === 'admin' && 'Administrator & Class Analytics Hub'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedRole === 'student' && 'Access diagnostic tests, view prerequisite gap graphs, and take real-time adaptive quizzes.'}
                  {selectedRole === 'mentor' && 'Track student test history, inspect exact question answers, and assign targeted interventions.'}
                  {selectedRole === 'admin' && 'Monitor all classes (Class A, Class B), compare class performance side-by-side, and track gaps.'}
                </p>
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-2xs">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  Instant Access Enabled
                </span>
              </div>
            </div>

            {/* Quick 1-Click Demo Profiles */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  Recommended 1-Click Demo Profiles
                </h3>
                <span className="text-[11px] text-slate-400">Click any card to log in instantly</span>
              </div>

              {selectedRole === 'student' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Alex Rivera */}
                  <div
                    onClick={() => handleQuickLogin(students[0], 'student')}
                    className="p-3.5 rounded-xl border-2 border-amber-200 bg-amber-50/50 hover:bg-amber-100/60 hover:border-amber-400 cursor-pointer transition-all shadow-xs group"
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <img src={students[0].avatar} alt={students[0].name} className="w-9 h-9 rounded-full object-cover border border-amber-300" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate group-hover:text-amber-900">{students[0].name}</div>
                        <span className="inline-block text-[10px] font-semibold text-amber-700 bg-amber-200/60 px-1.5 py-0.5 rounded">
                          Critical Gap Demo
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      Struggles with Factoring Polynomials. Demonstrates prerequisite gap detection and mentor question inspector.
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] font-bold text-amber-700">
                      <span>Log in as Alex</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Jordan Taylor (New Student) */}
                  <div
                    onClick={() => handleQuickLogin(students[5], 'student')}
                    className="p-3.5 rounded-xl border-2 border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 hover:border-blue-400 cursor-pointer transition-all shadow-xs group"
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <img src={students[5].avatar} alt={students[5].name} className="w-9 h-9 rounded-full object-cover border border-blue-300" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-900">{students[5].name}</div>
                        <span className="inline-block text-[10px] font-semibold text-blue-700 bg-blue-200/60 px-1.5 py-0.5 rounded">
                          Fresh Student Cycle
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      Brand new student. Take the Diagnostic Assessment from scratch to see the 5-stage adaptive pipeline live!
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-blue-200/60 flex items-center justify-between text-[11px] font-bold text-blue-700">
                      <span>Log in as Jordan</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Maya Chen */}
                  <div
                    onClick={() => handleQuickLogin(students[1], 'student')}
                    className="p-3.5 rounded-xl border-2 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60 hover:border-emerald-400 cursor-pointer transition-all shadow-xs group"
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <img src={students[1].avatar} alt={students[1].name} className="w-9 h-9 rounded-full object-cover border border-emerald-300" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-900">{students[1].name}</div>
                        <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-200/60 px-1.5 py-0.5 rounded">
                          Advanced Mastery (92%)
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      High performer in Class 10-A. Access Hard-tier adaptive challenges and mastery reinforcement.
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] font-bold text-emerald-700">
                      <span>Log in as Maya</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                </div>
              )}

              {selectedRole === 'mentor' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mentors.map(m => (
                    <div
                      key={m.id}
                      onClick={() => handleQuickLogin(m, 'mentor')}
                      className="p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50/40 hover:bg-emerald-100/60 hover:border-emerald-400 cursor-pointer transition-all shadow-xs group flex items-start gap-3"
                    >
                      <img src={m.avatar} alt={m.name} className="w-11 h-11 rounded-full object-cover border border-emerald-300 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-900">{m.name}</h4>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-200/60 px-2 py-0.5 rounded-full">
                            {m.assignedClasses.length} Classes Assigned
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{m.title}</p>
                        <p className="text-[11px] text-slate-600 mt-2">
                          Specialization: {m.specialization}
                        </p>
                        <div className="mt-2 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs font-bold text-emerald-700">
                          <span>Open Mentor Dashboard</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedRole === 'admin' && (
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
                  {admins.map(a => (
                    <div
                      key={a.id}
                      onClick={() => handleQuickLogin(a, 'admin')}
                      className="p-4 rounded-xl border-2 border-purple-200 bg-purple-50/40 hover:bg-purple-100/60 hover:border-purple-400 cursor-pointer transition-all shadow-xs group flex items-start gap-3"
                    >
                      <img src={a.avatar} alt={a.name} className="w-12 h-12 rounded-full object-cover border border-purple-300 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-900">{a.name}</h4>
                          <span className="text-[10px] font-semibold text-purple-700 bg-purple-200/60 px-2 py-0.5 rounded-full">
                            Full Institutional Scope
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{a.title} • {a.department}</p>
                        <p className="text-xs text-slate-600 mt-2">
                          Access institutional analytics, Class A vs Class B comparative evaluation, and student roster drilldowns.
                        </p>
                        <div className="mt-3 pt-2 border-t border-purple-200/60 flex items-center justify-between text-xs font-bold text-purple-700">
                          <span>Open Administrator Analytics Portal</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Standard Login Form Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-semibold">Or Sign In with Credentials</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
              
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Email Address
                </label>
                <div className="relative rounded-xl shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="name@cognilearn.edu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Password
                </label>
                <div className="relative rounded-xl shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                  selectedRole === 'student'
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                    : selectedRole === 'mentor'
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                      : 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20'
                }`}
              >
                <span>Sign In to {selectedRole === 'student' ? 'Student' : selectedRole === 'mentor' ? 'Academic Mentor' : 'Administrator'} Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>

          </div>

          {/* Platform Features Footer */}
          <div className="bg-slate-900 text-white p-6 sm:p-8">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 text-center">
              The 5-Step Adaptive Learning Architecture
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="text-blue-400 font-bold text-xs">1. Diagnostic</div>
                <div className="text-[11px] text-slate-400 mt-1">Multi-concept baseline assessment</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="text-amber-400 font-bold text-xs">2. Gap Detection</div>
                <div className="text-[11px] text-slate-400 mt-1">Prerequisite bottleneck tracing</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="text-indigo-400 font-bold text-xs">3. Custom Path</div>
                <div className="text-[11px] text-slate-400 mt-1">Topological remedial modules</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="text-emerald-400 font-bold text-xs">4. Adaptive Quiz</div>
                <div className="text-[11px] text-slate-400 mt-1">Real-time difficulty adjustment</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 col-span-2 sm:col-span-1">
                <div className="text-violet-400 font-bold text-xs">5. Continuous Profile</div>
                <div className="text-[11px] text-slate-400 mt-1">Live mastery growth & updates</div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
