import React, { useEffect, useState, useMemo } from 'react';
import MovieGrid from '../components/movies/MovieGrid';
import MovieFilterBar from '../components/movies/MovieFilterBar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllMovies } from '../../redux/slices/moviesSlice';

export default function Movies() {
  const { movies, loading } = useSelector((s) => s.movies);
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedCensor, setSelectedCensor] = useState('All');
  const [specialFilter, setSpecialFilter] = useState('');
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);

  useEffect(() => {
    dispatch(fetchAllMovies());
  }, [dispatch]);

  const filteredMovies = useMemo(() => {
    if (!movies) return [];
    return movies.filter((m) => {
      // Search Title
      if (searchQuery && !m.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Language
      if (selectedLanguage !== 'All' && m.language?.toLowerCase() !== selectedLanguage.toLowerCase()) {
        return false;
      }
      // Genre
      if (selectedGenre !== 'All' && !m.genres?.includes(selectedGenre)) {
        return false;
      }
      // Censor Rating
      if (selectedCensor !== 'All' && m.censorRating !== selectedCensor) {
        return false;
      }
      // Special filters
      if (specialFilter === '3D' && !m.formats?.includes('3D') && !m.title.includes('3D')) {
        return false;
      }
      return true;
    });
  }, [movies, searchQuery, selectedLanguage, selectedGenre, selectedCensor, specialFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLanguage('All');
    setSelectedGenre('All');
    setSelectedCensor('All');
    setSpecialFilter('');
    setShowFiltersDropdown(false);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 16px 56px' }}>

        <MovieFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
          selectedCensor={selectedCensor}
          onSelectCensor={setSelectedCensor}
          specialFilter={specialFilter}
          onToggleSpecialFilter={(val) => setSpecialFilter(specialFilter === val ? '' : val)}
          showFiltersDropdown={showFiltersDropdown}
          onToggleFiltersDropdown={() => setShowFiltersDropdown((p) => !p)}
          onResetFilters={handleResetFilters}
        />

        {/* Page status summary */}
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Showing <strong>{filteredMovies.length}</strong> movies
          </span>
          {(searchQuery || selectedLanguage !== 'All' || selectedGenre !== 'All' || selectedCensor !== 'All' || specialFilter) && (
            <button
              onClick={handleResetFilters}
              style={{
                fontSize: 12,
                color: 'var(--accent)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Clear all filters ✕
            </button>
          )}
        </div>

        <MovieGrid loading={loading} movies={filteredMovies} />
      </div>
    </div>
  );
}
