import React, { useState, useRef } from 'react';
import {
  RefreshCw,
  Trash2,
  AlertTriangle,
  ImageIcon,
  Sparkles,
  Layers,
  Smile,
  Activity,
  ChevronDown,
  ChevronUp,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import Caption from './Caption';
import SpeechBubble from './SpeechBubble';
import { regenerateSinglePanel } from '../api/comicApi';

const emotionColorMap = {
  excited: 'bg-yellow-200 text-yellow-900 border-yellow-500 dark:bg-yellow-900/40 dark:text-yellow-300',
  angry: 'bg-red-200 text-red-900 border-red-500 dark:bg-red-900/40 dark:text-red-300',
  fearful: 'bg-purple-200 text-purple-900 border-purple-500 dark:bg-purple-900/40 dark:text-purple-300',
  happy: 'bg-green-200 text-green-900 border-green-500 dark:bg-green-900/40 dark:text-green-300',
  sad: 'bg-blue-200 text-blue-900 border-blue-500 dark:bg-blue-900/40 dark:text-blue-300',
  surprised: 'bg-pink-200 text-pink-900 border-pink-500 dark:bg-pink-900/40 dark:text-pink-300',
  determined: 'bg-orange-200 text-orange-900 border-orange-500 dark:bg-orange-900/40 dark:text-orange-300',
  mysterious: 'bg-indigo-200 text-indigo-900 border-indigo-500 dark:bg-indigo-900/40 dark:text-indigo-300',
  neutral: 'bg-zinc-200 text-zinc-900 border-zinc-400 dark:bg-zinc-800 dark:text-zinc-300',
};

export default function ComicPanel({
  panel,
  style = 'Superhero',
  characterBible = [],
  setting = '',
  isEditMode = false,
  onPanelUpdate,
  onDeletePanel,
  className = '',
}) {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenError, setRegenError] = useState(null);
  const [showPromptDetails, setShowPromptDetails] = useState(false);
  const abortControllerRef = useRef(null);

  const {
    panelNumber,
    sceneDescription,
    characters = [],
    action,
    emotion,
    dialogue = '',
    dialogueType = 'speech', // 'speech' | 'thought' | 'shout'
    caption = '',
    imagePrompt,
    imageUrl,
    isFallbackImage,
  } = panel;

  // Phase 6: Single Panel Regeneration with Character Bible consistency & Cancellation
  const handleRegenerate = async (e) => {
    e?.stopPropagation();
    setIsRegenerating(true);
    setRegenError(null);

    // Create new abort controller for this regeneration request
    abortControllerRef.current = new AbortController();

    try {
      const result = await regenerateSinglePanel(
        {
          panelNumber,
          sceneDescription: sceneDescription || imagePrompt,
          characters: characters || [],
          style,
          imagePrompt: imagePrompt,
          characterBible: characterBible || [],
          setting: setting || '',
          previousPublicId: panel.cloudinaryPublicId || null,
        },
        abortControllerRef.current.signal
      );

      if (onPanelUpdate) {
        onPanelUpdate({
          ...panel,
          imageUrl: result.imageUrl,
          imagePrompt: result.imagePrompt || imagePrompt,
          imageStatus: result.imageStatus,
          imageError: result.imageError,
          isFallbackImage: result.isFallback,
          cloudinaryPublicId: result.cloudinaryPublicId || null,
          isCloudinaryHosted: result.isCloudinaryHosted || false,
        });
      }
    } catch (err) {
      if (err.name !== 'AbortError' && !err.message?.includes('cancelled')) {
        console.error(`Error regenerating panel ${panelNumber}:`, err);
        setRegenError(err.message || 'Failed to regenerate panel image.');
      } else {
        setRegenError('Regeneration cancelled.');
      }
    } finally {
      setIsRegenerating(false);
      abortControllerRef.current = null;
    }
  };

  // Phase 6: Cancel ongoing panel regeneration
  const handleCancelRegeneration = (e) => {
    e?.stopPropagation();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleUpdateDialogue = (newText) => {
    if (onPanelUpdate) {
      onPanelUpdate({
        ...panel,
        dialogue: newText,
      });
    }
  };

  const handleUpdateDialogueType = (newType) => {
    if (onPanelUpdate) {
      onPanelUpdate({
        ...panel,
        dialogueType: newType,
      });
    }
  };

  const handleUpdateCaption = (newText) => {
    if (onPanelUpdate) {
      onPanelUpdate({
        ...panel,
        caption: newText,
      });
    }
  };

  const primarySpeaker = characters && characters.length > 0 ? characters[0] : 'Character';
  const emotionBadgeClass = emotionColorMap[emotion?.toLowerCase()] || emotionColorMap.neutral;

  return (
    <div
      className={`bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 rounded-xl p-3 sm:p-4 shadow-comic hover:shadow-comic-lg transition-all flex flex-col justify-between relative group ${
        isRegenerating ? 'ring-2 ring-yellow-400' : ''
      } ${className}`}
    >
      <div>
        {/* Top Header: Panel Number & Actions */}
        <div className="flex items-center justify-between gap-2 pb-2 mb-2.5 border-b-2 border-black dark:border-zinc-700">
          <div className="flex items-center gap-2">
            <span className="bg-black dark:bg-yellow-400 text-yellow-400 dark:text-black font-comic text-lg px-2.5 py-0.5 rounded border border-black shadow-comic-sm">
              PANEL #{panelNumber}
            </span>
            {characters && characters.length > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 truncate max-w-[120px]">
                {characters.join(', ')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Phase 6: Regenerate Button / Cancel Button */}
            {isRegenerating ? (
              <button
                type="button"
                onClick={handleCancelRegeneration}
                title="Cancel ongoing panel regeneration"
                className="p-1 px-2.5 rounded-md bg-red-500 hover:bg-red-600 text-white border border-black text-xs font-bold shadow-comic-sm flex items-center gap-1 transition-all animate-pulse"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRegenerate}
                title="Regenerate this single panel with Character Bible consistency"
                className="p-1 px-2.5 rounded-md bg-yellow-400 hover:bg-yellow-300 text-black border border-black text-xs font-bold shadow-comic-sm flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>
            )}

            {/* Delete Panel Button */}
            {onDeletePanel && (
              <button
                type="button"
                onClick={() => onDeletePanel(panelNumber)}
                disabled={isRegenerating}
                title="Remove this panel"
                className="p-1 px-1.5 rounded-md bg-red-100 hover:bg-red-200 dark:bg-red-950/60 dark:hover:bg-red-900 text-red-700 dark:text-red-300 border border-red-400 text-xs font-bold transition-all disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Regeneration Error Banner with Retry */}
        {regenError && (
          <div className="mb-2.5 p-2 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-400 text-[11px] font-semibold text-red-700 dark:text-red-300 flex items-center justify-between gap-2">
            <span className="truncate">⚠️ {regenError}</span>
            <button
              type="button"
              onClick={handleRegenerate}
              className="shrink-0 underline hover:text-red-900 dark:hover:text-red-100 flex items-center gap-0.5"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Comic Panel Frame with Image Canvas & Regenerating Overlay */}
        <div className="relative rounded-lg overflow-hidden border-2 border-black dark:border-zinc-700 bg-zinc-950 mb-3 shadow-comic-sm aspect-square sm:aspect-[4/3] flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`Panel ${panelNumber}`}
              className={`w-full h-full object-cover select-none transition-all ${
                isRegenerating ? 'opacity-30 blur-[2px]' : 'hover:scale-[1.02]'
              }`}
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-zinc-400 text-center">
              <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-xs font-semibold">Image Rendering</span>
            </div>
          )}

          {/* Active Regenerating Shimmer Overlay */}
          {isRegenerating && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-yellow-400 p-4 z-10">
              <RefreshCw className="w-8 h-8 animate-spin mb-2" />
              <span className="font-comic text-lg tracking-wide text-white">
                REGENERATING PANEL #{panelNumber}...
              </span>
              <span className="text-[10px] font-bold text-yellow-300">
                Applying Character Bible consistency
              </span>
            </div>
          )}

          {panel.isCloudinaryHosted && (
            <div className="absolute top-2 left-2 bg-black/80 text-cyan-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-cyan-400 shadow-comic-sm flex items-center gap-1">
              <span>☁️ Cloudinary</span>
            </div>
          )}

          {!isRegenerating && (
            isFallbackImage ? (
              <div
                className="absolute top-2 right-2 bg-amber-500 text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border-2 border-black shadow-comic-sm flex items-center gap-1"
                title="Fallback Placeholder Artwork: AI image generation is currently unavailable for this API account."
              >
                <AlertTriangle className="w-3 h-3 text-black" />
                <span>FALLBACK PLACEHOLDER</span>
              </div>
            ) : imageUrl ? (
              <div
                className="absolute top-2 right-2 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border-2 border-black shadow-comic-sm flex items-center gap-1"
                title="Live AI generated comic illustration powered by Gemini"
              >
                <Sparkles className="w-3 h-3 text-black" />
                <span>REAL AI ARTWORK</span>
              </div>
            ) : null
          )}
        </div>

        {/* Narrator Caption Box */}
        {(caption || isEditMode) && (
          <div className="mb-2.5">
            <Caption
              text={caption}
              isEditable={isEditMode}
              onUpdateText={handleUpdateCaption}
            />
          </div>
        )}

        {/* Dynamic Dialogue Speech Bubble */}
        {(dialogue || isEditMode) && (
          <div className="mb-2.5">
            <SpeechBubble
              speaker={primarySpeaker}
              dialogue={dialogue}
              type={dialogueType || 'speech'}
              isEditable={isEditMode}
              onUpdateDialogue={handleUpdateDialogue}
              onUpdateType={handleUpdateDialogueType}
            />
          </div>
        )}

        {/* Action & Emotion Badges */}
        <div className="flex flex-wrap items-center gap-1.5 my-2">
          {action && (
            <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <Activity className="w-3 h-3 text-indigo-500" />
              <span className="truncate max-w-[140px]">{action}</span>
            </div>
          )}

          {emotion && (
            <div
              className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${emotionBadgeClass}`}
            >
              <Smile className="w-3 h-3" />
              <span className="capitalize">{emotion}</span>
            </div>
          )}
        </div>
      </div>

      {/* Prompt Details Drawer */}
      {imagePrompt && (
        <div className="mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setShowPromptDetails(!showPromptDetails)}
            className="w-full flex items-center justify-between text-[10px] font-bold text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
          >
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-500" />
              <span>Consistency Prompt</span>
            </span>
            {showPromptDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showPromptDetails && (
            <div className="mt-1.5 p-2 bg-zinc-950 text-emerald-400 text-[10px] font-mono rounded border border-zinc-800 leading-relaxed select-all">
              {imagePrompt}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
