import React from 'react';
import { Eye, Clock, AlertTriangle, CheckCircle, LayoutGrid } from 'lucide-react';

export default function StateInspector({ currentState, onSelectState }) {
  const states = [
    { id: 'empty', label: 'Empty Preview', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    { id: 'loading', label: 'Loading State', icon: <Clock className="w-3.5 h-3.5 text-yellow-500" /> },
    { id: 'error', label: 'Error State', icon: <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> },
    { id: 'phase2', label: 'Phase 2 Notice', icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-xl p-3 shadow-comic-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300">
        <Eye className="w-4 h-4 text-indigo-500" />
        <span className="uppercase tracking-wide">Phase 1 UI State Inspector:</span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
        {states.map((st) => {
          const isActive = currentState === st.id;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => onSelectState(st.id)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? 'bg-yellow-400 text-black border-2 border-black shadow-comic-sm dark:bg-yellow-400 dark:text-black font-extrabold'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-zinc-500'
              }`}
            >
              {st.icon}
              <span>{st.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
