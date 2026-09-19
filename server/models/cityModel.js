const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  cityKey: { type: String },
  citylat: { type: Number },
  cityLong: { type: Number },
  cityName: { type: String },
  cleanedCityName: { type: String },
  stateName: { 
    type: String 
  },
});

const City = mongoose.model('City', citySchema);

module.exports = City;