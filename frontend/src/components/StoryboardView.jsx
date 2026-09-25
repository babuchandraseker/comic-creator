import React, { useState } from 'react';
import { Users, Film, Sparkles, MessageSquare, Compass, Tag, ChevronDown, ChevronUp } from 'lucide-react';

export default function StoryboardView({ comicData }) {
  const [activeTab, setActiveTab] = useState('storyboard'); // 'storyboard' | 'characters' | 'prompts'
  const [expandedPanel, setExpandedPanel] = useState(null);

  if (!comicData) return null;

  const {
    title = 'Untitled Story',
    originalStory = '',
    summary = '',
    setting = '',
    style = 'Superhero',
    characters = [],
    panels = [],
  } = comicData;

  const togglePanel = (panelNum) => {
    setExpandedPanel((prev) => (prev === panelNum ? null : panelNum));
  };

  return (
    <div className="comic-card p-6 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 shadow-comic-lg">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-5 border-b-2 border-black dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 border-2 border-black flex items-center justify-center text-white shadow-comic-sm">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-comic text-2xl text-zinc-950 dark:text-white tracking-wide">
              STORYBOARD & SCRIPT INSPECTOR
            </h3>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              AI Story breakdown, Character Bible consistency, and Panel Prompts
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-300 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => setActiveTab('storyboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'storyboard'
                ? 'bg-yellow-400 text-black border border-black shadow-comic-sm font-extrabold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Storyboard ({panels.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('characters')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'characters'
                ? 'bg-yellow-400 text-black border border-black shadow-comic-sm font-extrabold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Character Bible ({characters.length})
          </button>
        </div>
      </div>

      {/* TAB 1: Storyboard Script Panels */}
      {activeTab === 'storyboard' && (
        <div className="space-y-4">
          {summary && (
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300">
              <strong className="font-bold text-zinc-900 dark:text-white">Synopsis: </strong>
              {summary}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {panels.map((panel, idx) => {
              const isExpanded = expandedPanel === panel.panelNumber;

              return (
                <div
                  key={panel.panelNumber || idx}
                  className="rounded-xl border-2 border-black dark:border-zinc-700 p-4 bg-zinc-50 dark:bg-zinc-800/70 shadow-comic-sm hover:shadow-comic transition-all"
                >
                  <div
                    onClick={() => togglePanel(panel.panelNumber)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-yellow-400 text-black border border-black flex items-center justify-center font-comic text-base font-bold shadow-comic-sm">
                        #{panel.panelNumber}
                      </span>
                      <span className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-1">
                        {panel.sceneDescription || `Scene ${panel.panelNumber}`}
                      </span>
                    </div>

                    <button type="button" className="text-zinc-500 hover:text-black dark:hover:text-white">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Panel Snapshot Summary */}
                  <div className="mt-3 space-y-2 text-xs">
                    {panel.dialogue && (
                      <div className="p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
                        <span className="font-bold text-zinc-500 text-[10px] uppercase block mb-0.5">
                          Dialogue ({panel.dialogueType || 'speech'})
                        </span>
                        <p className="font-comic text-sm text-zinc-900 dark:text-yellow-400">
                          "{panel.dialogue}"
                        </p>
                      </div>
                    )}

                    {panel.caption && (
                      <div className="p-2 rounded bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-300 dark:border-yellow-700 text-zinc-800 dark:text-yellow-300">
                        <span className="font-bold text-[10px] uppercase block mb-0.5">Caption</span>
                        <p className="font-semibold text-xs">{panel.caption}</p>
                      </div>
                    )}

                    {/* Detailed Prompt & Traits Expansion */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700 space-y-2 text-[11px] text-zinc-600 dark:text-zinc-400 animate-in fade-in duration-150">
                        <div>
                          <span className="font-bold text-zinc-800 dark:text-zinc-200">Active Characters: </span>
                          <span>{panel.characters?.join(', ') || 'Solo scene'}</span>
                        </div>
                        {panel.action && (
                          <div>
                            <span className="font-bold text-zinc-800 dark:text-zinc-200">Action: </span>
                            <span>{panel.action}</span>
                          </div>
                        )}
                        {panel.emotion && (
                          <div>
                            <span className="font-bold text-zinc-800 dark:text-zinc-200">Emotion: </span>
                            <span>{panel.emotion}</span>
                          </div>
                        )}
                        {panel.imagePrompt && (
                          <div className="p-2 rounded bg-zinc-100 dark:bg-zinc-900 font-mono text-[10px] leading-relaxed text-zinc-700 dark:text-zinc-300 break-words">
                            <span className="font-bold text-zinc-900 dark:text-white block mb-1">
                              Imagen 3 Prompt:
                            </span>
                            {panel.imagePrompt}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Character Bible Roster */}
      {activeTab === 'characters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {characters.length === 0 ? (
            <p className="text-xs text-zinc-500 col-span-2 text-center py-6">
              No character profiles extracted for this comic.
            </p>
          ) : (
            characters.map((char, idx) => (
              <div
                key={char.characterId || idx}
                className="rounded-xl border-2 border-black dark:border-zinc-700 p-4 bg-zinc-50 dark:bg-zinc-800/70 shadow-comic-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-400 border border-black flex items-center justify-center font-comic text-xl font-bold text-black shadow-comic-sm">
                    {char.name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <h4 className="font-comic text-lg text-zinc-900 dark:text-white">
                      {char.name}
                    </h4>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                      {char.role || 'Main Character'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                  {char.appearance && (
                    <p>
                      <strong className="text-zinc-900 dark:text-white">Appearance: </strong>
                      {char.appearance || char.faceDescription}
                    </p>
                  )}
                  {char.clothing && (
                    <p>
                      <strong className="text-zinc-900 dark:text-white">Clothing: </strong>
                      {char.clothing}
                    </p>
                  )}
                  {char.personality && (
                    <p>
                      <strong className="text-zinc-900 dark:text-white">Personality: </strong>
                      {char.personality}
                    </p>
                  )}

                  {char.visualKeywords && char.visualKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                      {char.visualKeywords.map((kw, kwIdx) => (
                        <span
                          key={kwIdx}
                          className="text-[10px] font-bold px-2 py-0.5 rounded bg-yellow-200 dark:bg-zinc-700 text-black dark:text-yellow-400"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
