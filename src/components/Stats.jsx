// Stats.jsx — Displays productivity statistics at the top of the dashboard

function Stats({ tasks, darkMode }) {
  const total      = tasks.length;
  const completed  = tasks.filter(t => t.completed).length;
  const pending    = total - completed;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  const cards = [
    { label: 'Total Tasks',   value: total,      icon: '📋', color: 'from-slate-500 to-slate-600' },
    { label: 'Completed',     value: completed,  icon: '✅', color: 'from-emerald-500 to-emerald-600' },
    { label: 'Pending',       value: pending,    icon: '⏳', color: 'from-amber-500 to-amber-600' },
    { label: 'Done',          value: `${percentage}%`, icon: '🎯', color: 'from-blue-500 to-blue-600' },
  ];

  return (
    <div className="mb-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {cards.map(card => (
          <div
            key={card.label}
            className={`
              rounded-2xl p-4 text-white bg-gradient-to-br ${card.color}
              shadow-lg hover:scale-105 transition-transform duration-200 cursor-default
            `}
          >
            <div className="text-2xl mb-1">{card.icon}</div>
            <div className="text-3xl font-bold font-syne leading-none">{card.value}</div>
            <div className="text-xs mt-1 text-white/80 font-medium">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className={`rounded-xl p-3 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm border ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
        <div className="flex justify-between text-xs font-medium mb-2 text-slate-500">
          <span>Overall Progress</span>
          <span className="text-emerald-500 font-bold">{percentage}%</span>
        </div>
        <div className={`h-2.5 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default Stats;