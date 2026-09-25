import React, { useState } from 'react';
import { AlertTriangle, Sparkles, Info } from 'lucide-react';
import ComicToolbar from './ComicToolbar';
import ComicPage from './ComicPage';
import CharacterList from './CharacterList';
import StoryboardView from './StoryboardView';
import { saveComicToDb } from '../api/comicApi';
import { exportToPng, exportToPdf } from '../services/comicExportService';

export default function ComicViewer({ comicData, onReset, onUpdateComicData, onShowToast }) {
  const [layoutMode, setLayoutMode] = useState('page'); // 'page' | 'grid' | 'strip'
  const [isEditMode, setIsEditMode] = useState(false);
  const [showBible, setShowBible] = useState(false);
  const [showStoryboard, setShowStoryboard] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!comicData) return null;

  const notify = (type, title, message) => {
    if (onShowToast) onShowToast({ type, title, message });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const saved = await saveComicToDb(comicData);
      if (saved && saved._id) {
        onUpdateComicData({ ...comicData, _id: saved._id });
      }
      notify('success', 'Saved to Archive', 'Comic story and panels saved to your library.');
    } catch (err) {
      notify('error', 'Save Failed', err.message || 'Could not save comic.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPng = async () => {
    setIsExporting(true);
    try {
      notify('info', 'Exporting PNG', 'Synthesizing high-resolution comic canvas...');
      await exportToPng(comicData);
      notify('success', 'Download Complete', 'High-resolution PNG comic page saved.');
    } catch (err) {
      console.error('Failed to export PNG:', err);
      notify('error', 'Export Failed', err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      notify('info', 'Exporting PDF', 'Assembling print-ready PDF 1.4 document...');
      await exportToPdf(comicData);
      notify('success', 'Download Complete', 'Print-ready PDF comic book saved.');
    } catch (err) {
      console.error('Failed to export PDF:', err);
      notify('error', 'Export Failed', err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const { title, style, characters = [], panels = [] } = comicData;

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(comicData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy JSON:', err);
    }
  };

  const handlePanelUpdate = (updatedPanel) => {
    if (!onUpdateComicData) return;
    const newPanels = panels.map((p) =>
      p.panelNumber === updatedPanel.panelNumber ? updatedPanel : p
    );
    onUpdateComicData({
      ...comicData,
      panels: newPanels,
    });
  };

  const handleDeletePanel = (panelNumberToDelete) => {
    if (!onUpdateComicData) return;
    if (panels.length <= 1) {
      alert('A comic book page must have at least one panel.');
      return;
    }

    const filtered = panels.filter((p) => p.panelNumber !== panelNumberToDelete);
    // Re-index remaining panels sequentially
    const reindexed = filtered.map((p, idx) => ({
      ...p,
      panelNumber: idx + 1,
    }));

    onUpdateComicData({
      ...comicData,
      panels: reindexed,
    });
  };

  const handleAddPanel = () => {
    if (!onUpdateComicData) return;
    const nextNumber = panels.length + 1;
    const primaryChar = characters && characters.length > 0 ? characters[0].name : 'Hero';

    const newPanel = {
      panelNumber: nextNumber,
      sceneDescription: `New scene panel #${nextNumber}`,
      characters: [primaryChar],
      action: 'Standing in heroic pose',
      emotion: 'determined',
      dialogue: 'The adventure continues...',
      dialogueType: 'speech',
      caption: 'LATER THAT DAY...',
      imagePrompt: `${style} comic style, scene ${nextNumber} with ${primaryChar}`,
      imageUrl: null,
      imageStatus: 'pending',
    };

    onUpdateComicData({
      ...comicData,
      panels: [...panels, newPanel],
    });
  };

  return (
    <div className="space-y-6">
      {/* Comic Toolbar */}
      <ComicToolbar
        title={title}
        panelCount={panels.length}
        style={style}
        layoutMode={layoutMode}
        onChangeLayoutMode={setLayoutMode}
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode((prev) => !prev)}
        onAddPanel={handleAddPanel}
        onReset={onReset}
        onCopyJson={handleCopyJson}
        isCopied={copied}
        showBible={showBible}
        onToggleBible={() => setShowBible((prev) => !prev)}
        showStoryboard={showStoryboard}
        onToggleStoryboard={() => setShowStoryboard((prev) => !prev)}
        onSave={handleSave}
        isSaving={isSaving}
        onExportPng={handleExportPng}
        onExportPdf={handleExportPdf}
        isExporting={isExporting}
      />

      {/* Collapsible Character Bible */}
      {showBible && <CharacterList characters={characters} />}

      {/* Collapsible Storyboard & Script Breakdown Inspector */}
      {showStoryboard && <StoryboardView comicData={comicData} />}

      {/* Notice when one or more panels used fallback placeholders */}
      {panels.some((p) => p.isFallbackImage) && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-900 dark:text-amber-200 flex items-start sm:items-center justify-between gap-3 text-xs sm:text-sm font-medium shadow-comic-sm">
          <div className="flex items-start sm:items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <span>
              <strong>Notice:</strong> AI artwork generation encountered a temporary provider issue for some panels (rendered with fallback placeholders). You can click <strong>Regenerate</strong> on any panel to generate its live artwork.
            </span>
          </div>
        </div>
      )}

      {/* Main Professional Comic Page Renderer */}
      <ComicPage
        comicData={comicData}
        layoutMode={layoutMode}
        isEditMode={isEditMode}
        onPanelUpdate={handlePanelUpdate}
        onDeletePanel={handleDeletePanel}
      />
    </div>
  );
}
