// TaskCard.jsx — Renders one task card
// Bonus: Confirmation modal before delete

import { useState } from 'react';

const priorityConfig = {
  High:   { pill: 'bg-red-100 text-red-600 dark-high',   dot: 'bg-red-500',   label: '🔴 High' },
  Medium: { pill: 'bg-amber-100 text-amber-600',          dot: 'bg-amber-400', label: '🟡 Medium' },
  Low:    { pill: 'bg-emerald-100 text-emerald-600',      dot: 'bg-emerald-500', label: '🟢 Low' },
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isOverdue(deadline, completed) {
  if (completed || !deadline) return false;
  return new Date(deadline + 'T00:00:00') < new Date();
}

function TaskCard({ task, onToggle, onDelete, onEdit, darkMode }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const pCfg    = priorityConfig[task.priority] || priorityConfig.Medium;
  const overdue = isOverdue(task.deadline, task.completed);

  const cardBg = darkMode
    ? task.completed ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-800 border-slate-700'
    : task.completed ? 'bg-slate-50 border-slate-200'     : 'bg-white border-slate-100';

  return (
    <>
      <div className={`
        rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all duration-200
        animate-slide-in ${cardBg} ${task.completed ? 'opacity-70' : ''}
        ${overdue ? 'border-l-4 border-l-red-400' : ''}
      `}>
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={() => onToggle(task.id)}
            aria-label="Toggle complete"
            className={`
              mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
              transition-all duration-200 hover:scale-110
              ${task.completed
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : darkMode ? 'border-slate-500 hover:border-emerald-400' : 'border-slate-300 hover:border-emerald-400'}
            `}
          >
            {task.completed && <span className="text-xs leading-none">✓</span>}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <h3 className={`font-semibold text-sm leading-snug break-words
                ${task.completed
                  ? 'line-through text-slate-400'
                  : darkMode ? 'text-white' : 'text-slate-800'}`}
              >
                {task.title}
              </h3>
              {/* Priority badge */}
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 ${pCfg.pill}`}>
                {pCfg.label}
              </span>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {/* Course */}
              <span className={`text-xs flex items-center gap-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                📚 {task.course}
              </span>
              {/* Deadline */}
              <span className={`text-xs flex items-center gap-1 ${overdue ? 'text-red-400 font-semibold' : darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                📅 {overdue ? '⚠️ ' : ''}{formatDate(task.deadline)}
              </span>
              {/* Status chip */}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                ${task.completed
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-blue-50 text-blue-500'}`}
              >
                {task.completed ? 'Done' : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-3 justify-end">
          <button
            onClick={() => onEdit(task)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors duration-150
              ${darkMode
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="text-xs px-3 py-1.5 rounded-lg font-medium bg-red-50 text-red-500
                       hover:bg-red-100 transition-colors duration-150"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* Confirmation modal — Bonus 4 */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className={`rounded-2xl p-6 shadow-2xl max-w-sm w-full
            ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}
          >
            <div className="text-3xl mb-3 text-center">🗑️</div>
            <h3 className="font-bold text-base text-center mb-1">Delete Task?</h3>
            <p className={`text-sm text-center mb-5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              "<span className="font-medium">{task.title}</span>" will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors
                  ${darkMode ? 'border-slate-600 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-50'}`}
              >
                Cancel
              </button>
              <button
                onClick={() => { onDelete(task.id); setShowConfirm(false); }}
                className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TaskCard;