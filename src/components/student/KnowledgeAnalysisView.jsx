import React, { useState } from 'react';
import { 
  Network, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Unlock, 
  Info, 
  Sparkles, 
  Layers, 
  Target, 
  TrendingUp,
  BrainCircuit,
  CornerDownRight
} from 'lucide-react';
import { CONCEPTS, CONCEPT_LIST } from '../../data/conceptsData';

export const KnowledgeAnalysisView = ({ student, onProceedToLearningPath }) => {
  const [selectedConceptId, setSelectedConceptId] = useState(
    student.rootPrerequisiteBottleneck || 'c4'
  );

  const conceptMastery = student.conceptMastery || {};
  const criticalGaps = student.criticalGaps || [];
  const rootBottleneckId = student.rootPrerequisiteBottleneck;

  const selectedConcept = CONCEPTS[selectedConceptId] || CONCEPTS['c4'];
  const selectedMastery = conceptMastery[selectedConceptId] ?? 50;

  // Topological graph structure definition for rendering
  const graphLevels = [
    { level: 1, title: 'Tier 1: Axiomatic Foundations', concepts: ['c1'] },
    { level: 2, title: 'Tier 2: Linear & Algebraic Structures', concepts: ['c2', 'c3'] },
    { level: 3, title: 'Tier 3: Non-Linear Prerequisite Bridge', concepts: ['c4'] },
    { level: 4, title: 'Tier 4: Quadratic Systems & Models', concepts: ['c5', 'c7'] },
    { level: 5, title: 'Tier 5: Coordinate Visualizations', concepts: ['c6'] }
  ];

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-6">
      
      {/* View Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
              Stage 2: Diagnostic Analysis
            </span>
            <h2 className="text-xl font-bold text-slate-900">Knowledge Gap & Prerequisite Graph</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visualizing concept dependencies. Green denotes mastery, while glowing red nodes represent bottleneck gaps blocking advancement.
          </p>
        </div>

        <button
          onClick={onProceedToLearningPath}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
        >
          <span>Generate Personalized Path</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Critical Bottleneck Alert Banner */}
      {rootBottleneckId && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-red-50 via-rose-50 to-amber-50 border-2 border-red-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-100 px-2 py-0.5 rounded">
                  Root Prerequisite Bottleneck Detected
                </span>
                <span className="text-xs text-slate-400">Prerequisite Tree Traced</span>
              </div>
              <h3 className="text-base font-bold text-red-950 mt-1">
                {CONCEPTS[rootBottleneckId]?.name} ({conceptMastery[rootBottleneckId]}% Mastery)
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
                The AI engine identified that gaps in <strong>{CONCEPTS[rootBottleneckId]?.name}</strong> are directly cascading into downstream failures in <strong>Quadratic Equations</strong> and <strong>Parabolic Graphs</strong>. Resolving this foundational gap is required before continuing to higher-tier units.
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedConceptId(rootBottleneckId)}
            className="shrink-0 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Inspect Gap Node
          </button>
        </div>
      )}

      {/* Interactive Concept Dependency Graph Canvas */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Network className="w-4 h-4 text-blue-600" />
              <span>Hierarchical Concept Dependency Map</span>
            </h3>
            <p className="text-xs text-slate-400">Click any concept node to inspect its prerequisite chain and diagnostic mastery</p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Mastered (≥75%)
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Developing (50-74%)
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" /> Critical Gap (&lt;50%)
            </span>
          </div>
        </div>

        {/* Graph Nodes Layered by Pedagogical Tiers */}
        <div className="space-y-6">
          {graphLevels.map(lvl => (
            <div key={lvl.level} className="relative">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 pl-2">
                {lvl.title}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {lvl.concepts.map(cId => {
                  const concept = CONCEPTS[cId];
                  const mastery = conceptMastery[cId] ?? 0;
                  const isCriticalGap = criticalGaps.includes(cId) || mastery < 50;
                  const isSelected = selectedConceptId === cId;
                  const isRoot = rootBottleneckId === cId;

                  // Check if prerequisites are satisfied
                  const unsatisfiedPrereqs = (concept.prerequisites || []).filter(
                    pId => (conceptMastery[pId] || 0) < 60
                  );
                  const isBlocked = unsatisfiedPrereqs.length > 0;

                  return (
                    <div
                      key={cId}
                      onClick={() => setSelectedConceptId(cId)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                        isSelected
                          ? 'border-blue-600 shadow-md ring-2 ring-blue-500/20 bg-blue-50/20'
                          : isRoot
                            ? 'border-red-400 bg-red-50/40 shadow-xs'
                            : isCriticalGap
                              ? 'border-red-200 bg-red-50/20 hover:border-red-300'
                              : mastery >= 75
                                ? 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-300'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {/* Top Node Header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {concept.category}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {isBlocked && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded flex items-center gap-1" title="Prerequisites not yet mastered">
                              <Lock className="w-2.5 h-2.5" /> Blocked
                            </span>
                          )}
                          <span className={`text-xs font-black px-2 py-0.5 rounded ${
                            mastery >= 75
                              ? 'bg-emerald-100 text-emerald-800'
                              : mastery >= 50
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800 animate-pulse'
                          }`}>
                            {mastery}%
                          </span>
                        </div>
                      </div>

                      {/* Node Title */}
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {concept.name}
                      </h4>

                      {/* Mastery Progress Bar */}
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            mastery >= 75
                              ? 'bg-emerald-500'
                              : mastery >= 50
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${mastery}%` }}
                        />
                      </div>

                      {/* Prerequisite Tags */}
                      {concept.prerequisites && concept.prerequisites.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center gap-1">
                          <CornerDownRight className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">Requires: {concept.prerequisites.map(p => CONCEPTS[p]?.name).join(', ')}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Node Inspector Drawer / Card */}
      {selectedConcept && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Concept Diagnostic Sheet</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">{selectedConcept.category}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedConcept.name}</h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Demonstrated Mastery</div>
                <div className={`text-xl font-black ${
                  selectedMastery >= 75 ? 'text-emerald-600' : selectedMastery >= 50 ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {selectedMastery}%
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-xs">
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">Concept Scope</h4>
              <p className="text-slate-600 leading-relaxed">{selectedConcept.description}</p>

              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mt-4 mb-1">Prerequisite Dependencies</h4>
              {selectedConcept.prerequisites && selectedConcept.prerequisites.length > 0 ? (
                <ul className="space-y-1 text-slate-600">
                  {selectedConcept.prerequisites.map(pId => {
                    const pConcept = CONCEPTS[pId];
                    const pMastery = conceptMastery[pId] ?? 0;
                    return (
                      <li key={pId} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                        <span>{pConcept?.name}</span>
                        <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                          pMastery >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {pMastery}% {pMastery >= 70 ? 'Satisfied' : 'Deficit'}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-slate-400 italic">Foundational concept (no prior prerequisites in this course).</p>
              )}
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Adaptive Recommendation for this Concept
              </h4>
              <p className="text-slate-600 leading-relaxed mb-3">
                {selectedMastery < 50
                  ? `High-priority remedial target. Because mastery is at ${selectedMastery}%, our dynamic engine scheduled a 3-step interactive lesson focusing on core decomposition before unlocking adaptive testing.`
                  : selectedMastery < 75
                    ? `Developing competency. Ready for targeted adaptive quizzes to bridge remaining edge-case errors.`
                    : `Solid mastery achieved (${selectedMastery}%). Optional enrichment available; safe to proceed with higher-tier dependencies.`}
              </p>

              <button
                onClick={onProceedToLearningPath}
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Launch Lesson on {selectedConcept.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
