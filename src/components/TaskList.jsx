// TaskList.jsx — Renders the filtered & sorted list of TaskCards
// Shows a friendly empty-state message when no tasks match.

import TaskCard from './TaskCard';

function TaskList({ tasks, onToggle, onDelete, onEdit, darkMode }) {
  if (tasks.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 px-4 rounded-2xl border border-dashed
        ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
      >
        <span className="text-5xl mb-3 select-none">📭</span>
        <p className={`font-semibold text-base ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          No tasks here
        </p>
        <p className={`text-sm mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Try a different filter, or add a new task above.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* .map() renders one TaskCard per task */}
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          darkMode={darkMode}
        />
      ))}
    </div>
  );
}

export default TaskList;