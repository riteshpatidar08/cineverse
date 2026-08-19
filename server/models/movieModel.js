const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String },
  poster: { type: String },
  duration: { type: Number },
  genres: [{ type: String }],
  censorRating: { type: String },
  releaseDate: { type: Date },
  // rating
  isActive : {type : Bolean, default : true}
});

const Movie = mongoose.model('Movie' , movieSchema) ;

module.exports = Movie;

