import React from 'react';
import { AlertCircle, RefreshCw, XCircle } from 'lucide-react';

export default function ErrorMessage({
  title = 'Generation Encountered An Issue',
  message = 'Unable to generate comic script. Please check your inputs or network connection and try again.',
  onRetry,
  onDismiss,
}) {
  return (
    <div className="comic-card bg-red-50 dark:bg-red-950/40 border-red-500 dark:border-red-600 p-6 sm:p-7 shadow-comic">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Error Exclamation Badge */}
        <div className="w-12 h-12 rounded-xl bg-red-500 text-white flex items-center justify-center border-2 border-black dark:border-red-400 shadow-comic-sm shrink-0">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-comic text-2xl text-red-900 dark:text-red-300 tracking-wide">
              {title}
            </h4>
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="text-red-600 hover:text-red-800 dark:text-red-400 p-1"
                aria-label="Dismiss error"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>

          <p className="text-sm font-medium text-red-800 dark:text-red-200/90 mb-4 leading-relaxed">
            {message}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 hover:bg-red-100 dark:hover:bg-zinc-800 text-red-900 dark:text-red-300 text-xs font-bold px-4 py-2 rounded-lg border-2 border-black dark:border-red-500 shadow-comic-sm transition-all active:translate-x-0.5 active:translate-y-0.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Generation</span>
              </button>
            )}
            <span className="text-xs text-red-700 dark:text-red-400/80 font-semibold">
              Tip: Ensure your story narrative contains at least 10 characters.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
