const asyncHandler = require('express-async-handler');
const Movie = require('../models/movieModel.js');
const Theater = require('../models/theaterModel.js');
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

// exports.nowPlaying = asyncHandler(async (req, res) => {
//   const { lat, lon, radius, date, page = 1, limit = 10 } = req.query;

//   console.log(radius);
//   if (!lat || !lon) {
//     throw new Error('Latitude and longitude required');
//   }
//   //number chaiye aaginge string m data ata hain ;

//   const latitude = Number(lat);
//   const longitude = Number(lon);
//   console.log(typeof latitude, latitude);
//   console.log(typeof longitude, longitude);
//   const theatres = await Theater.find({
//     location: {
//       $near: {
//         $geometry: {
//           type: 'Point',
//           coordinates: [longitude, latitude],
//         },
//         $maxDistance: Number(radius),
//       },
//     },
//   });

//   console.log(theatres);

//   //creating an array of id's of theater of current location :

//   const idOfTheaters = theatres.map((theater) => theater._id);
//   // ['08' , '09','10']
//   const userSelectedDate = date ? new Date(date) : new Date();
//   const startDay = new Date(userSelectedDate);
//   startDay.setHours(0, 0, 0, 0);
//   const endDay = new Date(userSelectedDate);
//   endDay.setHours(23, 59, 59, 999);

//   const shows = await Show.find({
//     theater: { $in: idOfTheaters },
//     startTime: { $gte: startDay, $lte: endDay },
//   })
//     .populate('movie')
//     .limit(10);

//   const theatresGroup = {};
//   theatres.forEach((theatre) => {
//     theatresGroup[theatre._id] = {
//       theatre: {
//         _id: theatre._id,
//         name: theatre.name,
//         city: theatre.city,
//         location: theatre.location,
//       },
//       movies: {},
//       showTimes: [],
//     };
//   });

//   console.log(theatresGroup);
//   res.status(200).json({
//     data: theatresGroup,
//   });
// });

exports.nowPlaying = asyncHandler(async (req, res) => {
  const { lat, lon, radius = 30000, date, page = 1, limit = 10 } = req.query;

  // -----------------------------------------
  // VALIDATE LOCATION
  // -----------------------------------------

  if (!lat || !lon) {
    throw new Error('Latitude and longitude required');
  }

  const latitude = Number(lat);
  const longitude = Number(lon);
  const maxDistance = Number(radius);

  if (
    Number.isNaN(latitude) ||
    Number.isNaN(longitude) ||
    Number.isNaN(maxDistance)
  ) {
    throw new Error('lat, lon and radius must be valid numbers');
  }

  //DATE

  const userSelectedDate = date ? new Date(date) : new Date();

  const startDay = new Date(userSelectedDate);

  startDay.setHours(0, 0, 0, 0);

  const endDay = new Date(userSelectedDate);

  endDay.setHours(23, 59, 59, 999);

  // FIND NEARBY THEATERS

  const theaters = await Theater.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistance,
      },
    },
  }).lean();

  // THEATER IDS

  const theaterIds = theaters.map((theater) => theater._id);

  // FIND SHOWS

  const shows = await Show.find({
    theater: {
      $in: theaterIds,
    },

    // IMPORTANT:
    // Use showDate if that represents the
    // calendar date of the show.
    showDate: {
      $gte: startDay,
      $lte: endDay,
    },
  })
    .populate({
      path: 'movie',
      select: 'title poster certificate language duration genres',
    })
    .lean();

  // GROUP THEATERS
  // -----------------------------------------

  const theaterMap = new Map();

  theaters.forEach((theater) => {
    theaterMap.set(theater._id.toString(), {
      theater: {
        _id: theater._id,
        name: theater.name,
        city: theater.city,
        location: theater.location,
      },

      movies: new Map(),
    });
  });

  // GROUP SHOWS

  shows.forEach((show) => {
    const theaterId = show.theater.toString();

    const theaterData = theaterMap.get(theaterId);

    if (!theaterData || !show.movie) {
      return;
    }

    const movieId = show.movie._id.toString();

    // Create movie group
    if (!theaterData.movies.has(movieId)) {
      theaterData.movies.set(movieId, {
        movie: {
          _id: show.movie._id,
          title: show.movie.title,
          poster: show.movie.poster,
          certificate: show.movie.certificate,
          language: show.movie.language,
          duration: show.movie.duration,
          genres: show.movie.genres,
        },

        shows: [],
      });
    }

    // SEAT INFORMATION

    const totalSeats = show.seatStatus?.length || 0;

    const availableSeats =
      show.seatStatus?.filter((seat) => !seat.isBooked).length || 0;

    let status = 'available';

    if (availableSeats === 0) {
      status = 'sold_out';
    } else if (availableSeats <= totalSeats * 0.2) {
      status = 'almost_full';
    } else if (availableSeats <= totalSeats * 0.5) {
      status = 'filling_fast';
    }

    // ADD SHOW

    theaterData.movies.get(movieId).shows.push({
      _id: show._id,

      screenName: show.screenName,

      startTime: show.startTime,

      totalSeats,

      availableSeats,

      status,
    });
  });

  // CONVERT MAP → ARRAY
  // -----------------------------------------

  const result = Array.from(theaterMap.values()).map((theaterData) => ({
    theater: theaterData.theater,

    movies: Array.from(theaterData.movies.values()),
  }));

  -(
    // RESPONSE

    res.status(200).json({
      success: true,

      data: {
        date: startDay.toISOString().split('T')[0],

        location: {
          latitude,
          longitude,
          radius: maxDistance,
        },

        theaters: result,

        pagination: {
          page: Number(page),
          limit: Number(limit),
          totalTheaters: result.length,
          totalPages: Math.ceil(result.length / Number(limit)),
        },
      },
    })
  );
});
//fetchmoviesbylocation , moviesDetailsApi

exports.fetchMovieByCity = asyncHandler(async (req, res) => {
  const { lat, lon, radius = 3000 } = req.query;
  const latitude = Number(lat);
  const longitude = Number(lon);
  const maxDistance = Number(radius);

  const theatresNearBy = await Theater.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistance,
      },
    },
  }).lean();
  console.log('NEARBY...', theatresNearBy);

  const theaterIds = theatresNearBy.map((t) => t._id);
  console.log('THEATERIDS.....', theaterIds);

  const MoviesIdArray = await Show.find({
    theater: { $in: theaterIds },
    // showDate : {$gte : new Date()}
  }).distinct('movie');

  console.log('SHOWS...............', MoviesIdArray);
  const movies = await Movie.find({ _id: { $in: MoviesIdArray } });

  console.log('MOVIES........', movies);
  res.status(200).json({
    data: movies,
  });
});

////fetcbMovieByid

exports.getMovieById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const movie = await Movie.findById(id);

  res.status(200).json({
    success: true,

    data: movie,
  });
});
