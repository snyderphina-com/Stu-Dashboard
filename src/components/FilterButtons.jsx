// FilterButtons.jsx — Filter tabs (All / Completed / Pending / High Priority)
//                     + Bonus: Sort controls (Priority / Deadline / A–Z)

const FILTERS = [
  { id: 'all',      label: 'All',          icon: '📋' },
  { id: 'pending',  label: 'Pending',      icon: '⏳' },
  { id: 'completed',label: 'Completed',    icon: '✅' },
  { id: 'high',     label: 'High Priority',icon: '🔴' },
];

const SORTS = [
  { id: 'none',     label: 'Default' },
  { id: 'priority', label: 'Priority' },
  { id: 'deadline', label: 'Deadline' },
  { id: 'alpha',    label: 'A–Z' },
];

function FilterButtons({ filter, onFilter, sort, onSort, darkMode }) {
  const btnBase = `px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5`;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
      {/* Filter tabs */}
      <div className={`flex gap-1.5 flex-wrap p-1 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => onFilter(f.id)}
            className={`${btnBase} ${
              filter === f.id
                ? 'bg-blue-600 text-white shadow-sm'
                : darkMode
                  ? 'text-slate-300 hover:bg-slate-700'
                  : 'text-slate-600 hover:bg-white hover:shadow-sm'
            }`}
          >
            <span>{f.icon}</span>
            <span>{f.label}</span>
          </button>
        ))}
      </div>

      {/* Sort selector — Bonus 2 */}
      <div className="flex items-center gap-2 ml-auto">
        <span className={`text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Sort:</span>
        <select
          value={sort}
          onChange={e => onSort(e.target.value)}
          className={`text-xs font-medium px-3 py-1.5 rounded-xl border outline-none cursor-pointer
            transition-all duration-200 focus:ring-2 focus:ring-blue-500/40
            ${darkMode
              ? 'bg-slate-800 border-slate-700 text-slate-300'
              : 'bg-white border-slate-200 text-slate-700'}`}
        >
          {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>
    </div>
  );
}

export default FilterButtons;