const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String },
  poster: { type: String },
  duration: { type: Number },
  description : {type : String},
  genres: [{ type: String }],
  censorRating: { type: String },
  releaseDate: { type: Date },
  // rating
  
  isActive : {type :Boolean, default : true}
});

const Movie = mongoose.model('Movie' , movieSchema) ;

module.exports = Movie;



// data modelling  embedding and referencing 
//denormalization and normalization


//NOTE client load => homepage => latitude , longitudee