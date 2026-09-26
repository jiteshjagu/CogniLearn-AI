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
  ChevronDown
} from 'lucide-react';
import { useGeminiChat } from '../../hooks/useGeminiChat';
import { SUBJECTS_REGISTRY, getSubjectById } from '../../data/subjectRegistry';

export const AiTutorDrawer = ({ 
  student, 
  currentSubjectId = 'mathematics' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const samplePrompts = {
    mathematics: [
      '💡 Explain difference of squares with a real-world analogy',
      '📐 How do I factor 3x² + 7x + 2 step-by-step?',
      '⚡ What is the quadratic formula discriminant?'
    ],
    science: [
      '🔬 Explain the Second Law of Thermodynamics with an analogy',
      '⚗️ What is the difference between exothermic and endothermic?',
      '🧬 How does cellular respiration produce ATP?'
    ],
    english: [
      '📖 What is the difference between a claim and an assertion?',
      '✍️ How do I fix a dangling modifier step-by-step?',
      '🎭 Explain irony using an everyday scenario'
    ],
    history: [
      '🏛️ Explain the Truman Doctrine vs Marshall Plan',
      '📜 What were the core causes of the Industrial Revolution?',
      '⏳ How do primary sources differ from secondary historiography?'
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
          <span className="hidden sm:inline">AI Study Companion (gemini-1.5-flash)</span>
        </button>
      )}

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-full sm:w-[420px] max-h-[90vh] h-[640px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          
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
                    <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-blue-500/30 text-blue-200 font-mono">
                      1.5-flash
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Active Subject: <strong>{activeSubject.label}</strong></span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close tutor"
              >
                <X className="w-4 h-4" />
              </button>
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
                      {!isUser && msg.model && (
                        <span className="font-mono text-[9px] uppercase tracking-wider">
                          {msg.model}
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
                    <span>CogniAI is reasoning via gemini-1.5-flash...</span>
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
                placeholder={`Ask anything about ${activeSubject.label}...`}
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
    </>
  );
};
