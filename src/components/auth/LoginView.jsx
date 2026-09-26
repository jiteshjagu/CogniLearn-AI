import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Lock,
  Mail,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { StorageService } from '../../services/storageService';

export const LoginView = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState('student'); // 'student' | 'mentor' | 'admin'
  const [email, setEmail] = useState('alex.rivera@cognilearn.edu');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    const inputEmail = email.trim().toLowerCase();

    if (selectedRole === 'student') {
      const student = students.find(s => s.email.toLowerCase() === inputEmail);
      if (student) {
        onLoginSuccess(student, 'student');
      } else {
        setErrorMsg('No student account found with this email. Please check your credentials or contact administration.');
      }
    } else if (selectedRole === 'mentor') {
      const mentor = mentors.find(m => m.email.toLowerCase() === inputEmail);
      if (mentor) {
        onLoginSuccess(mentor, 'mentor');
      } else {
        setErrorMsg('No academic mentor account found with this email. Please check your credentials.');
      }
    } else if (selectedRole === 'admin') {
      const admin = admins.find(a => a.email.toLowerCase() === inputEmail);
      if (admin) {
        onLoginSuccess(admin, 'admin');
      } else {
        setErrorMsg('No administrator account found with this email.');
      }
    }
  };

  const getRoleTheme = () => {
    switch (selectedRole) {
      case 'mentor':
        return {
          title: 'Academic Mentor Portal',
          subtitle: 'Sign in to inspect student progress, review test question answers, and assign interventions.',
          buttonBg: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 focus:ring-emerald-500',
          activeTab: 'bg-white text-emerald-700 shadow-sm border-emerald-200',
          pillBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          accentColor: 'text-emerald-600'
        };
      case 'admin':
        return {
          title: 'Administrator Command Center',
          subtitle: 'Sign in to monitor class rosters, compare cohort performance, and view institutional analytics.',
          buttonBg: 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20 focus:ring-purple-500',
          activeTab: 'bg-white text-purple-700 shadow-sm border-purple-200',
          pillBg: 'bg-purple-100 text-purple-800 border-purple-200',
          accentColor: 'text-purple-600'
        };
      case 'student':
      default:
        return {
          title: 'Student Learning Workspace',
          subtitle: 'Sign in to take diagnostic tests, view prerequisite gap graphs, and practice adaptive quizzes.',
          buttonBg: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 focus:ring-blue-500',
          activeTab: 'bg-white text-blue-700 shadow-sm border-blue-200',
          pillBg: 'bg-blue-100 text-blue-800 border-blue-200',
          accentColor: 'text-blue-600'
        };
    }
  };

  const theme = getRoleTheme();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-blue-50/20 to-slate-100">
      
      <div className="max-w-xl mx-auto w-full">

        {/* Hero Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 text-xs font-semibold mb-3 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI-Driven Adaptive Learning Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In to CogniLearn AI
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Select your account type below to access your dedicated learning portal.
          </p>
        </div>

        {/* Main Authentication Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-200/90 overflow-hidden">
          
          {/* Role Selection Tabs */}
          <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 p-2 gap-1.5">
            
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedRole === 'student'
                  ? 'bg-white text-blue-700 shadow-sm border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('mentor')}
              className={`flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedRole === 'mentor'
                  ? 'bg-white text-emerald-700 shadow-sm border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">Academic Mentor</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedRole === 'admin'
                  ? 'bg-white text-purple-700 shadow-sm border border-purple-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
              <span className="truncate">Administrator</span>
            </button>

          </div>

          <div className="p-6 sm:p-8">

            {/* Portal Header */}
            <div className="mb-6">
              <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-1.5 ${theme.pillBg}`}>
                {selectedRole.toUpperCase()} PORTAL
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                {theme.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                {theme.subtitle}
              </p>
            </div>

            {/* Error Message Box */}
            {errorMsg && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Standard Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Email Address
                </label>
                <div className="relative rounded-xl shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="name@cognilearn.edu"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Password
                  </label>
                  <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[11px] font-semibold text-blue-600 hover:text-blue-800">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative rounded-xl shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2 ${theme.buttonBg}`}
              >
                <span>Sign In as {selectedRole === 'student' ? 'Student' : selectedRole === 'mentor' ? 'Academic Mentor' : 'Administrator'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>

            {/* Quick Demo Helper Hint */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-400">
                Authorized accounts on record:
                <br />
                <span className="font-semibold text-slate-600">alex.rivera@cognilearn.edu</span> (Student) •{' '}
                <span className="font-semibold text-slate-600">marcus.vance@cognilearn.edu</span> (Mentor) •{' '}
                <span className="font-semibold text-slate-600">s.jenkins@cognilearn.edu</span> (Admin)
              </p>
            </div>

          </div>

          {/* Adaptive Learning Cycle Footer */}
          <div className="bg-slate-900 text-white p-5 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold mb-2">
              Adaptive Learning Closed-Loop Cycle
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-300">
              <span className="text-blue-400">Assessment</span>
              <span className="text-slate-600">→</span>
              <span className="text-amber-400">Knowledge Analysis</span>
              <span className="text-slate-600">→</span>
              <span className="text-indigo-400">Personalized Path</span>
              <span className="text-slate-600">→</span>
              <span className="text-emerald-400">Adaptive Quiz</span>
              <span className="text-slate-600">→</span>
              <span className="text-purple-400">Updated Recommendations</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
