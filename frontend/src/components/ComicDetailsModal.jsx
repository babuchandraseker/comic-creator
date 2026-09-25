import React from 'react';
import {
  X,
  BookOpen,
  Calendar,
  Layers,
  Palette,
  FileDown,
  Image as ImageIcon,
  FileText,
  Trash2,
  ExternalLink,
  Edit3,
} from 'lucide-react';
import { exportToPng, exportToPdf } from '../services/comicExportService';

export default function ComicDetailsModal({
  comic,
  onClose,
  onOpenInStudio,
  onDelete,
  onShowToast,
}) {
  if (!comic) return null;

  const {
    title = 'Untitled Story',
    originalStory = '',
    summary = '',
    style = 'Superhero',
    panelCount = 6,
    characters = [],
    panels = [],
    createdAt,
  } = comic;

  const handleDownloadPng = async () => {
    try {
      if (onShowToast) onShowToast({ type: 'info', title: 'Exporting PNG', message: 'Generating high-resolution PNG page...' });
      await exportToPng(comic);
      if (onShowToast) onShowToast({ type: 'success', title: 'Export Complete', message: 'Comic downloaded as PNG!' });
    } catch (e) {
      if (onShowToast) onShowToast({ type: 'error', title: 'Export Failed', message: e.message });
    }
  };

  const handleDownloadPdf = async () => {
    try {
      if (onShowToast) onShowToast({ type: 'info', title: 'Exporting PDF', message: 'Building standard PDF 1.4 document...' });
      await exportToPdf(comic);
      if (onShowToast) onShowToast({ type: 'success', title: 'Export Complete', message: 'Comic downloaded as PDF!' });
    } catch (e) {
      if (onShowToast) onShowToast({ type: 'error', title: 'Export Failed', message: e.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="comic-card max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 shadow-comic-lg p-6 sm:p-7 relative">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b-2 border-black dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-400 border-2 border-black flex items-center justify-center font-comic text-black text-2xl shadow-comic-sm shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-comic text-2xl sm:text-3xl text-zinc-950 dark:text-white tracking-wide">
                  {title}
                </h3>
                <span className="bg-purple-600 text-white font-bold text-[10px] uppercase px-2.5 py-0.5 rounded border border-black shadow-comic-sm">
                  {style}
                </span>
                <span className="bg-yellow-400 text-black font-bold text-[10px] uppercase px-2.5 py-0.5 rounded border border-black shadow-comic-sm">
                  {panelCount || panels.length} Panels
                </span>
              </div>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Created {createdAt ? new Date(createdAt).toLocaleString() : 'Recently'}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 border border-black dark:border-zinc-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center gap-2.5 mb-6 p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenInStudio) onOpenInStudio(comic);
            }}
            className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-black border-2 border-black px-4 py-2 rounded-lg text-xs font-extrabold shadow-comic-sm transition-all"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Open in Comic Studio</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPng}
            className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-400 text-white border-2 border-black px-3.5 py-2 rounded-lg text-xs font-bold shadow-comic-sm transition-all"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-400 text-white border-2 border-black px-3.5 py-2 rounded-lg text-xs font-bold shadow-comic-sm transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          {onDelete && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onDelete(comic._id);
              }}
              className="ml-auto flex items-center gap-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 px-3 py-2 rounded-lg text-xs font-bold transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          )}
        </div>

        {/* Story Script & Characters Section */}
        <div className="space-y-6">
          {/* Synopsis */}
          {summary && (
            <div>
              <h4 className="font-comic text-base text-zinc-900 dark:text-white mb-1 uppercase tracking-wide">
                Story Synopsis
              </h4>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 leading-relaxed font-medium">
                {summary}
              </p>
            </div>
          )}

          {/* Original Story Script */}
          {originalStory && (
            <div>
              <h4 className="font-comic text-base text-zinc-900 dark:text-white mb-1 uppercase tracking-wide">
                Original Natural Language Narrative
              </h4>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 leading-relaxed font-medium whitespace-pre-wrap">
                {originalStory}
              </p>
            </div>
          )}

          {/* Character Roster */}
          {characters && characters.length > 0 && (
            <div>
              <h4 className="font-comic text-base text-zinc-900 dark:text-white mb-2 uppercase tracking-wide">
                Character Bible Roster ({characters.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {characters.map((c, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border-2 border-black dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-xs shadow-comic-sm"
                  >
                    <div className="font-bold text-zinc-900 dark:text-white flex items-center justify-between">
                      <span>{c.name}</span>
                      <span className="text-[10px] text-zinc-500 uppercase">{c.role}</span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                      {c.appearance || c.clothing}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Panels Thumbnails Grid */}
          <div>
            <h4 className="font-comic text-base text-zinc-900 dark:text-white mb-2 uppercase tracking-wide">
              Generated Comic Panels ({panels.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {panels.map((p, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border-2 border-black dark:border-zinc-700 overflow-hidden bg-zinc-950 aspect-square relative shadow-comic-sm group"
                >
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={`Panel ${p.panelNumber}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500 font-bold">
                      Panel #{p.panelNumber}
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 p-1.5 bg-black/80 text-[10px] font-bold text-white truncate">
                    #{p.panelNumber}: {p.dialogue || p.caption || p.sceneDescription}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
