const mongoose = require('mongoose');

const showSeatSchema = new mongoose.Schema({
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  seatId: { type: String, required: true },
  status: {
    type: String,
    enum: ['available', 'locked', 'booked', 'blocked'],
    default: 'available',
  },
  lockedBy: { type: String },
  lockedExpiresAt: Date,
  blockReason: { type: String }, // e.g. 'Broken Armrest', 'VIP Hold', 'Box Office Offline'
  price: Number,
});

showSeatSchema.index({ show: 1, seatId: 1 }, { unique: true });

const ShowSeat = mongoose.model('ShowSeat', showSeatSchema);

module.exports = ShowSeat;

