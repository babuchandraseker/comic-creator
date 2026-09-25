import React from 'react';
import { Info, Sparkles, CheckCircle, ArrowRight, RefreshCw, Cpu, Layers } from 'lucide-react';

export default function Phase2Notice({
  story,
  panelCount,
  style,
  language,
  onReset,
}) {
  return (
    <div className="comic-card p-6 sm:p-8 space-y-6">
      {/* Top Banner Notice */}
      <div className="bg-amber-400/20 dark:bg-yellow-400/10 border-2 border-yellow-500 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-yellow-400 border-2 border-black flex items-center justify-center text-black shadow-comic-sm shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-comic text-xl text-zinc-950 dark:text-yellow-400 tracking-wide">
                PHASE 1 UI PREVIEW COMPLETE
              </span>
              <span className="text-[10px] font-bold uppercase bg-yellow-400 text-black px-2 py-0.5 rounded border border-black shadow-comic-sm">
                Frontend Active
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 mt-0.5">
              Backend integration & Gemini AI pipeline are scheduled for Phase 2.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-xs font-bold px-3.5 py-2 rounded-lg border-2 border-black dark:border-zinc-700 shadow-comic-sm transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Preview</span>
        </button>
      </div>

      {/* Submitted Parameters Summary */}
      <div className="border-2 border-zinc-200 dark:border-zinc-800 rounded-xl p-5 bg-zinc-50 dark:bg-zinc-800/40">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-indigo-500" />
          <span>Captured Story Parameters for Phase 2 API:</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">Panels</span>
            <span className="font-comic text-lg text-zinc-900 dark:text-white">{panelCount} Panels</span>
          </div>

          <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">Comic Style</span>
            <span className="font-comic text-lg text-purple-600 dark:text-purple-400">{style}</span>
          </div>

          <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">Language</span>
            <span className="font-comic text-lg text-emerald-600 dark:text-emerald-400 uppercase">{language}</span>
          </div>

          <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">Story Length</span>
            <span className="font-comic text-lg text-zinc-900 dark:text-white">{story.length} chars</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
            Story Text Excerpt:
          </span>
          <p className="text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 italic bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
            "{story}"
          </p>
        </div>
      </div>

      {/* Phase 2 Pipeline Roadmap */}
      <div className="border-t-2 border-zinc-200 dark:border-zinc-800 pt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          <span>Upcoming Phase 2 Pipeline Capabilities:</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-zinc-900 dark:text-white block">Gemini 1.5/2.5 AI Story Engine</span>
              <span className="text-zinc-500 text-[11px]">Structured character extraction & dialogue typing.</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-zinc-900 dark:text-white block">Visual Scene Prompts</span>
              <span className="text-zinc-500 text-[11px]">Camera angles, lighting, and art style prompts.</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-zinc-900 dark:text-white block">Interactive Storyboard</span>
              <span className="text-zinc-500 text-[11px]">Speech balloons, SFX badges & JSON export.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
