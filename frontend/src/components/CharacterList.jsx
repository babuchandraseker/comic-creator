import React, { useState } from 'react';
import {
  Users,
  User,
  Sparkles,
  Shirt,
  Smile,
  Shield,
  Tag,
  Eye,
  Info,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const roleColorMap = {
  Protagonist: 'bg-blue-100 text-blue-900 border-blue-600 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-500',
  Antagonist: 'bg-red-100 text-red-900 border-red-600 dark:bg-red-950/60 dark:text-red-300 dark:border-red-500',
  Sidekick: 'bg-emerald-100 text-emerald-900 border-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500',
  Supporting: 'bg-purple-100 text-purple-900 border-purple-600 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-500',
};

export default function CharacterList({ characters = [] }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!characters || characters.length === 0) return null;

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="comic-card p-5 sm:p-6 mb-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-5 border-b-2 border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-yellow-400 dark:bg-yellow-500 border-2 border-black flex items-center justify-center text-black shadow-comic-sm">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-comic text-xl sm:text-2xl text-zinc-900 dark:text-white tracking-wide flex items-center gap-2">
              <span>CHARACTER BIBLE</span>
              <span className="bg-yellow-400/20 text-yellow-800 dark:text-yellow-300 text-xs font-sans font-bold px-2 py-0.5 rounded-full border border-yellow-500/40">
                Phase 3 Consistency Engine
              </span>
            </h3>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Persistent visual identity, facial features, attire & keywords locked across all panels
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg border border-zinc-300 dark:border-zinc-700">
          {characters.length} Registered Characters
        </span>
      </div>

      {/* Character Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {characters.map((char, idx) => {
          const charId = char.characterId || `char_${idx + 1}`;
          const isExpanded = expandedId === charId;
          const roleBadgeClass =
            roleColorMap[char.role] ||
            'bg-zinc-100 text-zinc-800 border-zinc-400 dark:bg-zinc-800 dark:text-zinc-300';

          return (
            <div
              key={charId}
              className="bg-zinc-50 dark:bg-zinc-800/60 border-2 border-black dark:border-zinc-700 rounded-xl p-4 shadow-comic-sm flex flex-col justify-between hover:shadow-comic transition-all"
            >
              <div>
                {/* Header: Name, Age, Role */}
                <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-zinc-200 dark:border-zinc-700/60">
                  <div>
                    <span className="font-comic text-xl text-zinc-900 dark:text-white tracking-wide block">
                      {char.name}
                    </span>
                    <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                      {[char.age, char.gender].filter(Boolean).join(' • ')}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-md border shadow-comic-sm ${roleBadgeClass}`}
                  >
                    {char.role || 'Character'}
                  </span>
                </div>

                {/* Core Attributes */}
                <div className="space-y-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {/* Face & Hair */}
                  {(char.faceDescription || char.hair) && (
                    <div className="flex items-start gap-1.5 bg-white dark:bg-zinc-900/60 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700/60">
                      <Eye className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-zinc-900 dark:text-zinc-200">Face & Hair: </span>
                        <span>
                          {[char.faceDescription, char.hair, char.skinTone ? `${char.skinTone} skin` : null]
                            .filter(Boolean)
                            .join(', ')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Clothing & Accessories */}
                  {(char.clothing || char.accessories) && (
                    <div className="flex items-start gap-1.5 bg-white dark:bg-zinc-900/60 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700/60">
                      <Shirt className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-zinc-900 dark:text-zinc-200">Outfit & Accessories: </span>
                        <span>
                          {char.clothing}
                          {char.accessories && char.accessories !== 'none'
                            ? ` (Accessories: ${char.accessories})`
                            : ''}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Personality & Body Build */}
                  {(char.personality || char.bodyType) && (
                    <div className="flex items-start gap-1.5 bg-white dark:bg-zinc-900/60 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700/60">
                      <Smile className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-zinc-900 dark:text-zinc-200">Traits: </span>
                        <span>
                          {[char.personality, char.bodyType ? `${char.bodyType} build` : null]
                            .filter(Boolean)
                            .join(' • ')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Visual Keywords Chips */}
                {char.visualKeywords && char.visualKeywords.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-zinc-200 dark:border-zinc-700/60">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block mb-1.5 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-yellow-500" />
                      <span>Consistent Visual Keywords:</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {char.visualKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded bg-yellow-100 dark:bg-yellow-950/40 text-yellow-900 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700/50"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Collapsible Prompt Descriptor Drawer */}
              {char.visualDescriptor && (
                <div className="mt-3 pt-2">
                  <button
                    type="button"
                    onClick={() => toggleExpand(charId)}
                    className="w-full text-left text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center justify-between"
                  >
                    <span>Visual Prompt Clause</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-1.5 p-2 bg-zinc-900 text-emerald-400 text-[11px] font-mono rounded border border-zinc-700 leading-relaxed select-all">
                      {char.visualDescriptor}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
