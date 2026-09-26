import React, { useState } from 'react';
import { 
  AlertTriangle, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Filter,
  CheckCircle2,
  Info
} from 'lucide-react';
import { SUBJECTS_MAP } from '../../../data/subjectRegistry';

/**
 * Knowledge Gap Detection Component
 * Displays per-subject breakdown of weak concepts, error patterns, and low-retention topics.
 */
export const KnowledgeGapDetection = ({ 
  gaps = [], 
  selectedSubjectId = 'all',
  onAddressGap 
}) => {
  const [severityFilter, setSeverityFilter] = useState('all'); // 'all' | 'critical' | 'needs-review'

  // Filter gaps by severity
  const displayedGaps = gaps.filter(gap => {
    if (severityFilter === 'all') return true;
    return gap.severity === severityFilter;
  });

  const criticalCount = gaps.filter(g => g.severity === 'critical').length;
  const needsReviewCount = gaps.filter(g => g.severity === 'needs-review').length;

  return (
    <section className="space-y-4">
      
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 bg-red-500 rounded-full" />
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              2. Knowledge Gap Detection
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {gaps.length} Detected
            </span>
          </div>
          <p className="text-xs text-slate-500 ml-4 mt-0.5">
            Targeted diagnostic analysis identifying conceptual vulnerabilities and prerequisite bottlenecks
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-white p-1 rounded-xl border border-slate-200/80 shadow-2xs">
          <button
            onClick={() => setSeverityFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              severityFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All ({gaps.length})
          </button>
          <button
            onClick={() => setSeverityFilter('critical')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              severityFilter === 'critical'
                ? 'bg-red-600 text-white'
                : 'text-red-700 hover:bg-red-50'
            }`}
          >
            <AlertCircle className="w-3 h-3" />
            <span>Critical ({criticalCount})</span>
          </button>
          <button
            onClick={() => setSeverityFilter('needs-review')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              severityFilter === 'needs-review'
                ? 'bg-amber-600 text-white'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Needs Review ({needsReviewCount})</span>
          </button>
        </div>
      </div>

      {/* Gaps List / Grid */}
      {displayedGaps.length === 0 ? (
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-6 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-emerald-900">
            {severityFilter === 'all'
              ? 'No Knowledge Gaps Detected!'
              : `No ${severityFilter === 'critical' ? 'Critical Gaps' : 'Needs-Review Gaps'} in this view`}
          </h4>
          <p className="text-xs text-emerald-700 max-w-md mx-auto">
            Great job! You have demonstrated solid foundational comprehension across your active subjects.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {displayedGaps.map((gap) => {
            const subject = SUBJECTS_MAP[gap.subjectId] || SUBJECTS_MAP.mathematics;
            const isCritical = gap.severity === 'critical';

            return (
              <div
                key={gap.id}
                className={`relative bg-white rounded-2xl p-4 sm:p-5 border transition-all hover:shadow-md flex flex-col justify-between ${
                  isCritical 
                    ? 'border-red-200 hover:border-red-300' 
                    : 'border-amber-200 hover:border-amber-300'
                }`}
              >
                <div>
                  
                  {/* Top Meta Line */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    
                    {/* Subject Tag */}
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${subject.colorToken.badge}`}>
                      {subject.label}
                    </span>

                    {/* Severity Tag with Distinct Colors */}
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border ${
                      isCritical
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {isCritical ? (
                        <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      <span>{isCritical ? 'Critical Gap' : 'Needs Review'}</span>
                    </span>

                  </div>

                  {/* Subtopic */}
                  <h3 className="text-base font-bold text-slate-900 tracking-tight mt-1">
                    {subject.label}: {gap.subtopic}
                  </h3>

                  {/* Diagnostic Remedy / Cognitive Trap Insight */}
                  {gap.remedyTip && (
                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 rounded-xl p-2.5 border border-slate-100 leading-relaxed">
                      <span className="font-semibold text-slate-800">Pedagogical Remedy: </span>
                      {gap.remedyTip}
                    </p>
                  )}

                  {/* Accuracy Bar */}
                  {gap.accuracy !== undefined && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span>Assessed Competency</span>
                        <span className="font-mono font-bold text-slate-700">{gap.accuracy}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            isCritical ? 'bg-red-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.max(5, gap.accuracy)}%` }}
                        />
                      </div>
                    </div>
                  )}

                </div>

                {/* Bottom Action Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                    <Clock className="w-3 h-3" />
                    <span>Assessed: {gap.lastAssessed || 'Recent'}</span>
                  </div>

                  {onAddressGap && (
                    <button
                      onClick={() => onAddressGap(gap)}
                      className={`inline-flex items-center gap-1 font-bold transition-colors ${
                        isCritical
                          ? 'text-red-700 hover:text-red-800'
                          : 'text-amber-700 hover:text-amber-800'
                      }`}
                    >
                      <span>Remediate in Roadmap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};
