import React from 'react';
import { Sparkles, Sun, Moon, Zap, Layers, User, LogOut, LogIn } from 'lucide-react';

export default function Header({
  currentView = 'studio',
  onChangeView,
  user,
  onLogout,
  onOpenAuth,
  isDark,
  onToggleDark,
}) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-zinc-900/90 border-b-2 border-black dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div
          onClick={() => onChangeView && onChangeView('studio')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-yellow-400 dark:bg-yellow-500 border-2 border-black dark:border-black rounded-lg flex items-center justify-center shadow-comic-sm dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.8)] -rotate-3 group-hover:rotate-0 transition-transform">
            <Zap className="w-6 h-6 text-black fill-black" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-comic tracking-wider text-black dark:text-white">
              Comic<span className="text-yellow-500 dark:text-yellow-400">AI</span>
            </span>
            <span className="hidden sm:inline-block bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-zinc-300 dark:border-zinc-700">
              Phase 9 • Auth
            </span>
          </div>
        </div>

        {/* Navigation Tabs (Home, Studio, My Comics) */}
        {onChangeView && (
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border-2 border-black dark:border-zinc-700 shadow-comic-sm">
            <button
              type="button"
              onClick={() => onChangeView('landing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'landing'
                  ? 'bg-yellow-400 text-black border border-black shadow-comic-sm font-extrabold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeView('studio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'studio' || currentView === 'create'
                  ? 'bg-yellow-400 text-black border border-black shadow-comic-sm font-extrabold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Comic</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeView('my-comics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'my-comics'
                  ? 'bg-yellow-400 text-black border border-black shadow-comic-sm font-extrabold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>My Comics</span>
            </button>
          </div>
        )}

        {/* Right Actions: User Profile / Auth Button & Dark Mode */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-1.5 rounded-lg border-2 border-black dark:border-zinc-700 shadow-comic-sm">
                <div className="w-6 h-6 rounded-full bg-yellow-400 border border-black overflow-hidden flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-black" />
                  )}
                </div>
                <span className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100 hidden sm:inline-block max-w-[110px] truncate">
                  {user.username || user.email}
                </span>
              </div>

              <button
                type="button"
                onClick={onLogout}
                title="Sign Out"
                className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 border-2 border-black dark:border-red-900 flex items-center justify-center text-red-600 dark:text-red-400 shadow-comic-sm transition-all active:translate-x-0.5 active:translate-y-0.5"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onOpenAuth && onOpenAuth('login')}
              className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-black border-2 border-black px-3.5 py-1.5 rounded-lg text-xs font-extrabold shadow-comic-sm transition-all active:translate-x-0.5 active:translate-y-0.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleDark}
            aria-label="Toggle Dark Mode"
            className="w-10 h-10 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border-2 border-black dark:border-zinc-600 flex items-center justify-center text-zinc-800 dark:text-yellow-400 shadow-comic-sm transition-all active:translate-x-0.5 active:translate-y-0.5"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
