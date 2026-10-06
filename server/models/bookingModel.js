const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unqiue: true,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'movie',
  },

  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
  },
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
  },
  showDate : {
    type : Date
  },
  showTime  : {
    type : Date
  },
  screenName : {
    type : String
  },

  seats: [
    {
      seatId: { type: String, required: true }, //G17
      row: String,
      number: String,
      category: String,
      price: { type: Number, required: true },
    },
  ],
  pricing: {
    convenienceFee: { type: Number },
    totalSeats: { type: Number },
    seatsTotal : {type : Number},
    totalAmount: { type: Number },
  },
  paymentsDetails: {
    paymentMethod: { type: String },
    status: {
      type: String,
      enum: ['success', 'failed'],
    },
  },
  status : {
    type : String ,
    enum : ['confirmed' , 
        'cancelled'
    ]
  }
});

//security ????t? req.body validate kiya kya headers kiya


const Booking = mongoose.model('Booking' , bookingSchema) ;


module.exports = Booking ;