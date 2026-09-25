import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import LandingPage from './components/LandingPage';
import StoryInput from './components/StoryInput';
import EmptyPreview from './components/EmptyPreview';
import LoadingState from './components/LoadingState';
import SkeletonLoader from './components/SkeletonLoader';
import ErrorMessage from './components/ErrorMessage';
import ComicViewer from './components/ComicViewer';
import MyComics from './components/MyComics';
import AuthModal from './components/AuthModal';
import ToastContainer from './components/Toast';
import { generateFullComic } from './api/comicApi';
import { getStoredUser, clearStoredAuth, getCurrentUser } from './api/authApi';

export default function App() {
  // Navigation View: 'landing' | 'studio' | 'my-comics' | 'login' | 'register'
  const [currentView, setCurrentView] = useState('studio');

  // User Authentication State
  const [user, setUser] = useState(() => getStoredUser());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  // Toast Notification System
  const [toasts, setToasts] = useState([]);

  const addToast = ({ type = 'info', title, message, duration = 4000 }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Dark/Light Mode
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('comicai_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Story & Comic Settings
  const [story, setStory] = useState('');
  const [panelCount, setPanelCount] = useState(6); // 4, 6, 8
  const [style, setStyle] = useState('Superhero'); // Cartoon, Manga, Superhero, Cinematic
  const [language, setLanguage] = useState('en');

  // Generation States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comicData, setComicData] = useState(null);

  // Sync theme with html document class
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('comicai_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('comicai_theme', 'light');
    }
  }, [isDark]);

  // Verify auth session on load
  useEffect(() => {
    async function verifyAuth() {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    }
    verifyAuth();
  }, []);

  const toggleDarkMode = () => setIsDark((prev) => !prev);

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    setShowAuthModal(false);
    addToast({
      type: 'success',
      title: 'Welcome Back!',
      message: `Signed in as ${authenticatedUser.username || authenticatedUser.email}.`,
    });
    if (currentView === 'login' || currentView === 'register') {
      setCurrentView('studio');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out of ComicAI?')) {
      clearStoredAuth();
      setUser(null);
      addToast({
        type: 'info',
        title: 'Signed Out',
        message: 'You have been signed out of your account.',
      });
      if (currentView === 'my-comics') {
        setCurrentView('studio');
      }
    }
  };

  // Full End-to-End Comic Generation
  const handleGenerate = async () => {
    if (!story.trim()) return;

    if (story.trim().length < 10) {
      setError('Please provide a story narrative with at least 10 characters.');
      addToast({
        type: 'warning',
        title: 'Story Too Short',
        message: 'Please provide at least 10 characters for your narrative.',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    addToast({
      type: 'info',
      title: 'Story Generation Started',
      message: `Creating ${panelCount} panels with ${style} style...`,
    });

    try {
      const data = await generateFullComic({
        story: story.trim(),
        style,
        panelCount: parseInt(panelCount, 10),
        language,
      });

      setComicData(data);
      addToast({
        type: 'success',
        title: 'Comic Masterpiece Ready!',
        message: `Generated "${data.title || 'Comic'}" with ${data.panels?.length || panelCount} panels.`,
      });
      // Smooth scroll down to the comic storyboard
      window.scrollTo({ top: 380, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to generate full comic:', err);
      const errMsg =
        err.message ||
        'Failed to communicate with ComicAI backend. Please check your backend server and Gemini API key.';
      setError(errMsg);
      addToast({
        type: 'error',
        title: 'Generation Failed',
        message: errMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setStory('');
    setError(null);
  };

  const handleReset = () => {
    setComicData(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    handleGenerate();
  };

  const handleOpenComic = (savedComic) => {
    setComicData(savedComic);
    setCurrentView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200">
      {/* 1. Header with ComicAI branding, Navigation Tabs, Auth Profile and Dark/Light switcher */}
      <Header
        currentView={currentView}
        onChangeView={(view) => {
          if (view === 'login' || view === 'register') {
            handleOpenAuth(view);
          } else {
            setCurrentView(view);
          }
        }}
        user={user}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
        isDark={isDark}
        onToggleDark={toggleDarkMode}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* VIEW 1: Landing Page */}
        {currentView === 'landing' ? (
          <LandingPage
            onGetStarted={() => setCurrentView('studio')}
            onExploreComics={() => setCurrentView('my-comics')}
          />
        ) : currentView === 'my-comics' ? (
          /* VIEW 2: My Comics Archive */
          <MyComics
            user={user}
            onOpenAuth={handleOpenAuth}
            onOpenComic={handleOpenComic}
            onGoToStudio={() => setCurrentView('studio')}
            onShowToast={addToast}
          />
        ) : (
          /* VIEW 3: Studio Generator & Viewer */
          <>
            {/* Hero Section */}
            <HeroSection />

            {/* Error Alert Display */}
            {error && (
              <div className="mb-6">
                <ErrorMessage
                  title="Generation Encountered An Issue"
                  message={error}
                  onRetry={handleRetry}
                  onDismiss={() => setError(null)}
                />
              </div>
            )}

            {/* Story Input & Settings Form */}
            {!comicData && (
              <StoryInput
                story={story}
                setStory={setStory}
                panelCount={panelCount}
                setPanelCount={setPanelCount}
                style={style}
                setStyle={setStyle}
                language={language}
                setLanguage={setLanguage}
                onGenerate={handleGenerate}
                onClear={handleClear}
                isLoading={isLoading}
              />
            )}

            {/* Sequential Loading Progress Indicator & Skeleton Wireframe */}
            {isLoading && (
              <div className="space-y-6">
                <LoadingState panelCount={panelCount} style={style} />
                <SkeletonLoader panelCount={panelCount} />
              </div>
            )}

            {/* Complete Visual Comic Storyboard Output View */}
            {!isLoading && comicData && (
              <ComicViewer
                comicData={comicData}
                onReset={handleReset}
                onUpdateComicData={(updated) => setComicData(updated)}
                onShowToast={addToast}
              />
            )}

            {/* Empty Preview State */}
            {!isLoading && !comicData && (
              <EmptyPreview panelCount={panelCount} style={style} />
            )}
          </>
        )}
      </main>

      {/* Auth Modal Overlay */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <AuthModal
            initialMode={authMode}
            onSuccess={handleAuthSuccess}
            onClose={() => setShowAuthModal(false)}
            onSwitchMode={(mode) => setAuthMode(mode)}
          />
        </div>
      )}

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Footer */}
      <footer className="border-t-2 border-black dark:border-zinc-800 bg-white dark:bg-zinc-900 py-6 px-4 text-center text-xs font-semibold text-zinc-600 dark:text-zinc-400 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-comic text-base text-zinc-900 dark:text-white">
            <span>Comic<span className="text-yellow-500">AI</span></span>
            <span className="text-zinc-400 dark:text-zinc-600 font-sans text-xs">•</span>
            <span className="font-sans text-xs text-zinc-500">AI Story-to-Comic Generator</span>
          </div>
          <div className="text-zinc-500 text-[11px]">
            Phase 11: Production-Quality UI/UX & High-Res Comic Studio
          </div>
        </div>
      </footer>
    </div>
  );
}
