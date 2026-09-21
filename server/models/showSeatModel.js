const mongoose = require('mongoose');

const showSeatSchema = new mongoose.Schema({
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  seatId: { type: String, required: true },
  status: { type: String, enum: ['available', 'locked', 'booked'] },
  lockedBy: String,
  lockedExpiresAt: Date,
  price: Number,
});

const ShowSeat = mongoose.model('ShowSeat', showSeatSchema);

module.exports = ShowSeat;
