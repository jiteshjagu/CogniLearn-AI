import React, { useRef, useEffect, useState } from 'react';
import { 
  Brain, 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  AlertCircle,
  RefreshCw,
  Clock,
  Layers,
  HelpCircle,
  BookOpen,
  ChevronDown,
  Key,
  CheckCircle2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useGeminiChat } from '../../hooks/useGeminiChat';
import { SUBJECTS_REGISTRY, getSubjectById } from '../../data/subjectRegistry';
import { ApiClient } from '../../services/apiClient';

export const AiTutorDrawer = ({ 
  student, 
  currentSubjectId = 'mathematics' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [keyStatus, setKeyStatus] = useState({ hasKey: false, model: 'gemini-1.5-flash' });
  const [keyToast, setKeyToast] = useState('');
  const [isSavingKey, setIsSavingKey] = useState(false);
  const messagesEndRef = useRef(null);

  const {
    messages,
    inputVal,
    setInputVal,
    isTyping,
    validationError,
    apiError,
    activeSubjectId,
    changeSubject,
    sendMessage,
    retryLastMessage,
    clearErrors
  } = useGeminiChat({ student, initialSubjectId: currentSubjectId });

  const activeSubject = getSubjectById(activeSubjectId);

  // Check backend API key status on mount
  useEffect(() => {
    ApiClient.getApiKeyStatus().then(status => {
      if (status) setKeyStatus(status);
    });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleSaveApiKey = async (e) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;
    setIsSavingKey(true);
    try {
      await ApiClient.setApiKey(apiKeyInput.trim());
      setKeyStatus({ hasKey: true, model: 'gemini-1.5-flash', source: 'Live Gemini API Connected' });
      setKeyToast('API Key connected successfully! Responses will now be generated via live Gemini 1.5 Flash.');
      setTimeout(() => {
        setKeyToast('');
        setShowKeyModal(false);
      }, 1800);
    } catch (err) {
      alert(err.message || 'Failed to save API key');
    } finally {
      setIsSavingKey(false);
    }
  };

  const samplePrompts = {
    mathematics: [
      '📐 How do I solve 2x + 4 = 10 step-by-step?',
      '💡 Explain difference of squares: x^2 - 16',
      '⚡ How do I factor 2x^2 + 8x using GCF?',
      '🎯 What is the quadratic formula discriminant?'
    ],
    science: [
      '🔬 Explain the Second Law of Thermodynamics with an everyday analogy',
      '⚗️ What is cellular respiration and how does it generate ATP?',
      '🧬 What are Newton\'s 3 Laws of Motion with examples?'
    ],
    english: [
      '📖 What is the difference between Ethos, Pathos, and Logos?',
      '✍️ How do I fix a dangling modifier with examples?',
      '🎭 What makes a strong thesis statement for an argumentative essay?'
    ],
    history: [
      '🏛️ Explain the Truman Doctrine vs Marshall Plan during the Cold War',
      '📜 What were the primary causes of World War I (M-A-I-N)?',
      '⏳ How do primary sources differ from secondary historical accounts?'
    ]
  };

  const currentPrompts = samplePrompts[activeSubjectId] || samplePrompts.mathematics;

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 font-bold text-xs group"
          aria-label="Open AI Academic Tutor"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
          </div>
          <span className="hidden sm:inline">
            {keyStatus.hasKey ? 'AI Tutor (Gemini 1.5 Flash)' : 'AI Study Companion'}
          </span>
          <span className={`w-2 h-2 rounded-full ${keyStatus.hasKey ? 'bg-emerald-400' : 'bg-amber-400'}`} />
        </button>
      )}

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-full sm:w-[440px] max-h-[90vh] h-[650px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold tracking-tight">CogniAI Academic Tutor</h4>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono font-bold ${
                      keyStatus.hasKey 
                        ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/30' 
                        : 'bg-blue-500/30 text-blue-200'
                    }`}>
                      {keyStatus.hasKey ? 'Live Gemini 1.5' : 'Dynamic Engine'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Active Subject: <strong>{activeSubject.label}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: API Key & Close */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowKeyModal(true)}
                  className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold ${
                    keyStatus.hasKey 
                      ? 'text-emerald-400 hover:bg-emerald-500/20' 
                      : 'text-amber-300 hover:bg-amber-400/20'
                  }`}
                  title={keyStatus.hasKey ? 'Gemini API Key Connected' : 'Connect Gemini API Key for live LLM'}
                >
                  <Key className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{keyStatus.hasKey ? 'Connected' : 'Set Key'}</span>
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close tutor"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Subject Grounding Selector Bar */}
            <div className="flex items-center overflow-x-auto gap-1.5 pt-1 border-t border-white/10">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                Subject:
              </span>
              {SUBJECTS_REGISTRY.map((sub) => {
                const isActive = activeSubjectId === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => changeSubject(sub.id)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all shrink-0 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {sub.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-slate-50/50">
            {messages.map((msg) => {
              if (msg.role === 'system') {
                return (
                  <div key={msg.id} className="text-center my-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-200/80 text-[11px] text-slate-600 font-medium">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              const isUser = msg.role === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                        : 'bg-white border border-slate-200/80 text-slate-800 shadow-2xs rounded-bl-xs'
                    }`}
                  >
                    {msg.text}

                    <div className={`mt-2 pt-1 border-t text-[10px] flex items-center justify-between ${
                      isUser ? 'border-white/20 text-blue-100' : 'border-slate-100 text-slate-400'
                    }`}>
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                          {msg.model || 'cogni-tutor'}
                        </span>
                      )}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Skeleton Indicator */}
            {isTyping && (
              <div className="flex gap-2.5 items-start">
                <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs space-y-2 max-w-[80%] w-64 animate-pulse">
                  <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-[11px]">
                    <Sparkles className="w-3 h-3 animate-spin" />
                    <span>CogniAI is reasoning your answer...</span>
                  </div>
                  <div className="h-2.5 bg-slate-200 rounded-full w-full"></div>
                  <div className="h-2.5 bg-slate-200 rounded-full w-4/5"></div>
                  <div className="h-2.5 bg-slate-200 rounded-full w-2/3"></div>
                </div>
              </div>
            )}

            {/* Error UI Display */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-xs text-red-800 space-y-2 animate-in fade-in">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold">
                      {apiError.type === 'rate-limit' ? 'Rate Limit Reached (429)' : 'Tutoring Request Error'}
                    </p>
                    <p className="text-[11px] text-red-700 mt-0.5">
                      {apiError.message}
                    </p>
                    {apiError.retryAfter && (
                      <p className="text-[10px] text-red-600 font-mono mt-1">
                        Recommended retry window: ~{apiError.retryAfter} seconds.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-red-200">
                  <button
                    onClick={clearErrors}
                    className="px-2.5 py-1 text-[11px] text-slate-600 hover:text-slate-900"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={retryLastMessage}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[11px] font-bold shadow-2xs transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Retry Question</span>
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-2 border-t border-slate-100 bg-white overflow-x-auto whitespace-nowrap flex gap-1.5">
            {currentPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(q)}
                disabled={isTyping}
                className="inline-block px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-[10px] font-medium text-slate-600 transition-colors shrink-0 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box & Inline Validation */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-slate-200 bg-white space-y-1.5"
          >
            {/* Inline Client Validation Error */}
            {validationError && (
              <div className="text-[11px] text-red-600 font-semibold flex items-center gap-1 px-1 animate-in fade-in">
                <AlertCircle className="w-3 h-3" />
                <span>{validationError}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  if (validationError) clearErrors();
                }}
                placeholder={`Ask any question about ${activeSubject.label}...`}
                className={`flex-1 px-3 py-2 text-xs rounded-xl border focus:outline-hidden focus:ring-2 transition-all ${
                  validationError 
                    ? 'border-red-300 ring-red-400 focus:ring-red-400' 
                    : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              <button
                type="submit"
                disabled={isTyping}
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-xs"
                title="Send to AI Tutor"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

        </div>
      )}

      {/* Connect Google Gemini API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-amber-500">
                <Key className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900">Connect Google Gemini API</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Connect your free Google Gemini API key to activate live <strong>gemini-1.5-flash</strong> model responses. When connected, answers are generated in real-time by Google AI.
            </p>

            <form onSubmit={handleSaveApiKey} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Google Gemini API Key
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {keyToast && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{keyToast}</span>
                </div>
              )}

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>How to get a free Gemini API key:</span>
                </div>
                <p>1. Visit Google AI Studio at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">aistudio.google.com</a></p>
                <p>2. Click <strong>"Create API Key"</strong> (100% free with generous tier).</p>
                <p>3. Paste it above or place in your project's <code>.env</code> file under <code>GEMINI_API_KEY</code>.</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingKey || !apiKeyInput.trim()}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {isSavingKey ? 'Connecting...' : 'Save & Connect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
