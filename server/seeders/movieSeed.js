const mongoose = require('mongoose');
const Movie = require('../models/movieModel.js');
const dotenv = require('dotenv');
const config = require('../config/config.js');
dotenv.config();

const MONGO_URI = config.db.mongodbURI || process.env.MONGODB_URI || 'mongodb://localhost:27017/cineverse';

const movies = [
  {
    title: 'Toxic: A Fairy Tale for Grown-ups',
    poster: 'https://cdn.district.in/movies-assets/images/cinema/toxiv%3Dc-8340c900-9c6f-11f1-97d4-73a32236137e.jpg',
    duration: 154,
    genres: ['Action', 'Drama'],
    censorRating: 'A',
    releaseDate: new Date('2026-08-28'),
    isActive: true,
  },
  {
    title: 'Hanuman Ansh',
    poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    duration: 135,
    genres: ['Biography', 'Devotional', 'Drama'],
    censorRating: 'U',
    releaseDate: new Date('2026-08-25'),
    isActive: true,
  },
  {
    title: 'Mirzapur: The Movie',
    poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800',
    duration: 160,
    genres: ['Action', 'Crime', 'Thriller'],
    censorRating: 'A',
    releaseDate: new Date('2026-08-30'),
    isActive: true,
  },
  {
    title: 'Spider-Man: Brand New Day',
    poster: 'https://cdn.district.in/movies-assets/images/cinema/image-(29)-598ac6b0-6a24-11f1-8579-1756095b1930.jpg',
    duration: 142,
    genres: ['Action', 'Sci-Fi'],
    censorRating: 'UA13+',
    releaseDate: new Date('2026-08-15'),
    isActive: true,
  },
  {
    title: 'Insidious: Out of the Further',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800',
    duration: 118,
    genres: ['Horror', 'Thriller'],
    censorRating: 'A',
    releaseDate: new Date('2026-08-20'),
    isActive: true,
  },
  {
    title: 'Awarapan 2',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
    duration: 138,
    genres: ['Action', 'Romance'],
    censorRating: 'UA16+',
    releaseDate: new Date('2026-08-22'),
    isActive: true,
  },
  {
    title: "I'm Game",
    poster: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800',
    duration: 130,
    genres: ['Action', 'Thriller'],
    censorRating: 'UA16+',
    releaseDate: new Date('2026-08-26'),
    isActive: true,
  },
  {
    title: 'Bethlehem Kudumba Unit',
    poster: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800',
    duration: 125,
    genres: ['Comedy', 'Family'],
    censorRating: 'UA13+',
    releaseDate: new Date('2026-08-29'),
    isActive: true,
  },
];

const seedMovies = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    await Movie.deleteMany({});
    console.log('Existing movies deleted');

    const insertedMovies = await Movie.insertMany(movies);
    console.log(`${insertedMovies.length} movies inserted successfully`);

    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error seeding movies:', error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedMovies();


