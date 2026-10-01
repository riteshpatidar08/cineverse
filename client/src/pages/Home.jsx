import React, { useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import MovieHeroCarousel from '../components/movies/MovieHeroCarousel';
import FeaturedSpotlight from '../components/home/FeaturedSpotlight';
import OffersSection from '../components/home/OffersSection';
import NearbyTheatersSection from '../components/home/NearbyTheatersSection';
import UpcomingSection from '../components/home/UpcomingSection';
import { nearByMovies, fetchAllMovies } from '../../redux/slices/moviesSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function Home() {
  const dispatch = useDispatch();
  const { latitude, longitude } = useSelector((s) => s.location);
  const { moviesByCity, movies } = useSelector((s) => s.movies);

  useEffect(() => {
    if (latitude && longitude) {
      dispatch(nearByMovies({ latitude, longitude }));
    }
    dispatch(fetchAllMovies());
  }, [latitude, longitude, dispatch]);

  const featuredList = moviesByCity?.length > 0 ? moviesByCity : movies || [];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <HeroSection />
      <MovieHeroCarousel movies={featuredList} />
      <FeaturedSpotlight />
      <NearbyTheatersSection />
      <OffersSection />
      <UpcomingSection />
    </div>
  );
}
