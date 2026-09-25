import React from 'react';
import {
  Wand2,
  Sparkles,
  Layers,
  Palette,
  Globe,
  Eraser,
  Lightbulb,
  FileText,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

const PANEL_OPTIONS = [
  { count: 4, label: '4 Panels', desc: 'Short Comic Strip' },
  { count: 6, label: '6 Panels', desc: 'Standard Storyboard' },
  { count: 8, label: '8 Panels', desc: 'Extended Narrative' },
];

const STYLES = [
  {
    id: 'Cartoon',
    name: 'Cartoon',
    tag: 'Vibrant & Expressive',
    icon: '🎨',
    desc: 'Fun, colorful classic animation lines with lively characters.',
  },
  {
    id: 'Manga',
    name: 'Manga',
    tag: 'Japanese Ink & Screentone',
    icon: '⚡',
    desc: 'High-contrast black & white tones with dramatic action angles.',
  },
  {
    id: 'Superhero',
    name: 'Superhero',
    tag: 'Dynamic Comic Book',
    icon: '💥',
    desc: 'Bold muscle outlines, explosive bursts, and vibrant primaries.',
  },
  {
    id: 'Cinematic',
    name: 'Cinematic',
    tag: 'Graphic Novel Noir',
    icon: '🎬',
    desc: 'Atmospheric lighting, widescreen composition, and photorealism.',
  },
];

const LANGUAGES = [
  { code: 'en', name: 'English (US)' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'ko', name: 'Korean (한국어)' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'pt', name: 'Portuguese (Português)' },
  { code: 'zh', name: 'Chinese (中文)' },
];

const SAMPLE_STORIES = [
  {
    title: 'The Time Traveler\'s Pocketwatch',
    style: 'Cinematic',
    panels: 6,
    lang: 'en',
    story:
      'Professor Aris found an ornate gold pocketwatch that ticks backwards. When he adjusted the copper dial at midnight, the shadows in his dusty attic twisted into portals showing Victorian London and Neo-Tokyo 2150. A shadowy figure emerged from the doorway warning him never to turn the gear counterclockwise again.',
  },
  {
    title: 'Mecha-Cat vs Trash Monster',
    style: 'Cartoon',
    panels: 4,
    lang: 'en',
    story:
      'In Alleyway City, a stray kitten activates a secret robotic exo-suit left behind by a mad scientist. Armed with laser whiskers and rocket paws, Mecha-Cat leaps to defend the neighborhood dumpster from an oversized gelatinous recycling monster.',
  },
  {
    title: 'Ronin of the Cyber Realm',
    style: 'Manga',
    panels: 6,
    lang: 'en',
    story:
      'Kuroba, the last digital samurai, draws her luminous plasma katana under the neon rain of Sector 7. Four surveillance drones lock onto her coordinates. With a single blinding slash, she severs the central firewall core to liberate the city\'s stored memories.',
  },
];

export default function StoryInput({
  story,
  setStory,
  panelCount,
  setPanelCount,
  style,
  setStyle,
  language,
  setLanguage,
  onGenerate,
  onClear,
  isLoading,
}) {
  const handleSelectSample = (sample) => {
    setStory(sample.story);
    setStyle(sample.style);
    setPanelCount(sample.panels);
    setLanguage(sample.lang);
  };

  return (
    <div className="comic-card p-5 sm:p-7 mb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b-2 border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-yellow-400 dark:bg-yellow-500 border-2 border-black flex items-center justify-center font-comic text-black text-lg shadow-comic-sm">
            1
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-comic tracking-wide text-zinc-900 dark:text-white">
              STORY & COMIC SETTINGS
            </h2>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Input your narrative and customize visual format
            </p>
          </div>
        </div>

        {story && (
          <button
            type="button"
            onClick={onClear}
            disabled={isLoading}
            className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Clear Story</span>
          </button>
        )}
      </div>

      {/* Story Presets */}
      <div className="mb-5">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2.5">
          <Lightbulb className="w-4 h-4 text-yellow-500" />
          <span>Quick Inspiration Presets:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SAMPLE_STORIES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSelectSample(sample)}
              className="text-left bg-zinc-50 hover:bg-yellow-50 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 border-2 border-black dark:border-zinc-700 rounded-lg p-2.5 shadow-comic-sm hover:translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="font-bold text-xs text-zinc-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                {sample.title}
              </div>
              <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                <span>{sample.style}</span>
                <span>•</span>
                <span>{sample.panels} Panels</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Story Textarea */}
      <div className="mb-6">
        <label
          htmlFor="story-input"
          className="block text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-2 flex items-center justify-between"
        >
          <span className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-yellow-500" />
            <span>Story Narrative (Natural Language):</span>
          </span>
          <span className="text-zinc-500 text-[11px] font-medium">
            {story.length} characters
          </span>
        </label>
        <textarea
          id="story-input"
          rows={5}
          value={story}
          onChange={(e) => setStory(e.target.value)}
          disabled={isLoading}
          placeholder="Type or paste your story here... Describe characters, dialogue, setting, emotions, and thrilling actions. (e.g. 'Detective Miller entered the abandoned dockhouse under the pouring rain. A glowing briefcase was chained to the table...')"
          className="w-full p-4 text-sm sm:text-base border-2 border-black dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 transition-all resize-y min-h-[130px] font-sans"
        />
      </div>

      {/* Settings Grid: Panels, Style, Language */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2 border-t-2 border-zinc-200 dark:border-zinc-800 mb-6">
        {/* 1. Panel Count */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-2.5 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>Number of Panels:</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PANEL_OPTIONS.map((opt) => {
              const isSelected = panelCount === opt.count;
              return (
                <button
                  key={opt.count}
                  type="button"
                  disabled={isLoading}
                  onClick={() => setPanelCount(opt.count)}
                  className={`p-2.5 rounded-lg border-2 text-center transition-all flex flex-col items-center justify-center ${
                    isSelected
                      ? 'border-black bg-yellow-400 text-black shadow-comic-sm dark:bg-yellow-400 dark:text-black dark:border-black font-bold'
                      : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-zinc-500'
                  }`}
                >
                  <span className="font-comic text-xl leading-none">{opt.count}</span>
                  <span className="text-[10px] font-semibold mt-0.5 uppercase tracking-tight">
                    Panels
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Comic Style */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-2.5 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-purple-500" />
            <span>Comic Style:</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {STYLES.map((s) => {
              const isSelected = style === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={isLoading}
                  onClick={() => setStyle(s.id)}
                  className={`p-2 rounded-lg border-2 text-left transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'border-black bg-yellow-400 text-black shadow-comic-sm dark:bg-yellow-400 dark:text-black dark:border-black font-bold'
                      : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-zinc-500'
                  }`}
                >
                  <span className="text-base">{s.icon}</span>
                  <span className="text-xs font-bold truncate">{s.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Language Selection */}
        <div>
          <label
            htmlFor="lang-select"
            className="block text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-2.5 flex items-center gap-1.5"
          >
            <Globe className="w-4 h-4 text-emerald-500" />
            <span>Language:</span>
          </label>
          <select
            id="lang-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isLoading}
            className="w-full p-3 bg-white dark:bg-zinc-800 border-2 border-black dark:border-zinc-700 rounded-lg text-sm font-semibold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-comic-sm"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1.5 font-medium">
            Story dialogue and narrator captions will be localized in this language.
          </p>
        </div>
      </div>

      {/* Generate Comic Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading || !story.trim()}
          className="w-full py-4 px-6 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 dark:bg-yellow-400 dark:hover:bg-yellow-300 text-black font-comic text-2xl sm:text-3xl tracking-wider rounded-xl border-2 sm:border-4 border-black shadow-comic hover:shadow-comic-lg active:shadow-comic-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-comic disabled:hover:bg-yellow-400"
        >
          <Wand2 className={`w-7 h-7 text-black ${isLoading ? 'animate-spin' : 'animate-bounce'}`} />
          <span>{isLoading ? 'GENERATING COMIC STORYBOARD...' : 'GENERATE COMIC'}</span>
        </button>
      </div>
    </div>
  );
}
