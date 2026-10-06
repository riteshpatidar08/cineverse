const Booking = require('./bookingControllers.js');
const ShowSeat = require('../models/showSeatModel.js')
exports.createBoooking = async (req, res) => {
  try {
    const {
      showId,
      movieId,
      theaterId,
      screenName,
      showDate,
      showTime,
      seats,
      pricing,
      paymentMethod,
    } = req.body;

    //check if field is not avaiable then send eerrro response

    const seatsTotalPricing = seats.reduce(
      (acc, s) => Number(s.price) + acc,
      0
    );
    const bookingId = 'abc';
    const convenienceFee = (seatsTotalPricing * 16) / 100;
    const totalAmount = seatsTotalPricing + convenienceFee;

    const booking = await booking.create({
      bookingId,
      user: req.user ? req.user.id : null,
      movie: movieId,
      theater: theaterId,
      show: showId,
      screenName ,
      seats ,
      pricing   : {
        seatsTotal : seatsTotalPricing ,
        totalSeats : seats.length ,
        totalAmount ,
        convenienceFee
      }





    });

    const seatIds = seats.map((s)=> s.seatId ) ;

    const seatsUpdate = seatIds.map((seatId)=>{
        ShowSeat.findOneAndUpdate({show : showId , seatId}, {status : 'booked' , lockedBy : null , lockedExpiresAt : null}) 
    })

  } catch (error) {}
};
