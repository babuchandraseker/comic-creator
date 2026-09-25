import React from 'react';
import { Sparkles, Wand2, Palette, MessageSquare, LayoutGrid } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="text-center py-6 sm:py-10 max-w-4xl mx-auto px-4">
      {/* Decorative Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-400/20 dark:bg-yellow-400/10 border-2 border-yellow-500/50 text-yellow-800 dark:text-yellow-300 text-xs sm:text-sm font-bold tracking-wide uppercase mb-4 shadow-comic-sm">
        <Sparkles className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
        <span>Next-Gen Visual Storytelling</span>
      </div>

      {/* Hero Headline */}
      <h1 className="text-4xl sm:text-6xl font-comic tracking-wide text-zinc-950 dark:text-white mb-4 leading-none">
        TURN YOUR STORIES <br className="hidden sm:inline" />
        <span className="text-yellow-500 dark:text-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
          INTO COMICS
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto font-medium leading-relaxed mb-6">
        Transform your written stories into multi-panel visual comics. ComicAI analyzes your narrative, breaks down scenes, crafts character dialogue, and builds complete comic storyboards in seconds.
      </p>

      {/* Feature Highlights Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300">
        <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-800/80 px-3 py-1.5 rounded-lg border-2 border-black dark:border-zinc-700 shadow-comic-sm">
          <LayoutGrid className="w-4 h-4 text-indigo-500" />
          <span>4, 6 & 8 Panels</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-800/80 px-3 py-1.5 rounded-lg border-2 border-black dark:border-zinc-700 shadow-comic-sm">
          <Palette className="w-4 h-4 text-purple-500" />
          <span>4 Art Styles</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-800/80 px-3 py-1.5 rounded-lg border-2 border-black dark:border-zinc-700 shadow-comic-sm">
          <MessageSquare className="w-4 h-4 text-emerald-500" />
          <span>Multi-Language</span>
        </div>
      </div>
    </section>
  );
}
