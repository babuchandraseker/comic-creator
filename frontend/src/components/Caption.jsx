import React, { useState } from 'react';
import { Edit3, Check, X } from 'lucide-react';

export default function Caption({
  text = '',
  isEditable = false,
  onUpdateText,
  className = '',
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(text);

  if (!text && !isEditable) return null;

  const handleSave = () => {
    if (onUpdateText) {
      onUpdateText(draftText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraftText(text);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={`bg-yellow-100 dark:bg-yellow-950/80 border-2 border-black dark:border-yellow-500 rounded-lg p-2 shadow-comic-sm z-20 ${className}`}>
        <span className="uppercase text-[9px] tracking-wider text-yellow-900 dark:text-yellow-400 font-sans font-bold block mb-1">
          Edit Caption:
        </span>
        <textarea
          rows={2}
          value={draftText}
          onChange={(e) => setDraftText(e.target.value)}
          className="w-full text-xs font-handwriting font-bold bg-white dark:bg-zinc-900 text-zinc-950 dark:text-yellow-200 p-1.5 rounded border border-black dark:border-zinc-700 focus:outline-none"
          autoFocus
        />
        <div className="flex items-center justify-end gap-1.5 mt-1.5">
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
            className="p-1 rounded bg-yellow-400 text-black font-bold hover:bg-yellow-300 border border-black"
            title="Save"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group/caption relative bg-yellow-200/95 dark:bg-yellow-950/90 border-2 border-black dark:border-yellow-500/80 px-2.5 py-1.5 rounded-md shadow-comic-sm transition-all ${
        isEditable ? 'cursor-pointer hover:border-dashed hover:bg-yellow-300 dark:hover:bg-yellow-900' : ''
      } ${className}`}
      onClick={() => isEditable && setIsEditing(true)}
    >
      <span className="uppercase text-[8px] tracking-wider text-yellow-900 dark:text-yellow-400 font-sans font-extrabold block leading-none mb-0.5">
        CAPTION
      </span>
      <p className="font-handwriting text-xs sm:text-sm font-bold text-zinc-950 dark:text-yellow-100 leading-snug">
        "{text || '(Click to add caption)'}"
      </p>

      {isEditable && (
        <span className="absolute top-1 right-1 opacity-0 group-hover/caption:opacity-100 text-yellow-900 dark:text-yellow-300 transition-opacity">
          <Edit3 className="w-3 h-3" />
        </span>
      )}
    </div>
  );
}
