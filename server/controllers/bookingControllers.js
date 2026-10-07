const Booking = require('./bookingControllers.js');
const ShowSeat = require('../models/showSeatModel.js');
const razorpay = require('../config/razorpay.js');
exports.createBoooking = async (req, res) => {
  try {
    const {
      showId,
      movieId,
      theaterId,
      screenName,
      // showDate,
      // showTime,
      seats,
      pricing,
      paymentMethod = 'razorpay',
    } = req.body;

    //NOTE if (paymentMethod === 'COD") order place
    //NOTE if(paymentMethod === 'razorpay)
    //NOTE check if field is not avaiable then send eerrro response

    const seatsTotalPricing = seats.reduce(
      (acc, s) => Number(s.price) + acc,
      0
    );
    const bookingId = 'abc';
    const convenienceFee = (seatsTotalPricing * 16) / 100;
    const totalAmount = seatsTotalPricing + convenienceFee;

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: 'INR',
      receipt: bookingId,
      notes: {
        name: req.user ? req.user.name : 'null',
        email: req.user ? req.user.email : 'null',
      },
    });

    console.log(orders);

    const booking = await booking.create({
      bookingId: razorpayOrder.id,
      user: req.user ? req.user.id : null,
      movie: movieId,
      theater: theaterId,
      show: showId,
      screenName,
      seats,
      pricing: {
        seatsTotal: seatsTotalPricing,
        totalSeats: seats.length,
        totalAmount,
        convenienceFee,
      },
    });

    const seatIds = seats.map((s) => s.seatId);

    const seatsUpdate = seatIds.map((seatId) => {
      ShowSeat.findOneAndUpdate(
        { show: showId, seatId },
        { status: 'booked', lockedBy: null, lockedExpiresAt: null }
      );
    });

    res.status(200).json({
      message: 'success',
      booking,
      razorpayOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
