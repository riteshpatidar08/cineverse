import React from 'react';
import MovieCard from './MovieCard';
import { Spinner } from '../ui/Spinner';
import { useSelector } from 'react-redux';
export default function MovieGrid({  loading = false }) {

  const {movies} = useSelector((state)=>state.movies)
  
  console.log(movies)
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Spinner size="lg" className="text-primary" />
        <p className="text-sm text-text/60 font-medium">Loading movies...</p>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-16 glass rounded-3xl p-8 border border-white/10">
        <h3 className="text-xl font-bold text-text-h mb-2">No movies available</h3>
        <p className="text-sm text-text/60">Check back soon for new movie releases.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 md:gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie._id || movie.title} movie={movie} />
      ))}
    </div>
  );
}
