import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function Toast({ id, type = 'info', title, message, onClose, duration = 3500 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const typeConfig = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-500 text-emerald-900 dark:text-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
      badge: 'SUCCESS',
      badgeBg: 'bg-emerald-400 text-black',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-950/90 border-red-500 text-red-900 dark:text-red-200',
      icon: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />,
      badge: 'ERROR',
      badgeBg: 'bg-red-500 text-white',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/90 border-amber-500 text-amber-900 dark:text-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />,
      badge: 'WARNING',
      badgeBg: 'bg-amber-400 text-black',
    },
    info: {
      bg: 'bg-yellow-50 dark:bg-zinc-900/95 border-yellow-400 dark:border-yellow-500 text-zinc-900 dark:text-white',
      icon: <Info className="w-5 h-5 text-yellow-500 shrink-0" />,
      badge: 'COMICAI',
      badgeBg: 'bg-yellow-400 text-black',
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div
      role="alert"
      className={`max-w-sm w-full p-4 rounded-xl border-2 border-black dark:border-zinc-700 shadow-comic flex items-start gap-3 backdrop-blur-md transition-all animate-in slide-in-from-top-4 duration-300 pointer-events-auto ${config.bg}`}
    >
      <div className="mt-0.5">{config.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded border border-black dark:border-zinc-700 shadow-comic-sm ${config.badgeBg}`}
          >
            {config.badge}
          </span>
          {title && (
            <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate">
              {title}
            </h4>
          )}
        </div>
        {message && (
          <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
            {message}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onClose(id)}
        aria-label="Close notification"
        className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts = [], onClose }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}
