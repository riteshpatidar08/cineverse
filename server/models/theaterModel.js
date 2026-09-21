const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
  name: { type: String },
  city: { type: String },
  location: {
    type: {
      type: String,
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

theaterSchema.index({location : "2dsphere"});
const Theater = mongoose.model('Theater', theaterSchema);
module.exports = Theater;
