import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Trash2,
  Calendar,
  Layers,
  Palette,
  ExternalLink,
  Search,
  RefreshCw,
  Sparkles,
  AlertCircle,
  PlusCircle,
  Lock,
  LogIn,
  Info,
  FileDown,
  LayoutGrid,
} from 'lucide-react';
import { fetchSavedComics, deleteComicFromDb } from '../api/comicApi';
import ComicDetailsModal from './ComicDetailsModal';

export default function MyComics({ user, onOpenAuth, onOpenComic, onGoToStudio, onShowToast }) {
  const [comics, setComics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [selectedComicForModal, setSelectedComicForModal] = useState(null);

  const loadComics = async () => {
    if (!user) {
      setComics([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchSavedComics();
      setComics(data);
    } catch (err) {
      console.error('Failed to load saved comics:', err);
      setError(err.message || 'Could not load saved comics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComics();
  }, [user]);

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this comic and its cloud assets?')) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteComicFromDb(id);
      setComics((prev) => prev.filter((c) => c._id !== id));
      if (onShowToast) onShowToast({ type: 'success', title: 'Comic Deleted', message: 'Comic removed from archive.' });
    } catch (err) {
      if (onShowToast) onShowToast({ type: 'error', title: 'Delete Failed', message: err.message });
      else alert(`Delete failed: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredComics = comics.filter((comic) => {
    const q = searchQuery.toLowerCase();
    return (
      comic.title?.toLowerCase().includes(q) ||
      comic.style?.toLowerCase().includes(q) ||
      comic.summary?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="comic-card p-6 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b-2 border-black dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-400 dark:bg-yellow-500 border-2 border-black flex items-center justify-center font-comic text-black text-2xl shadow-comic-sm shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-comic text-zinc-950 dark:text-white tracking-wide flex items-center gap-2">
                <span>MY COMIC ARCHIVE</span>
                <span className="bg-yellow-400 text-black text-xs font-sans font-bold px-2.5 py-0.5 rounded-full border border-black shadow-comic-sm">
                  {comics.length} Saved
                </span>
              </h2>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                MongoDB Persistence • Access, review, and manage your generated comic storyboards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={loadComics}
              disabled={isLoading}
              className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white border-2 border-black dark:border-zinc-700 px-3.5 py-2 rounded-lg text-xs font-bold shadow-comic-sm transition-all active:translate-x-0.5 active:translate-y-0.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={onGoToStudio}
              className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-black border-2 border-black px-4 py-2 rounded-lg text-xs font-bold shadow-comic-sm transition-all active:translate-x-0.5 active:translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Comic</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved comics by title, style, or synopsis..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border-2 border-black dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border-2 border-red-500 text-red-800 dark:text-red-300 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={loadComics}
            className="underline hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* Unauthenticated State */}
      {!user && (
        <div className="comic-card p-12 text-center max-w-xl mx-auto my-8 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 shadow-comic-lg">
          <div className="w-16 h-16 bg-yellow-400 border-2 border-black rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-comic -rotate-3">
            <Lock className="w-8 h-8 text-black" />
          </div>
          <h3 className="font-comic text-3xl text-zinc-950 dark:text-white mb-2">
            CREATOR ARCHIVE PROTECTED
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mb-6 leading-relaxed font-medium">
            Sign in to your ComicAI creator account to securely access, review, and manage your private comic books and storyboards.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => onOpenAuth && onOpenAuth('login')}
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-comic text-xl px-6 py-2.5 rounded-xl border-2 border-black shadow-comic transition-all active:translate-x-0.5 active:translate-y-0.5"
            >
              <LogIn className="w-5 h-5" />
              <span>SIGN IN TO YOUR ARCHIVE</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenAuth && onOpenAuth('register')}
              className="inline-flex items-center gap-2 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-comic text-xl px-5 py-2.5 rounded-xl border-2 border-black dark:border-zinc-700 shadow-comic-sm transition-all"
            >
              <span>CREATE ACCOUNT</span>
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {user && isLoading && (
        <div className="text-center py-16">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-yellow-500 mb-3" />
          <p className="font-comic text-xl text-zinc-700 dark:text-zinc-300">
            LOADING YOUR PERSONAL COMICS...
          </p>
        </div>
      )}

      {/* Empty State */}
      {user && !isLoading && filteredComics.length === 0 && (
        <div className="comic-card p-12 text-center max-w-xl mx-auto my-8">
          <div className="w-16 h-16 bg-yellow-400 border-3 border-black rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-comic rotate-3">
            <BookOpen className="w-8 h-8 text-black" />
          </div>
          <h3 className="font-comic text-2xl text-zinc-950 dark:text-white mb-2">
            {searchQuery ? 'NO MATCHING COMICS FOUND' : 'NO SAVED COMICS YET'}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mb-6">
            {searchQuery
              ? 'Try changing your search query or reset the filter.'
              : 'Generate your first comic in the studio to automatically save it to your personal archive.'}
          </p>
          <button
            type="button"
            onClick={onGoToStudio}
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-comic text-xl px-5 py-2.5 rounded-xl border-2 border-black shadow-comic transition-all"
          >
            <Sparkles className="w-5 h-5" />
            <span>OPEN COMIC STUDIO</span>
          </button>
        </div>
      )}

      {/* Saved Comics Grid */}
      {user && !isLoading && filteredComics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComics.map((comic) => {
            const firstPanelImage =
              comic.panels && comic.panels.length > 0 ? comic.panels[0].imageUrl : null;
            const isDeleting = deletingId === comic._id;

            return (
              <div
                key={comic._id}
                onClick={() => onOpenComic(comic)}
                className="comic-card overflow-hidden cursor-pointer group flex flex-col justify-between hover:shadow-comic-lg transition-all"
              >
                <div>
                  {/* Thumbnail / Cover Canvas */}
                  <div className="relative aspect-video bg-zinc-950 overflow-hidden border-b-2 border-black dark:border-zinc-700 flex items-center justify-center">
                    {firstPanelImage ? (
                      <img
                        src={firstPanelImage}
                        alt={comic.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-zinc-500 text-xs font-semibold flex flex-col items-center">
                        <BookOpen className="w-8 h-8 mb-1 opacity-40" />
                        <span>Comic Storyboard</span>
                      </div>
                    )}

                    {/* Style Badge */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="bg-purple-600 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded border border-black shadow-comic-sm">
                        {comic.style || 'Comic'}
                      </span>
                      <span className="bg-yellow-400 text-black font-bold text-[10px] uppercase px-2 py-0.5 rounded border border-black shadow-comic-sm">
                        {comic.panelCount || comic.panels?.length || 6} Panels
                      </span>
                    </div>

                    {/* Delete Quick Button */}
                    <button
                      type="button"
                      onClick={(e) => handleDelete(comic._id, e)}
                      disabled={isDeleting}
                      title="Delete Comic"
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white border border-black shadow-comic-sm opacity-80 hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    <h3 className="font-comic text-xl text-zinc-950 dark:text-white tracking-wide group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors line-clamp-1 mb-1">
                      {comic.title || 'Untitled Story'}
                    </h3>

                    {comic.summary && (
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-3 leading-relaxed font-medium">
                        {comic.summary}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[11px] font-bold text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-zinc-400" />
                        <span>
                          {comic.createdAt ? new Date(comic.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedComicForModal(comic);
                          }}
                          className="p-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-yellow-400 hover:text-black transition-colors"
                          title="View Details & Script"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>

                        <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-extrabold group-hover:translate-x-0.5 transition-transform">
                          <span>Studio</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Comic Details Modal */}
      {selectedComicForModal && (
        <ComicDetailsModal
          comic={selectedComicForModal}
          onClose={() => setSelectedComicForModal(null)}
          onOpenInStudio={(comic) => {
            setSelectedComicForModal(null);
            onOpenComic(comic);
          }}
          onDelete={(id) => handleDelete(id)}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
}
