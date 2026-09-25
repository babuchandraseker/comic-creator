import React, { useState, useEffect } from 'react';
import { Sparkles, Check, Loader2, Image as ImageIcon, Wand2, Layers, Clock, Lightbulb } from 'lucide-react';

const CREATIVE_TIPS = [
  'Generating consistent character facial structure and apparel...',
  'Applying high-contrast ink lines and atmospheric lighting...',
  'Aligning dialogue bubble positions with speaker actions...',
  'Optimizing illustrations for high-resolution PNG & PDF export...',
  'Uploading high-definition panel artwork to Cloudinary CDN...',
];

export default function LoadingState({ panelCount = 6, style = 'Superhero' }) {
  const count = parseInt(panelCount, 10) || 6;
  const [currentStep, setCurrentStep] = useState(0); // 0 = Story analysis, 1..count = panels
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  // Live timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Tips rotator
  useEffect(() => {
    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % CREATIVE_TIPS.length);
    }, 3500);
    return () => clearInterval(tipTimer);
  }, []);

  // Simulate sequential panel progress visual timer while waiting for backend
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCurrentStep(1);
    }, 1800);

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < count) {
          return prev + 1;
        }
        return prev;
      });
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearInterval(interval);
    };
  }, [count]);

  const panelsList = Array.from({ length: count }, (_, i) => i + 1);
  const percentComplete = Math.min(95, Math.round(((currentStep + 0.5) / (count + 1)) * 100));

  return (
    <div className="comic-card p-6 sm:p-8 max-w-3xl mx-auto my-8 bg-white dark:bg-zinc-900 border-2 sm:border-3 border-black dark:border-zinc-700 shadow-comic-lg">
      {/* Loading Header */}
      <div className="text-center pb-6 mb-6 border-b-2 border-zinc-200 dark:border-zinc-800">
        <div className="relative inline-block mb-3">
          <div className="w-16 h-16 bg-yellow-400 dark:bg-yellow-500 border-2 border-black rounded-2xl flex items-center justify-center shadow-comic animate-bounce">
            <Sparkles className="w-8 h-8 text-black fill-black" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border border-black shadow-comic-sm">
            AI
          </div>
        </div>

        <h3 className="font-comic text-3xl sm:text-4xl text-zinc-950 dark:text-white tracking-wide mb-1">
          GENERATING COMIC STORYBOARD...
        </h3>
        <p className="text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
          Story Analysis → Character Bible → Sequential {style} Panel Illustrations.
        </p>

        {/* Live Elapsed Timer & Progress Percentage */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs font-extrabold text-zinc-600 dark:text-zinc-400">
          <span className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <Clock className="w-3.5 h-3.5 text-yellow-500" />
            <span>Elapsed: {elapsedSeconds}s</span>
          </span>
          <span className="flex items-center gap-1.5 bg-yellow-400 text-black px-3 py-1 rounded-lg border border-black shadow-comic-sm">
            <span>{percentComplete}% Progress</span>
          </span>
        </div>

        {/* Real-time Progress Bar */}
        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-3 rounded-full overflow-hidden border-2 border-black mt-4 shadow-comic-sm">
          <div
            className="bg-yellow-400 h-full transition-all duration-500 ease-out"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      {/* Sequential Panel Generation Progress Checklist */}
      <div className="bg-zinc-50 dark:bg-zinc-800/60 border-2 border-black dark:border-zinc-700 rounded-xl p-5 shadow-comic-sm mb-6">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200 dark:border-zinc-700 text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
          <span className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>Generation Pipeline:</span>
          </span>
          <span className="text-yellow-600 dark:text-yellow-400 font-comic text-sm">
            {currentStep === 0 ? 'Story Analysis' : `Rendering Panel ${Math.min(currentStep, count)} of ${count}`}
          </span>
        </div>

        {/* Global Pipeline Steps */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs font-bold p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-comic-sm">
            <span className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
              <Wand2 className="w-4 h-4 text-yellow-500" />
              <span>1. Gemini Story Analysis & Character Bible Engine</span>
            </span>
            {currentStep > 0 ? (
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <Check className="w-4 h-4" />
                <span>Ready</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing...</span>
              </span>
            )}
          </div>
        </div>

        {/* Panel-by-Panel Status Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {panelsList.map((pNum) => {
            const isFinished = currentStep > pNum;
            const isCurrent = currentStep === pNum;
            const isWaiting = currentStep < pNum;

            return (
              <div
                key={pNum}
                className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-bold transition-all ${
                  isFinished
                    ? 'bg-green-50 dark:bg-green-950/40 border-green-400 text-green-800 dark:text-green-300'
                    : isCurrent
                    ? 'bg-yellow-100 dark:bg-yellow-950/50 border-yellow-500 text-yellow-950 dark:text-yellow-200 shadow-comic-sm animate-pulse ring-1 ring-yellow-400'
                    : 'bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5 opacity-70" />
                  <span>Panel {pNum} / {count}</span>
                </div>

                <div>
                  {isFinished && (
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-extrabold">
                      <Check className="w-4 h-4" />
                      <span>Painted</span>
                    </span>
                  )}
                  {isCurrent && (
                    <span className="flex items-center gap-1.5 text-yellow-700 dark:text-yellow-300">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Rendering...</span>
                    </span>
                  )}
                  {isWaiting && <span>Pending</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Creative Tip Box */}
      <div className="p-3.5 rounded-xl bg-yellow-50 dark:bg-zinc-800/80 border border-yellow-300 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-300 flex items-center gap-2.5">
        <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0" />
        <span className="font-semibold">{CREATIVE_TIPS[tipIndex]}</span>
      </div>
    </div>
  );
}
