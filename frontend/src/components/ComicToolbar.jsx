import React from 'react';
import {
  LayoutTemplate,
  Grid,
  Columns,
  Edit,
  Plus,
  Copy,
  Check,
  RefreshCw,
  Users,
  BookOpen,
  Save,
  FileDown,
  Image as ImageIcon,
  FileText,
  Film,
} from 'lucide-react';

export default function ComicToolbar({
  title = 'Untitled Comic',
  panelCount = 6,
  style = 'Superhero',
  layoutMode = 'page', // 'page' | 'grid' | 'strip'
  onChangeLayoutMode,
  isEditMode = false,
  onToggleEditMode,
  onAddPanel,
  onReset,
  onCopyJson,
  isCopied = false,
  showBible = false,
  onToggleBible,
  showStoryboard = false,
  onToggleStoryboard,
  onSave,
  isSaving = false,
  onExportPng,
  onExportPdf,
  isExporting = false,
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-xl p-4 shadow-comic mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Comic Title & Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-400 dark:bg-yellow-500 border-2 border-black flex items-center justify-center font-comic text-black text-xl shadow-comic-sm shrink-0">
            #1
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-comic text-2xl text-zinc-950 dark:text-white tracking-wide">
                {title}
              </h2>
              <span className="bg-purple-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-black shadow-comic-sm">
                {style}
              </span>
              <span className="bg-yellow-400 text-black text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-black shadow-comic-sm">
                {panelCount} Panels
              </span>
            </div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Comic Book Layout Engine • Interactive Editor
            </p>
          </div>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Layout Mode Selector */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg border border-zinc-300 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => onChangeLayoutMode('page')}
              title="Page Layout (Classic Comic Page)"
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-all ${
                layoutMode === 'page'
                  ? 'bg-yellow-400 text-black border border-black shadow-comic-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              <span>Page</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeLayoutMode('grid')}
              title="Grid Layout (Symmetrical)"
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-all ${
                layoutMode === 'grid'
                  ? 'bg-yellow-400 text-black border border-black shadow-comic-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeLayoutMode('strip')}
              title="Strip Layout (Vertical Reader)"
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-all ${
                layoutMode === 'strip'
                  ? 'bg-yellow-400 text-black border border-black shadow-comic-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Strip</span>
            </button>
          </div>

          {/* Edit Mode Toggle */}
          <button
            type="button"
            onClick={onToggleEditMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all shadow-comic-sm ${
              isEditMode
                ? 'bg-emerald-400 text-black border-black font-extrabold ring-2 ring-emerald-300'
                : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-black dark:border-zinc-700 hover:bg-zinc-50'
            }`}
          >
            <Edit className="w-3.5 h-3.5" />
            <span>{isEditMode ? 'Editing Active' : 'Edit Mode'}</span>
          </button>

          {/* Character Bible Toggle */}
          {onToggleBible && (
            <button
              type="button"
              onClick={onToggleBible}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all shadow-comic-sm ${
                showBible
                  ? 'bg-indigo-500 text-white border-black'
                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-black dark:border-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{showBible ? 'Hide Bible' : 'Character Bible'}</span>
            </button>
          )}

          {/* Storyboard Script Inspector Toggle */}
          {onToggleStoryboard && (
            <button
              type="button"
              onClick={onToggleStoryboard}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all shadow-comic-sm ${
                showStoryboard
                  ? 'bg-purple-600 text-white border-black'
                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-black dark:border-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>{showStoryboard ? 'Hide Script' : 'Storyboard'}</span>
            </button>
          )}

          {/* Add Panel Button */}
          {onAddPanel && (
            <button
              type="button"
              onClick={onAddPanel}
              className="flex items-center gap-1 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white border-2 border-black dark:border-zinc-700 px-3 py-1.5 rounded-lg text-xs font-bold shadow-comic-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-green-600" />
              <span>Add Panel</span>
            </button>
          )}

          {/* Copy JSON */}
          <button
            type="button"
            onClick={onCopyJson}
            className="flex items-center gap-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white border-2 border-black dark:border-zinc-700 px-3 py-1.5 rounded-lg text-xs font-bold shadow-comic-sm transition-all"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
            <span>{isCopied ? 'Copied' : 'JSON'}</span>
          </button>

          {/* Save to Archive */}
          {onSave && (
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center gap-1 bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black px-3 py-1.5 rounded-lg text-xs font-bold shadow-comic-sm transition-all"
            >
              <Save className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : ''}`} />
              <span>{isSaving ? 'Saving...' : 'Save to DB'}</span>
            </button>
          )}

          {/* Export PNG */}
          {onExportPng && (
            <button
              type="button"
              onClick={onExportPng}
              disabled={isExporting}
              title="Download High-Resolution PNG Comic Page"
              className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-400 text-white border-2 border-black px-3 py-1.5 rounded-lg text-xs font-bold shadow-comic-sm transition-all active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-60"
            >
              <ImageIcon className={`w-3.5 h-3.5 ${isExporting ? 'animate-spin' : ''}`} />
              <span>{isExporting ? 'Exporting...' : 'PNG'}</span>
            </button>
          )}

          {/* Export PDF */}
          {onExportPdf && (
            <button
              type="button"
              onClick={onExportPdf}
              disabled={isExporting}
              title="Download Print-Ready PDF Comic Book"
              className="flex items-center gap-1.5 bg-red-500 hover:bg-red-400 text-white border-2 border-black px-3 py-1.5 rounded-lg text-xs font-bold shadow-comic-sm transition-all active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-60"
            >
              <FileText className={`w-3.5 h-3.5 ${isExporting ? 'animate-spin' : ''}`} />
              <span>{isExporting ? 'Exporting...' : 'PDF'}</span>
            </button>
          )}

          {/* New Story */}
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-300 text-black border-2 border-black px-3 py-1.5 rounded-lg text-xs font-bold shadow-comic-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Story</span>
          </button>
        </div>
      </div>
    </div>
  );
}
