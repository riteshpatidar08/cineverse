import React from 'react';

export default function MovieFilterBar({
  searchQuery,
  onSearchChange,
  selectedLanguage,
  onSelectLanguage,
  selectedGenre,
  onSelectGenre,
  selectedCensor,
  onSelectCensor,
  specialFilter,
  onToggleSpecialFilter,
  showFiltersDropdown,
  onToggleFiltersDropdown,
  onResetFilters,
}) {
  const quickPills = [
    { label: 'All', value: 'All' },
    { label: 'Hindi', value: 'Hindi' },
    { label: 'English', value: 'English' },
    { label: 'Malayalam', value: 'Malayalam' },
    { label: 'New Releases', value: 'New Releases', type: 'special' },
    { label: '3D', value: '3D', type: 'special' },
  ];

  return (
    <div>
      {/* Section Header & Search Box */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-text-h tracking-tight m-0">
            This Week's Releases
          </h2>
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 text-xs md:text-sm rounded-full glass border border-white/20 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-h placeholder:text-text/50 transition-all"
          />
          <svg
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text/50 hover:text-text-h text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter Pill Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
        {/* Filters Dropdown Pill Button */}
        <div className="relative">
          <button
            onClick={onToggleFiltersDropdown}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
              selectedGenre !== 'All' || selectedCensor !== 'All'
                ? 'bg-primary text-white border-primary shadow-md'
                : 'glass border-white/20 dark:border-white/10 text-text-h hover:bg-white/10'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span>Filters</span>
            <svg className="w-3 h-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu for Filters */}
          {showFiltersDropdown && (
            <div className="absolute left-0 mt-2 w-64 glass rounded-2xl p-4 shadow-2xl border border-white/20 dark:border-white/10 z-30 space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-text/60 mb-1 block">
                  Genre
                </label>
                <select
                  value={selectedGenre}
                  onChange={(e) => onSelectGenre(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg glass border border-white/10 text-text-h focus:outline-none"
                >
                  <option value="All">All Genres</option>
                  <option value="Action">Action</option>
                  <option value="Biography">Biography</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Crime">Crime</option>
                  <option value="Devotional">Devotional</option>
                  <option value="Drama">Drama</option>
                  <option value="Horror">Horror</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Romance">Romance</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Thriller">Thriller</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-text/60 mb-1 block">
                  Censor Rating
                </label>
                <select
                  value={selectedCensor}
                  onChange={(e) => onSelectCensor(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg glass border border-white/10 text-text-h focus:outline-none"
                >
                  <option value="All">All Ratings</option>
                  <option value="U">U (Universal)</option>
                  <option value="UA13+">UA13+</option>
                  <option value="UA16+">UA16+</option>
                  <option value="A">A (Adults Only)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-between">
                <button onClick={onResetFilters} className="text-xs text-red-400 hover:underline">
                  Reset Filters
                </button>
                <button
                  onClick={onToggleFiltersDropdown}
                  className="text-xs bg-primary text-white px-3 py-1 rounded-md font-semibold"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Language & Category Filter Pills */}
        {quickPills.map((pill) => {
          const isSelected =
            pill.type === 'special'
              ? specialFilter === pill.value
              : selectedLanguage === pill.value;

          return (
            <button
              key={pill.label}
              onClick={() => {
                if (pill.type === 'special') {
                  onToggleSpecialFilter(pill.value);
                } else {
                  onSelectLanguage(pill.value);
                }
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-text-h text-[var(--bg)] font-bold border-text-h shadow-sm'
                  : 'glass border-white/20 dark:border-white/10 text-text-h hover:bg-white/10'
              }`}
            >
              {pill.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
