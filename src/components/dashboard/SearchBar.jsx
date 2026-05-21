// SearchBar.jsx — Controlled input; searches by title or course name

function SearchBar({ search, onSearch, darkMode }) {
  return (
    <div className="relative mb-3">
      {/* Search icon */}
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm select-none">
        🔍
      </span>
      <input
        type="text"
        value={search}
        onChange={e => onSearch(e.target.value)}
        placeholder="Search by title or course…"
        className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border outline-none
          transition-all duration-200 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
          ${darkMode
            ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
            : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400'}`}
      />
      {/* Clear button */}
      {search && (
        <button
          onClick={() => onSearch('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600
                     transition-colors text-lg leading-none"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default SearchBar;