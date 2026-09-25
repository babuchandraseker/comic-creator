import React from 'react';
import { Wand2, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function SkeletonLoader({ panelCount = 6, style = 'Superhero' }) {
  const count = parseInt(panelCount, 10) || 6;
  const gridCols = count <= 4 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Masthead Skeleton */}
      <div className="comic-card p-5 bg-white/70 dark:bg-zinc-900/70 border-2 border-black dark:border-zinc-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-300/80 dark:bg-yellow-500/50 rounded-xl border-2 border-black animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-700 rounded-md" />
              <div className="h-3 w-64 bg-zinc-200/70 dark:bg-zinc-800 rounded-md" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-24 bg-purple-200 dark:bg-purple-950/60 rounded-lg border border-zinc-300 dark:border-zinc-700" />
            <div className="h-8 w-20 bg-yellow-200 dark:bg-yellow-950/60 rounded-lg border border-zinc-300 dark:border-zinc-700" />
          </div>
        </div>
      </div>

      {/* Comic Page Canvas Skeleton */}
      <div className="comic-page-canvas bg-white dark:bg-zinc-950 border-4 border-black dark:border-zinc-800 p-6">
        {/* Banner */}
        <div className="w-full h-16 bg-zinc-900 dark:bg-zinc-900 rounded-xl mb-6 p-3 flex items-center justify-between">
          <div className="h-6 w-40 bg-zinc-700 rounded" />
          <div className="h-4 w-32 bg-zinc-700 rounded hidden sm:block" />
        </div>

        {/* Panel Grid */}
        <div className={`grid ${gridCols} gap-5`}>
          {Array.from({ length: count }).map((_, idx) => (
            <div
              key={idx}
              className="bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-xl overflow-hidden shadow-comic flex flex-col justify-between"
            >
              {/* Panel Top Number Bar */}
              <div className="p-2.5 border-b-2 border-black dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 flex items-center justify-between">
                <div className="h-4 w-16 bg-yellow-400/80 rounded" />
                <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-700 rounded" />
              </div>

              {/* Shimmering Panel Image Area */}
              <div className="relative aspect-square bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-800 dark:via-zinc-850 dark:to-zinc-800 flex items-center justify-center overflow-hidden">
                <div className="flex flex-col items-center gap-2 text-zinc-400 dark:text-zinc-600">
                  <ImageIcon className="w-10 h-10 animate-bounce" />
                  <span className="text-[11px] font-bold tracking-wider uppercase">
                    Generating Panel #{idx + 1}...
                  </span>
                </div>

                {/* Shimmer Sweep Animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>

              {/* Speech / Caption Skeleton Placeholder */}
              <div className="p-3 bg-white dark:bg-zinc-900 border-t-2 border-black dark:border-zinc-700 space-y-2">
                <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-3 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
