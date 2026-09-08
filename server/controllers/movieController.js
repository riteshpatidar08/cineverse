const asyncHandler = require('express-async-handler');
const Movie = require('../models/movieModel.js');
const Theater = require('../models/theatreModel.js');
const Show = require('../models/showModel.js');
// @desc get all movies
//@route GET  /api/v1/movies
exports.getAllMovies = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (search) filter.title = { $regex: search, $options: 'i' };
  filter.isActive = true;

  const skip = Number(page - 1) * Number(limit);
  const movies = await Movie.find(filter)
    .skip(skip)
    .limit(Number(limit))
    .sort({ releaseDate: -1 });
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
  const { title, duration, genres, censorRating, releaseDate, poster } =
    req.body;

  const movie = await Movie.create({
    title,
    duration,
    genres,
    censorRating,
    releaseDate,
    poster,
  });

  res.status(201).json({
    success: true,
    message: 'Movie successfully created',
    data: movie,
  });
});

exports.nowPlaying = asyncHandler(async (req, res) => {
  const { lat, lon, radius, date, page = 1, limit = 10 } = req.query;

  console.log(radius);
  if (!lat || !lon) {
    throw new Error('Latitude and longitude required');
  }
  //number chaiye aaginge string m data ata hain ;

  const latitude = Number(lat);
  const longitude = Number(lon);
  console.log(typeof latitude, latitude);
  console.log(typeof longitude, longitude);
  const theatres = await Theater.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: Number(radius),
      },
    },
  });

  console.log(theatres);

  //creating an array of id's of theater of current location :

  const idOfTheaters = theaters.map((theater) => theater._id);
  // ['08' , '09','10']
  const userSelectedDate = date ? new Date(date) : new Date();
  const startDay = new Date(userSelectedDate);
  startDay.setHours(0, 0, 0, 0);
  const endDay = new Date(userSelectedDate);
  endDay.setHours(23, 59, 59, 999);

  const shows = await Show.find({
    theater: { $in: idOfTheaters },
    startTime: { $gte: startDay, $lte: endDay },
  }).populate('movie')

  console.log(shows) ;
  res.status(200).json({
    data : shows
  })
});
