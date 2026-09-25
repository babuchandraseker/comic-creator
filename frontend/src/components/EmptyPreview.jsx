import React from 'react';
import { Layers, Sparkles, Image as ImageIcon, MessageSquare, ArrowRight } from 'lucide-react';

export default function EmptyPreview({ panelCount = 6, style = 'Superhero' }) {
  // Generate dummy array for empty wireframe panels matching selected count
  const dummyPanels = Array.from({ length: panelCount }, (_, i) => i + 1);

  return (
    <div className="comic-card p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b-2 border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 border-2 border-black dark:border-zinc-700 flex items-center justify-center font-comic text-zinc-800 dark:text-zinc-200 text-lg shadow-comic-sm">
            2
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-comic tracking-wide text-zinc-900 dark:text-white">
              COMIC PREVIEW CANVAS
            </h2>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Your generated comic panels will appear here
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
            {panelCount} Panels Grid Layout
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-yellow-400/20 text-yellow-800 dark:text-yellow-300 border border-yellow-400/40">
            {style} Style
          </span>
        </div>
      </div>

      {/* Main Empty State Banner */}
      <div className="text-center py-8 px-4 max-w-xl mx-auto mb-8">
        <div className="w-16 h-16 bg-yellow-400 dark:bg-yellow-500 border-2 border-black rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-comic rotate-3 hover:rotate-0 transition-transform">
          <ImageIcon className="w-8 h-8 text-black" />
        </div>
        <h3 className="font-comic text-2xl sm:text-3xl text-zinc-900 dark:text-white mb-2 tracking-wide">
          NO COMIC GENERATED YET
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
          Enter a narrative in the box above and click <span className="font-bold text-yellow-600 dark:text-yellow-400">"GENERATE COMIC"</span> to transform your story into a visual storyboard with dialogue, sound effects, and character expressions.
        </p>
      </div>

      {/* Wireframe Mock Panel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {dummyPanels.map((p) => (
          <div
            key={p}
            className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-5 bg-zinc-50/50 dark:bg-zinc-800/30 flex flex-col justify-between min-h-[220px] relative overflow-hidden group hover:border-yellow-500/50 transition-colors"
          >
            <div>
              {/* Panel Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-comic text-sm px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded border border-zinc-300 dark:border-zinc-700">
                  PANEL #{p}
                </span>
                <span className="text-[10px] uppercase font-bold text-zinc-400">
                  Ready to Render
                </span>
              </div>

              {/* Wireframe Visual Area */}
              <div className="h-20 rounded-lg bg-zinc-200/60 dark:bg-zinc-800/80 flex flex-col items-center justify-center border border-zinc-200 dark:border-zinc-700/60 mb-4 text-zinc-400 dark:text-zinc-500">
                <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                <span className="text-[11px] font-semibold">Visual Scene & Camera Framing</span>
              </div>

              {/* Wireframe Speech Bubble */}
              <div className="h-8 rounded-lg bg-white/80 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 px-3 flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3"></div>
              </div>
            </div>

            <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold pt-3 mt-3 border-t border-zinc-200 dark:border-zinc-800/60 flex justify-between items-center">
              <span>Emotion & SFX</span>
              <span>Prompt Preview</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
