import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useSelector } from 'react-redux';
export default function FeaturedSpotlight() {
  const {movies , loading} = useSelector((state)=>state.movies)
  const [activeCategory, setActiveCategory] = useState('Now Showing');
const spotlightMovies = movies ;
  const categories = ['Now Showing', 'Coming Soon', 'IMAX 4K', 'Top Rated'];

  // const spotlightMovies = [
  //   {
  //     id: '1',
  //     title: 'Toxic: A Fairy Tale for Grown-ups',
  //     category: 'Now Showing',
  //     poster: 'https://cdn.district.in/movies-assets/images/cinema/toxiv%3Dc-8340c900-9c6f-11f1-97d4-73a32236137e.jpg',
  //     rating: '4.9',
  //     reviews: '12.4k',
  //     duration: '2h 34m',
  //     genres: ['Action', 'Drama'],
  //     censor: 'A',
  //     price: '$14.99',
  //     tag: 'Blockbuster',
  //   },
  //   {
  //     id: '2',
  //     title: 'Hanuman Ansh',
  //     category: 'Top Rated',
  //     poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
  //     rating: '4.8',
  //     reviews: '18.9k',
  //     duration: '2h 15m',
  //     genres: ['Biography', 'Devotional', 'Drama'],
  //     censor: 'U',
  //     price: '$12.99',
  //     tag: 'Trending #1',
  //   },
  //   {
  //     id: '3',
  //     title: 'Spider-Man: Brand New Day',
  //     category: 'IMAX 4K',
  //     poster: 'https://cdn.district.in/movies-assets/images/cinema/image-(29)-598ac6b0-6a24-11f1-8579-1756095b1930.jpg',
  //     rating: '4.9',
  //     reviews: '24.1k',
  //     duration: '2h 22m',
  //     genres: ['Action', 'Sci-Fi'],
  //     censor: 'UA13+',
  //     price: '$16.99',
  //     tag: 'IMAX 3D',
  //   },
  //   {
  //     id: '4',
  //     title: 'Insidious: Out of the Further',
  //     category: 'Now Showing',
  //     poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800',
  //     rating: '4.6',
  //     reviews: '8.5k',
  //     duration: '1h 58m',
  //     genres: ['Horror', 'Thriller'],
  //     censor: 'A',
  //     price: '$13.50',
  //     tag: 'Midnight Special',
  //   },
  //   {
  //     id: '5',
  //     title: 'Mirzapur: The Movie',
  //     category: 'Top Rated',
  //     poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800',
  //     rating: '4.7',
  //     reviews: '15.3k',
  //     duration: '2h 40m',
  //     genres: ['Action', 'Crime'],
  //     censor: 'A',
  //     price: '$14.00',
  //     tag: 'High Demand',
  //   },
  //   {
  //     id: '6',
  //     title: 'Awarapan 2',
  //     category: 'Coming Soon',
  //     poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
  //     rating: '4.9',
  //     reviews: 'Pre-Orders',
  //     duration: '2h 18m',
  //     genres: ['Action', 'Romance'],
  //     censor: 'UA16+',
  //     price: '$15.00',
  //     tag: 'Releasing Sep 12',
  //   },
  // ];

  const filteredMovies = spotlightMovies?.filter((movie) => {
    if (activeCategory === 'Now Showing') return true;
    return movie.category === activeCategory;
  });

  return (
    <section className="py-16 md:py-24 bg-white/30 dark:bg-black/10 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-primary mb-1">
              Curated Showcase
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-h m-0">
              Trending Releases & Screenings
            </h2>
            <p className="text-text/70 text-sm md:text-base mt-2 max-w-xl">
              Discover blockbusters currently ruling the box office with 4K laser projection and Dolby Atmos sound.
            </p>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex items-center gap-1.5 glass p-1.5 rounded-2xl border border-white/20 overflow-x-auto self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                    : 'text-text/70 hover:text-text-h hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredMovies?.map((movie) => (
            <Card
              key={movie.id}
              className="group border border-white/20 dark:border-white/10 hover:border-primary/40 hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-2xl flex flex-col justify-between"
            >
              <div>
                {/* Poster Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-dark/10">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                  
                  {/* Top Overlay Badge */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center pointer-events-none">
                    <Badge variant="secondary" className="px-2.5 py-1 text-[11px] font-bold shadow-md">
                      {movie.tag}
                    </Badge>
                    <span className="glass px-2.5 py-1 rounded-full text-[10px] font-bold text-white border border-white/20">
                      {movie.censorRating}
                    </span>
                  </div>

                  {/* Hover Quick Action Backdrop */}
                  <div className="absolute inset-0 bg-neutral-dark/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <Link to="/movies">
                      <Button variant="secondary" size="sm" className="font-bold shadow-xl">
                        <span>Book Seats</span>
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Movie Details */}
                <CardContent className="pt-4 pb-2">
                  <div className="flex items-center justify-between text-xs text-text/70 mb-1.5">
                    <span>{movie.duration}</span>
                    <div className="flex items-center gap-1 font-bold text-amber-500">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{movie.rating}</span>
                      <span className="text-text/50 font-normal">({movie.reviews})</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-text-h tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                    {movie.title}
                  </h3>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {movie.genres.map((g) => (
                      <span key={g} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                        {g}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </div>

              {/* Bottom Price & Booking CTA */}
              {/* <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-text/50 uppercase">Starting From</div>
                  <div className="text-base font-extrabold text-text-h">{movie.price}</div>
                </div>
                <Link to="/movies">
                  <Button variant="ghost" size="sm" className="text-xs font-bold text-primary hover:bg-primary/10">
                    <span>Reserve →</span>
                  </Button>
                </Link>
              </div> */}
            </Card>
          ))}
        </div>

        {/* View All Callout */}
        <div className="text-center mt-12">
          <Link to="/movies">
            <Button variant="glass" size="lg" className="px-8 font-bold text-sm tracking-wider uppercase border-primary/30 hover:border-primary">
              <span>View Entire Movie Catalog (50+ Titles)</span>
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
