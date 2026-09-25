import React from 'react';
import ComicPanel from './ComicPanel';
import { Sparkles, Shield, BookOpen } from 'lucide-react';

export default function ComicPage({
  comicData,
  layoutMode = 'page', // 'page' | 'grid' | 'strip'
  isEditMode = false,
  onPanelUpdate,
  onDeletePanel,
}) {
  if (!comicData) return null;

  const {
    title = 'Comic Story',
    setting = '',
    style = 'Superhero',
    panels = [],
  } = comicData;

  const panelCount = panels.length;

  // Determine container classes based on layout mode and panel count
  const getLayoutContainerClass = () => {
    if (layoutMode === 'strip') {
      return 'flex flex-col gap-6 max-w-2xl mx-auto';
    }

    if (layoutMode === 'grid') {
      if (panelCount <= 4) return 'grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6';
      if (panelCount <= 6) return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6';
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5';
    }

    // Default: 'page' layout with dynamic multi-tier structure
    if (panelCount === 4) {
      return 'grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6';
    }

    if (panelCount === 6) {
      // 6 panels page layout: 3x2 grid with dynamic responsiveness
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6';
    }

    if (panelCount === 8) {
      // 8 panels page layout: 4x2 grid
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5';
    }

    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6';
  };

  return (
    <div className="comic-page-canvas">
      {/* Comic Page Masthead Banner */}
      <div className="border-b-4 border-black dark:border-zinc-700 pb-3 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 text-white font-comic text-xl px-3 py-1 rounded border-2 border-black shadow-comic-sm -rotate-2">
            COMICAI
          </div>
          <div>
            <h1 className="font-comic text-2xl sm:text-3xl text-zinc-950 dark:text-white tracking-wide leading-none uppercase">
              {title}
            </h1>
            <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mt-1">
              <span>ISSUE #1</span>
              <span>•</span>
              <span className="uppercase text-purple-600 dark:text-purple-400 font-extrabold">{style} EDITION</span>
              {setting && (
                <>
                  <span>•</span>
                  <span className="truncate max-w-[200px]">{setting}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="self-end sm:self-auto text-right text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
          <span>{panelCount} PANELS</span>
          <span className="mx-1">•</span>
          <span>{layoutMode.toUpperCase()} VIEW</span>
        </div>
      </div>

      {/* Panels Gutter Grid Canvas */}
      <div className={getLayoutContainerClass()}>
        {panels.map((panel, index) => (
          <ComicPanel
            key={panel.panelNumber || index + 1}
            panel={panel}
            style={style}
            characterBible={comicData.characters || comicData.characterBible || []}
            setting={setting}
            isEditMode={isEditMode}
            onPanelUpdate={onPanelUpdate}
            onDeletePanel={onDeletePanel}
          />
        ))}
      </div>

      {/* Comic Page Footer Mark */}
      <div className="border-t-3 border-black dark:border-zinc-700 pt-3 mt-6 flex items-center justify-between text-xs font-extrabold text-zinc-600 dark:text-zinc-400">
        <div className="flex items-center gap-1.5 font-comic text-sm">
          <span>ComicAI Studio</span>
          <span>•</span>
          <span className="font-sans text-[11px] text-zinc-400">Approved by the Comics Code Authority</span>
        </div>
        <div className="bg-black text-yellow-400 px-2 py-0.5 rounded font-comic text-sm shadow-comic-sm">
          PAGE 1 OF 1
        </div>
      </div>
    </div>
  );
}
