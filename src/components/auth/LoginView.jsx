import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  Mail, 
  User,
  AlertCircle, 
  Eye, 
  EyeOff,
  CheckCircle2
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { ApiClient } from '../../services/apiClient';

export const LoginView = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState('student'); // 'student' | 'mentor' | 'admin'
  const [studentName, setStudentName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex.rivera@cognilearn.edu');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const students = StorageService.getStudents();
  const mentors = StorageService.getMentors();
  const admins = StorageService.getAdmins();

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setErrorMsg('');
    setSuccessMsg('');
    if (role === 'student') {
      setEmail('alex.rivera@cognilearn.edu');
      setStudentName('Alex Rivera');
    } else if (role === 'mentor') {
      setEmail('marcus.vance@cognilearn.edu');
    } else if (role === 'admin') {
      setEmail('s.jenkins@cognilearn.edu');
    }
  };

  const validateEmailFormat = (emailStr) => {
    // Regex for standard email format, e.g. xyz@gmail.com
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(emailStr).trim().toLowerCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    const inputEmail = email.trim().toLowerCase();

    // Verify email format (e.g. xyz@gmail.com)
    if (!validateEmailFormat(inputEmail)) {
      setErrorMsg('Invalid email format. Please provide a valid address (example: xyz@gmail.com).');
      return;
    }

    if (selectedRole === 'student') {
      const allStudents = StorageService.getStudents();
      const normInputName = studentName.trim().toLowerCase();
      let student = allStudents.find(s => 
        s.email?.toLowerCase().trim() === inputEmail ||
        (normInputName && s.name?.toLowerCase().trim() === normInputName)
      );

      if (student) {
        // If student exists and user typed a custom name, update the name
        if (studentName.trim() && student.name !== studentName.trim()) {
          student = StorageService.updateStudent(student.id, { name: studentName.trim() });
        }
        onLoginSuccess(student, 'student');
      } else {
        // Automatically accept any new student name and email!
        const finalName = studentName.trim() || inputEmail.split('@')[0];
        const newStudent = StorageService.addStudent({
          name: finalName,
          email: inputEmail,
          classId: 'class-a'
        });
        ApiClient.addStudent(newStudent); // sync with backend if available
        setSuccessMsg(`Welcome, ${finalName}! Your student profile has been created.`);
        setTimeout(() => {
          onLoginSuccess(newStudent, 'student');
        }, 400);
      }
    } else if (selectedRole === 'mentor') {
      const mentor = mentors.find(m => m.email.toLowerCase() === inputEmail);
      if (mentor) {
        onLoginSuccess(mentor, 'mentor');
      } else {
        setErrorMsg('Academic Mentor not found with this email. Registered mentors: marcus.vance@cognilearn.edu or elena.rostova@cognilearn.edu');
      }
    } else if (selectedRole === 'admin') {
      const admin = admins.find(a => a.email.toLowerCase() === inputEmail);
      if (admin) {
        onLoginSuccess(admin, 'admin');
      } else {
        setErrorMsg('Administrator not found with this email. Registered admin: s.jenkins@cognilearn.edu');
      }
    }
  };

  const getRoleTheme = () => {
    switch (selectedRole) {
      case 'mentor':
        return {
          title: 'Academic Mentor Portal',
          subtitle: 'Sign in to inspect student rosters, question answers, test counts, and assign remedial interventions.',
          buttonBg: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 focus:ring-emerald-500',
          activeTab: 'bg-white text-emerald-700 shadow-sm border-emerald-200',
          pillBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          accentColor: 'text-emerald-600'
        };
      case 'admin':
        return {
          title: 'Administrator Command Center',
          subtitle: 'Sign in to inspect institutional classes, compare cohorts side-by-side, and monitor progress.',
          buttonBg: 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20 focus:ring-purple-500',
          activeTab: 'bg-white text-purple-700 shadow-sm border-purple-200',
          pillBg: 'bg-purple-100 text-purple-800 border-purple-200',
          accentColor: 'text-purple-600'
        };
      case 'student':
      default:
        return {
          title: 'Student Learning Workspace',
          subtitle: 'Enter your name and email to access your adaptive learning path, diagnostic test, and quizzes.',
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
            Select your account type below to access your learning portal.
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

            {/* Success Message Box */}
            {successMsg && (
              <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2 animate-in fade-in duration-150">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Student Name Field (Accepts ANY student name) */}
              {selectedRole === 'student' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Student Full Name
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g. Jitesh Gupta, Alex Rivera, or your name"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Enter any student name. If you are new, an account will be created automatically.
                  </p>
                </div>
              )}

              {/* Email Address Field with format validation (e.g. xyz@gmail.com) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Email Address <span className="text-[11px] text-slate-400 font-normal">(format: xyz@gmail.com)</span>
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
                    placeholder="e.g. xyz@gmail.com"
                  />
                </div>
              </div>

              {/* Password */}
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

            {/* Helper Hint */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-400">
                {selectedRole === 'student' ? (
                  <span>Students can use any name and valid email (e.g. <strong>xyz@gmail.com</strong>).</span>
                ) : selectedRole === 'mentor' ? (
                  <span>Mentor accounts: <strong>marcus.vance@cognilearn.edu</strong></span>
                ) : (
                  <span>Administrator account: <strong>s.jenkins@cognilearn.edu</strong></span>
                )}
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
