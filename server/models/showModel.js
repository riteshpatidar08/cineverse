const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
  },
  movieName: { type: String }, //denormalized for faster operator
  theaterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
  },
  theaterName: { type: String },
  screen: {
    type: String, //embedded in the theatre
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  bookedSeats: [{ type: String }], //
  priceByClass: [{ type: String }], //
  availableCount: { type: Number },
  language: { type: String },
  format: { type: String },
  isActive: { type: Boolean, default: true },
});



// 10:45  2   5 
// // moviesName ; Spider duration   // id / id /id