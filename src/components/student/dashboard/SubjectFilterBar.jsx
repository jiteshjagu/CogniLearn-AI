import React from 'react';
import { 
  Calculator, 
  Atom, 
  BookOpen, 
  Landmark, 
  LayoutGrid 
} from 'lucide-react';
import { SUBJECTS_REGISTRY, calculateSubjectProgress } from '../../../data/subjectRegistry';

const ICON_MAP = {
  Calculator,
  Atom,
  BookOpen,
  Landmark
};

export const SubjectFilterBar = ({ 
  selectedSubjectId = 'all', 
  onSelectSubject, 
  student 
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Label */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Subject Catalog:
          </span>
          <span className="text-xs text-slate-500 hidden md:inline">
            Filter analytics, gaps, and milestones by subject
          </span>
        </div>

        {/* Buttons List rendered strictly from canonical SUBJECTS_REGISTRY */}
        <div className="flex items-center overflow-x-auto gap-2 pb-1 sm:pb-0">
          
          {/* 'All Subjects' option */}
          <button
            onClick={() => onSelectSubject('all')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedSubjectId === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All Subjects</span>
          </button>

          {/* 4 Canonical Subjects */}
          {SUBJECTS_REGISTRY.map((subj) => {
            const IconComponent = ICON_MAP[subj.iconName] || Calculator;
            const isSelected = selectedSubjectId === subj.id;
            const progress = calculateSubjectProgress(student, subj.id);

            return (
              <button
                key={subj.id}
                onClick={() => onSelectSubject(subj.id)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                  isSelected
                    ? `${subj.colorToken.badgeActive} shadow-xs`
                    : `bg-white ${subj.colorToken.border} text-slate-700 hover:${subj.colorToken.bgLight}`
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : subj.colorToken.accentText}`} />
                <span>{subj.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {progress}%
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
