import React from 'react';
import {
  Wand2,
  Sparkles,
  Zap,
  Layers,
  Palette,
  FileDown,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Cloud,
  Edit3,
  RefreshCw,
  Users,
} from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Write Story',
    desc: 'Input your raw narrative in natural language. Describe actions, characters, emotions, and dialogue.',
    icon: '✍️',
    color: 'bg-yellow-400',
  },
  {
    step: '02',
    title: 'Choose Style',
    desc: 'Select from Superhero, Manga, Cartoon, or Cinematic Graphic Novel visual aesthetics.',
    icon: '🎨',
    color: 'bg-purple-400',
  },
  {
    step: '03',
    title: 'Select Panels',
    desc: 'Pick 4-panel strips, 6-panel classic layouts, or 8-panel extended graphic chapters.',
    icon: '📐',
    color: 'bg-blue-400',
  },
  {
    step: '04',
    title: 'AI Generation',
    desc: 'Gemini analyzes the plot & Character Bible, and Hugging Face FLUX paints sequential illustrations.',
    icon: '⚡',
    color: 'bg-pink-400',
  },
  {
    step: '05',
    title: 'Preview & Edit',
    desc: 'Interactive comic page renderer with live editable speech bubbles, thought clouds, and captions.',
    icon: '💬',
    color: 'bg-emerald-400',
  },
  {
    step: '06',
    title: 'Download & Share',
    desc: 'Export high-resolution PNGs or standard print-ready PDF comic books with one click.',
    icon: '📥',
    color: 'bg-indigo-400',
  },
];

const FEATURES = [
  {
    title: 'Character Bible Consistency',
    desc: 'Maintains identical hair, face, costume, and visual traits for your characters across every single panel.',
    icon: <Users className="w-6 h-6 text-indigo-500" />,
  },
  {
    title: 'Vector Dialogue Balloons',
    desc: 'Dynamic, auto-resizing speech bubbles, thought clouds, and shout starbursts rendered cleanly above illustrations.',
    icon: <Edit3 className="w-6 h-6 text-yellow-500" />,
  },
  {
    title: 'Single Panel Regeneration',
    desc: 'Re-roll any individual panel with one click while preserving the Character Bible and rest of the comic.',
    icon: <RefreshCw className="w-6 h-6 text-emerald-500" />,
  },
  {
    title: 'Cloudinary CDN Hosting',
    desc: 'All generated panel illustrations are automatically stored and served from secure, high-speed cloud CDN.',
    icon: <Cloud className="w-6 h-6 text-blue-500" />,
  },
  {
    title: 'High-Res PNG & PDF Export',
    desc: 'Download authentic comic book pages ready for digital publishing, print, or sharing on social media.',
    icon: <FileDown className="w-6 h-6 text-red-500" />,
  },
  {
    title: 'User-Isolated Comic Archive',
    desc: 'MongoDB database persistence keeps your created storyboards securely organized in your personal library.',
    icon: <ShieldCheck className="w-6 h-6 text-purple-500" />,
  },
];

export default function LandingPage({ onGetStarted, onExploreComics }) {
  return (
    <div className="space-y-16 py-4">
      {/* 1. Hero Section */}
      <div className="comic-card p-8 sm:p-14 relative overflow-hidden bg-gradient-to-br from-white via-yellow-50/40 to-white dark:from-zinc-900 dark:via-zinc-900/90 dark:to-zinc-950 border-2 sm:border-3 border-black dark:border-zinc-700 shadow-comic-lg">
        {/* Comic Halftone Dot Texture Accent */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-yellow-400/20 dark:bg-yellow-400/10 blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400 border-2 border-black text-black font-extrabold text-xs shadow-comic-sm mb-6 -rotate-1 hover:rotate-0 transition-transform">
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            <span>AI STORY-TO-COMIC GENERATOR 2.0</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-comic tracking-wider text-black dark:text-white leading-none mb-6">
            TURN YOUR STORIES INTO <span className="text-yellow-500 dark:text-yellow-400 underline decoration-black decoration-wavy decoration-2">VISUAL COMICS</span>
          </h1>

          <p className="text-sm sm:text-lg text-zinc-700 dark:text-zinc-300 font-medium max-w-2xl mx-auto leading-relaxed mb-8">
            Transform natural language written stories into multi-panel comic books with consistent character designs, dynamic dialogue bubbles, and instant PDF/PNG export.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-black font-comic text-2xl tracking-wide rounded-xl border-2 sm:border-3 border-black shadow-comic hover:shadow-comic-lg transition-all flex items-center justify-center gap-3 group"
            >
              <span>START CREATING FREE</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onExploreComics}
              className="w-full sm:w-auto px-6 py-4 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-comic text-2xl tracking-wide rounded-xl border-2 sm:border-3 border-black dark:border-zinc-700 shadow-comic-sm transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              <span>MY COMIC ARCHIVE</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Simplified Step-by-Step User Journey Roadmap */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-widest text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-950/60 px-3 py-1 rounded-md border border-yellow-400">
            HOW IT WORKS
          </span>
          <h2 className="font-comic text-3xl sm:text-4xl text-zinc-950 dark:text-white tracking-wide mt-2">
            THE SIMPLE 6-STEP CREATOR JOURNEY
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 font-medium">
            From raw text prompt to high-resolution downloadable comic in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STEPS.map((s, idx) => (
            <div
              key={idx}
              className="comic-card p-6 relative bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 shadow-comic hover:shadow-comic-lg transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center text-xl shadow-comic-sm group-hover:scale-110 transition-transform">
                  {s.icon}
                </span>
                <span className="font-comic text-2xl text-zinc-400 dark:text-zinc-600">
                  {s.step}
                </span>
              </div>

              <h3 className="font-comic text-2xl text-zinc-950 dark:text-white mb-2">
                {s.title}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Feature Matrix */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950/60 px-3 py-1 rounded-md border border-indigo-400">
            KEY CAPABILITIES
          </span>
          <h2 className="font-comic text-3xl sm:text-4xl text-zinc-950 dark:text-white tracking-wide mt-2">
            ENGINEERED FOR PROFESSIONAL COMIC PRODUCTION
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="comic-card p-6 bg-zinc-50/80 dark:bg-zinc-850/60 border-2 border-black dark:border-zinc-700 shadow-comic"
            >
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-800 border-2 border-black dark:border-zinc-700 flex items-center justify-center shadow-comic-sm mb-4">
                {f.icon}
              </div>
              <h4 className="font-comic text-xl text-zinc-950 dark:text-white mb-1.5">
                {f.title}
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Bottom Conversion Banner */}
      <div className="comic-card p-8 sm:p-12 text-center bg-yellow-400 border-3 border-black shadow-comic-lg text-black">
        <h2 className="font-comic text-3xl sm:text-5xl tracking-wide mb-3">
          READY TO CREATE YOUR FIRST COMIC?
        </h2>
        <p className="text-sm sm:text-base font-bold max-w-xl mx-auto mb-6 text-zinc-900">
          Enter any story, choose your favorite art style, and let the AI Story-to-Comic engine bring your vision to life.
        </p>
        <button
          type="button"
          onClick={onGetStarted}
          className="px-8 py-3.5 bg-black hover:bg-zinc-800 text-yellow-400 font-comic text-2xl rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none transition-all inline-flex items-center gap-2"
        >
          <Wand2 className="w-5 h-5" />
          <span>OPEN COMIC STUDIO NOW</span>
        </button>
      </div>
    </div>
  );
}
