const asyncHandler = require('express-async-handler');
const Movie = require('../models/movieModel.js');

// @desc get all movies 
//@route GET  /api/v1/movies
exports.getAllMovies = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (search) filter.title = { $regex: search, $options: 'i' };
  filter.isActive = true;

  const skip = Number(page - 1) * Number(limit);
  const movies = await Movie.find(filter).skip(skip).limit(Number(limit)).sort({ releaseDate: -1 });
  const total = await Movie.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: movies.length,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    data: movies,
  });
});

//@desc create a movie 
//@route post /api/v1/movies 
exports.createMovie = asyncHandler(async (req, res) => {
  const { title, duration, genres, censorRating, releaseDate, poster } = req.body;

  const movie = await Movie.create({
    title, duration, genres, censorRating, releaseDate, poster
  });

  res.status(201).json({ success: true, message: 'Movie successfully created', data: movie });
});

 