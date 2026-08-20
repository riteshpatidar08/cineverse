const asyncHandler = require('express-async-handler');
const Movie = require('../models/movieModel.js');

// @desc get all movies 
//@route GET  /api/v1/movies
exports.getAllMovies = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;

  const filter = {};
// {title : {$regex : 'hello'}, isActive : true}
  if (search) filter.title = { $regex: search, $option: 'i' };
filter.isActive =  true
  const skip = Number(page - 1) * Number(limit);
  const movies = await Movie.find(filter).skip(skip).limit(Number(limit)).sort({releaseDate : -1});
//   const totalMovies = Movie.countDocuments(filter);
  const total = await Movie.countDocuments();
  res.status(200).json({
    success: true,
    count: movies.length,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    data: movies,
  });
});

//  pagination , search , limit = req query

//@desc create a movie 
//@route post /api/v1/movies 

exports.createMovie = asyncHandler(async()=>{
    const {title , duration , genres  , censorRating , releaseDate} = req.body ;

    //validation 
    //handle the poster using cloudinary extract from req.file 

    const movie = await Movie.create({
        title , duration , genres , censorRating , releaseDate 
    })

    res.status(201).json({success : true ,message : 'Movie successfully created', data : movie})
}

//getMovieById //updateMovie , //deactive Movie (soft delete) // deleteMovie hard delete

//revise the redux toolkit 