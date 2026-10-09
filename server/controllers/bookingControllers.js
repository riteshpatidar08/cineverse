const Booking = require('../models/bookingModel.js');
const ShowSeat = require('../models/showSeatModel.js');
const razorpay = require('../config/razorpay.js');
const crypto = require('crypto');
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
console.log(razorpay)
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: 'INR',
      receipt: bookingId,
      notes: {
        name: req.user ? req.user.name : 'null',
        email: req.user ? req.user.email : 'null',
      },
    });

    // console.log(orders);

    const booking = await Booking.create({
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

    await Promise.all(seatsUpdate);

    const bookingData = await Booking.findById(booking._id)
      .populate('movie')
      .populate('theater')
      .populate('show');

    res.status(200).json({
      message: 'success',
      booking: bookingData,
      razorpayOrder : {...razorpayOrder , key : process.env.RAZORPAY_API_KEY}
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      
      message: error.message,
    });
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { paymentId, signature, razorPayOrderId } = req.body;
    const booking = await Booking.findOne({ boookingId: razorPayOrderId });

    if (!booking) {
      const error = new Error('order not found');
      throw error;
    }
    const generateSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
      .update(razorPayOrderId + '|' + paymentId);

    if (generateSignature != signature) {
      res.status(400).json({
        success: false,
        message: 'Payment verfication Failed',
      });
    }

    const payment = await razorpay.payments.fetch(paymentId);
    if (payment.status === 'captured' || payment.status === 'authorized') {
      booking.paymentsDetails.status = 'confirmed';
      booking.razorPaySignature = signature;
      booking.razorPayPaymentId = paymentId;
      await booking.save();
    } else if (payment.status === 'failed') {
      booking.paymentsDetails, (status = 'failed');
      await booking.save();
    }

    res.status(200).json({
      success: true,
      message: 'payment verified',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
