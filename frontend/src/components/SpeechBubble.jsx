import React, { useState } from 'react';
import { MessageSquare, Cloud, Zap, Edit3, Check, X } from 'lucide-react';

export default function SpeechBubble({
  speaker = '',
  dialogue = '',
  type = 'speech', // 'speech' | 'thought' | 'shout'
  isEditable = false,
  onUpdateDialogue,
  onUpdateType,
  className = '',
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftDialogue, setDraftDialogue] = useState(dialogue);
  const [currentType, setCurrentType] = useState(type || 'speech');

  if (!dialogue && !isEditable) return null;

  const handleSave = () => {
    if (onUpdateDialogue) {
      onUpdateDialogue(draftDialogue);
    }
    if (onUpdateType && currentType !== type) {
      onUpdateType(currentType);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraftDialogue(dialogue);
    setCurrentType(type || 'speech');
    setIsEditing(false);
  };

  const cycleType = (e) => {
    e.stopPropagation();
    const types = ['speech', 'thought', 'shout'];
    const nextIndex = (types.indexOf(currentType) + 1) % types.length;
    const nextType = types[nextIndex];
    setCurrentType(nextType);
    if (onUpdateType) {
      onUpdateType(nextType);
    }
  };

  if (isEditing) {
    return (
      <div className={`bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-500 rounded-xl p-3 shadow-comic-sm z-20 ${className}`}>
        <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-zinc-200 dark:border-zinc-700">
          <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400">
            Edit Dialogue ({speaker || 'Character'}):
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentType('speech')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                currentType === 'speech' ? 'bg-yellow-400 text-black border-black' : 'bg-zinc-100 text-zinc-600'
              }`}
            >
              Speech
            </button>
            <button
              type="button"
              onClick={() => setCurrentType('thought')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                currentType === 'thought' ? 'bg-yellow-400 text-black border-black' : 'bg-zinc-100 text-zinc-600'
              }`}
            >
              Thought
            </button>
            <button
              type="button"
              onClick={() => setCurrentType('shout')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                currentType === 'shout' ? 'bg-yellow-400 text-black border-black' : 'bg-zinc-100 text-zinc-600'
              }`}
            >
              Shout
            </button>
          </div>
        </div>

        <textarea
          rows={2}
          value={draftDialogue}
          onChange={(e) => setDraftDialogue(e.target.value)}
          className="w-full text-xs sm:text-sm font-handwriting font-bold bg-zinc-50 dark:bg-zinc-800 text-zinc-950 dark:text-white p-2 rounded border border-black dark:border-zinc-600 focus:outline-none"
          autoFocus
        />

        <div className="flex items-center justify-end gap-1.5 mt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="p-1 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300"
            title="Cancel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="p-1 px-2.5 rounded bg-yellow-400 text-black text-xs font-bold hover:bg-yellow-300 border border-black flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>
    );
  }

  // Render Speech / Thought / Shout bubble
  let containerStyle = 'bubble-speech p-3';
  let badgeIcon = <MessageSquare className="w-3 h-3 text-blue-500" />;

  if (currentType === 'thought') {
    containerStyle = 'bubble-thought p-3 bg-blue-50/80 dark:bg-zinc-900/90';
    badgeIcon = <Cloud className="w-3 h-3 text-indigo-500" />;
  } else if (currentType === 'shout') {
    containerStyle = 'bubble-shout p-3.5';
    badgeIcon = <Zap className="w-3 h-3 text-red-600" />;
  }

  return (
    <div className={`relative group/bubble ${className}`}>
      {/* Speaker Tag & Bubble Type Switcher */}
      <div className="flex items-center justify-between gap-1.5 mb-1 px-1">
        {speaker && (
          <span className="font-comic text-xs sm:text-sm text-zinc-950 dark:text-zinc-100 tracking-wide font-bold flex items-center gap-1">
            {badgeIcon}
            <span>{speaker}:</span>
          </span>
        )}

        {isEditable && (
          <button
            type="button"
            onClick={cycleType}
            title="Click to toggle Bubble Type (Speech / Thought / Shout)"
            className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-yellow-400 hover:text-black text-zinc-600 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 transition-colors"
          >
            {currentType} ↻
          </button>
        )}
      </div>

      {/* Dynamic Sizing Bubble Box */}
      <div
        className={`${containerStyle} transition-all ${
          isEditable ? 'cursor-pointer hover:border-yellow-500' : ''
        }`}
        onClick={() => isEditable && setIsEditing(true)}
      >
        <p
          className={`leading-snug ${
            currentType === 'shout'
              ? 'font-comic text-sm sm:text-base font-extrabold text-red-950 dark:text-black tracking-wide uppercase'
              : currentType === 'thought'
              ? 'font-handwriting text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 italic'
              : 'font-handwriting text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100'
          }`}
        >
          "{dialogue || '(Click to add dialogue)'}"
        </p>

        {/* Normal speech tail */}
        {currentType === 'speech' && (
          <>
            <div className="bubble-speech-tail"></div>
            <div className="bubble-speech-tail-inner"></div>
          </>
        )}

        {/* Thought bubble trailing dots */}
        {currentType === 'thought' && (
          <div className="absolute -bottom-3 left-4 flex gap-1 items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-400"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-zinc-900 border-1.5 border-black dark:border-zinc-400"></span>
          </div>
        )}

        {isEditable && (
          <span className="absolute top-1 right-1 opacity-0 group-hover/bubble:opacity-100 text-zinc-500 dark:text-zinc-400 transition-opacity">
            <Edit3 className="w-3 h-3" />
          </span>
        )}
      </div>
    </div>
  );
}
