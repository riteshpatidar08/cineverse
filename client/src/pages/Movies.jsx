import React, { useState, useEffect } from 'react';
import { fetchMovies } from '../services/movie.api';
import MovieHeroCarousel from '../components/movies/MovieHeroCarousel';
import MovieGrid from '../components/movies/MovieGrid';
import { useDispatch  , useSelector} from 'react-redux';
import { storeMovies } from '../../redux/slices/moviesSlice';

export default function Movies() {
    const {movies} = useSelector((state)=>state.movies)
    console.log(movies)
  // const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
const dispatch  = useDispatch()
  // Featured Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fallback seed movies if backend database is initializing
  const fallbackMovies = [
    {
      _id: '1',
      title: 'Hanuman Ansh',
      poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
      duration: 135,
      genres: ['Biography', 'Devotional', 'Drama'],
      censorRating: 'U',
    },
    {
      _id: '2',
      title: 'Toxic: A Fairy Tale for Grown-ups',
      poster: 'https://cdn.district.in/movies-assets/images/cinema/toxiv%3Dc-8340c900-9c6f-11f1-97d4-73a32236137e.jpg',
      duration: 154,
      genres: ['Action', 'Drama'],
      censorRating: 'A',
    },
    {
      _id: '3',
      title: 'Mirzapur: The Movie',
      poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800',
      duration: 160,
      genres: ['Action', 'Crime', 'Thriller'],
      censorRating: 'A',
    },
    {
      _id: '4',
      title: 'Spider-Man: Brand New Day',
      poster: 'https://cdn.district.in/movies-assets/images/cinema/image-(29)-598ac6b0-6a24-11f1-8579-1756095b1930.jpg',
      duration: 142,
      genres: ['Action', 'Sci-Fi'],
      censorRating: 'UA13+',
    },
    {
      _id: '5',
      title: 'Insidious: Out of the Further',
      poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800',
      duration: 118,
      genres: ['Horror', 'Thriller'],
      censorRating: 'A',
    },
    {
      _id: '6',
      title: 'Awarapan 2',
      poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
      duration: 138,
      genres: ['Action', 'Romance'],
      censorRating: 'UA16+',
    },
    {
      _id: '7',
      title: "I'm Game",
      poster: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800',
      duration: 130,
      genres: ['Action', 'Thriller'],
      censorRating: 'UA16+',
    },
    {
      _id: '8',
      title: 'Bethlehem Kudumba Unit',
      poster: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800',
      duration: 125,
      genres: ['Comedy', 'Family'],
      censorRating: 'UA13+',
    },
  ];

  // Fetch movies from /api/v1/movies
  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const response = await fetchMovies();
        const apiData = response.data?.data || response.data || [];
        if (Array.isArray(apiData) && apiData.length > 0) {
          // setMovies(apiData);
          dispatch(storeMovies(apiData))
        } else {
          // setMovies(fallbackMovies);
          // dispatch(storeMovies(fallbackMovies))
        }
      } catch (err) {
        console.warn('API error, using fallback seed movies:', err);
    
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, [dispatch]);

  // Carousel Movies (First 4 movies or all movies)
  const featuredMovies = [];

  // Carousel Auto-Play Timer
  useEffect(() => {
    if (featuredMovies.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredMovies.length, isPaused]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? featuredMovies.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-text pb-20 transition-colors duration-300">
      {/* 1. Hero Featured Carousel */}
      <MovieHeroCarousel
        featuredMovies={featuredMovies}
        currentSlide={currentSlide}
        onPrevSlide={handlePrevSlide}
        onNextSlide={handleNextSlide}
        onSelectSlide={setCurrentSlide}
        onPause={() => setIsPaused(true)}
        onResume={() => setIsPaused(false)}
      />

      {/* 2. Main Movies Grid Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-text-h tracking-tight m-0">
            This Week's Releases
          </h2>
        </div>

        {/* Movies Grid */}
        <MovieGrid movies={movies} loading={loading} />
      </div>
    </div>
  );
}
