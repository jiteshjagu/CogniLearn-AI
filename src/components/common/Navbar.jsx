import React, { useState } from 'react';
import { 
  GraduationCap, 
  User, 
  Users, 
  ShieldCheck, 
  LogOut, 
  RotateCcw, 
  Key, 
  Sparkles, 
  ChevronDown,
  BookOpen,
  Brain,
  Check
} from 'lucide-react';
import { StorageService } from '../../services/storageService';

export const Navbar = ({ 
  currentUser, 
  currentRole, 
  onLogout, 
  onSwitchUser, 
  onDataReset,
  onNavigateHome
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(StorageService.getApiKey() || '');
  const [keySavedToast, setKeySavedToast] = useState(false);

  const students = StorageService.getStudents();
  const mentors = StorageService.getMentors();
  const admins = StorageService.getAdmins();

  const handleSaveApiKey = () => {
    StorageService.setApiKey(apiKeyInput.trim());
    setKeySavedToast(true);
    setTimeout(() => {
      setKeySavedToast(false);
      setShowKeyModal(false);
    }, 1200);
  };

  const getRoleBadge = () => {
    switch (currentRole) {
      case 'admin':
        return { label: 'Administrator', bg: 'bg-purple-100 text-purple-700 border-purple-200', icon: ShieldCheck };
      case 'mentor':
        return { label: 'Academic Mentor', bg: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: Users };
      case 'student':
      default:
        return { label: 'Student', bg: 'bg-blue-100 text-blue-700 border-blue-200', icon: GraduationCap };
    }
  };

  const roleInfo = getRoleBadge();
  const RoleIcon = roleInfo.icon;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div 
            onClick={onNavigateHome}
            className="flex items-center gap-3 cursor-pointer group transition-transform active:scale-98"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/35 transition-all">
              <Brain className="w-5 h-5 transition-transform group-hover:rotate-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  CogniLearn AI
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200/60">
                  Adaptive 2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                Personalized Prerequisite & Knowledge Gap Intelligence
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          {currentUser && (
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Quick Persona Switcher Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors shadow-2xs"
                  title="Switch Demo Profile"
                >
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold border ${roleInfo.bg}`}>
                    <RoleIcon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{roleInfo.label}:</span>
                    <span className="font-bold text-slate-800">{currentUser.name?.split(' ')[0]}</span>
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {showRoleMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Switch Test Persona</p>
                      <p className="text-xs text-slate-500 mt-0.5">Quickly test all 3 platform viewpoints</p>
                    </div>

                    {/* Students list */}
                    <div className="py-1">
                      <div className="px-3 py-1 text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" /> Students
                      </div>
                      {students.slice(0, 3).map(st => (
                        <button
                          key={st.id}
                          onClick={() => {
                            onSwitchUser(st, 'student');
                            setShowRoleMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition-colors ${
                            currentUser.id === st.id ? 'bg-blue-50/70 font-semibold text-blue-700' : 'text-slate-700'
                          }`}
                        >
                          <div className="truncate">
                            <div>{st.name}</div>
                            <div className="text-[10px] text-slate-400">
                              {st.status} • Mastery {st.overallMastery}%
                            </div>
                          </div>
                          {currentUser.id === st.id && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                        </button>
                      ))}
                    </div>

                    {/* Mentors */}
                    <div className="py-1 border-t border-slate-100">
                      <div className="px-3 py-1 text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> Academic Mentors
                      </div>
                      {mentors.map(m => (
                        <button
                          key={m.id}
                          onClick={() => {
                            onSwitchUser(m, 'mentor');
                            setShowRoleMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                            currentUser.id === m.id ? 'bg-emerald-50/70 font-semibold text-emerald-700' : 'text-slate-700'
                          }`}
                        >
                          <div className="truncate">
                            <div>{m.name}</div>
                            <div className="text-[10px] text-slate-400">{m.title}</div>
                          </div>
                          {currentUser.id === m.id && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                        </button>
                      ))}
                    </div>

                    {/* Admin */}
                    <div className="py-1 border-t border-slate-100">
                      <div className="px-3 py-1 text-[11px] font-semibold text-purple-600 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Administrator
                      </div>
                      {admins.map(a => (
                        <button
                          key={a.id}
                          onClick={() => {
                            onSwitchUser(a, 'admin');
                            setShowRoleMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-purple-50 transition-colors ${
                            currentUser.id === a.id ? 'bg-purple-50/70 font-semibold text-purple-700' : 'text-slate-700'
                          }`}
                        >
                          <div className="truncate">
                            <div>{a.name}</div>
                            <div className="text-[10px] text-slate-400">{a.title}</div>
                          </div>
                          {currentUser.id === a.id && <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* API Key Modal Button */}
              <button
                onClick={() => setShowKeyModal(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Configure Gemini API Key"
              >
                <Key className="w-3.5 h-3.5 text-amber-500" />
                <span>API Settings</span>
              </button>

              {/* Reset Demo Data Button */}
              <button
                onClick={() => {
                  if (confirm('Reset platform data back to initial demo baseline?')) {
                    onDataReset();
                  }
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Reset all demo classes, students, and test records"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" />
                <span>Reset Demo</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
                title="Back to Login page"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back to Login</span>
              </button>

            </div>
          )}

        </div>
      </header>

      {/* Gemini API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Google Gemini API (Optional)</h3>
                <p className="text-xs text-slate-500">Live AI tutoring & cognitive misconception breakdown</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              The platform features an embedded, high-precision offline pedagogical engine that works right out of the box with zero setup. You can also optionally connect your Google Gemini API key for real-time live LLM inference.
            </p>

            <div className="space-y-3 mb-5">
              <label className="block text-xs font-semibold text-slate-700">
                Gemini API Key
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-[11px] text-slate-400">
                Key is stored only in your local browser storage.
              </p>
            </div>

            {keySavedToast && (
              <div className="mb-4 p-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" /> API Key saved successfully!
              </div>
            )}

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSaveApiKey}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
