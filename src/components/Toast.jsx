// Toast.jsx — Bonus 5: Simple toast notification system
// Displayed in the bottom-right corner; auto-dismisses after 3s.

import { useEffect } from 'react';

const ICONS = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
const COLORS = {
  success: 'bg-emerald-500',
  error:   'bg-red-500',
  info:    'bg-blue-500',
  warning: 'bg-amber-500',
};

function Toast({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const t = setTimeout(() => onRemove(toast.id), 3000);
    return () => clearTimeout(t);
  }, [toast.id, onRemove]);

  return (
    <div className={`
      flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm font-medium
      shadow-xl pointer-events-auto animate-slide-in min-w-[220px] max-w-xs
      ${COLORS[toast.type] || COLORS.info}
    `}>
      <span>{ICONS[toast.type] || ICONS.info}</span>
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="opacity-70 hover:opacity-100 transition-opacity text-base leading-none"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;