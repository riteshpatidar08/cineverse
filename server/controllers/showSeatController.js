const asyncHandler = require('express-async-handler');
const Show = require('../models/showModel.js');
const Screen = require('../models/ScreenModel.js');
const ShowSeat = require('../models/showSeatModel.js');

exports.getShowSeats = async (req, res) => {
  try {

    const { showId } = req.params;
console.log('showId...........................')
    const show = await Show.findById(showId)
      .populate('movie')
      .populate('theater')
      .lean();
    console.log(show);
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    let screen = await Screen.findOne({
      theater: show.theater._id,
      name: show.screenName,
    });

    console.log(screen);
    let rows = [];

    if (screen && screen.rows && screen.rows.length > 0) {
      rows = screen.rows;
    }

    const showSeats = await ShowSeat.find({ show: showId });

    const seatStatus = new Map();
    console.log(seatStatus);
    showSeats.forEach((s) => {
      console.log(
        'ssssssssssssssssssss',
        s.seatId,
        new Date(s.lockedExpiresAt)
      );
      const isSeatExpired =
        s.status === 'locked' && new Date() > new Date(s.lockedExpiresAt);
      console.log(isSeatExpired, 'expired/.....');
      seatStatus.set(s.seatId, isSeatExpired ? 'available' : s.status);
    });

    const price = {};

    if (show.categoryPricing) {
      show.categoryPricing.forEach((c) => {
        price[c.category.toUpperCase()] = c.price;
      });
    }
    console.log(price, 'p.....');

    const defaultPrices = Object.values(price);
    const fallbackPrice = defaultPrices.length > 0 ? defaultPrices[0] : 200;

    const newRows = rows.map((row) => {
      const rowCategory = row.category ? row.category.toUpperCase() : 'REGULAR';
      const rowPrice =
        price[rowCategory] !== undefined ? price[rowCategory] : fallbackPrice;
      console.log(rowPrice);

      const newSeats = row.seats.map((seat) => {
        const seatId = `${row.label}${seat.number}`;
        console.log(seatId, 'idddididididdidididi');
        const status = seatStatus.get(seatId) || 'available';
        console.log(status, 'uuuuuuuuuuuuuuuuuuuuuuuuuuuuuu');
        return {
          number: seat.number,
          seatId,
          status,
          rowPrice,
        };
      });

      return {
        label: row.label,
        category: row.category,
        price: rowPrice,
        layout: row.layout,
        seats: newSeats,
      };
    });
    res.json({
      success: true,
      data: {
        show: {
          _id: show._id,
          screenName: show.screenName,
          showDate: show.showDate,
          startTime: show.startTime,
          categoryPrice: show.categoryPricing,
        },
        movie: show.movie,
        theater: show.theater,
        rows: newRows,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// step 1  when we click on 9:30 show get the id from the frontend using path paramter /show/dsljdf

// show ===> screen 1, 2 ,3 => layout => seat => status => booked/freee

// 'Bearer kjsdfjk'

//Admin dashboard =>  integration steps + is features k andar optimzation + asa koi features jaha par bug hain aur main isko fix kiya hain /
// login /signup =>

exports.lockSeat = async (req,res) => {
  try {
    const { showId } = req.params;
    const { userId, seatIds } = req.body;
console.log(userId , seatIds)
    const seats = await ShowSeat.find({
      show: showId,
      seatId: { $in: seatIds },
    });
    // 8 1=> [1,8]
    //NOTE mujhe wo document dedo jiski id seatIds main present hain , taki main check krlu ki us seat ka status kya hain
console.log(seats , 'seatssss')
    //seat k array k andr kew do field check status , expries time ;
    //Booked , locked =>
    for (let seat of seats) {
      if (seat.status === 'booked') {
        return res.status(409).json({
          success: false,
          message: 'Seat is already booked',
        });
      }
      if (seat.status === 'locked' && seat.lockedExpiresAt > new Date()) {
        return res.status(409).json({
          success: false,
          message: 'Seat is locked by another customer',
        });
      }
    }

    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    // current time fetch karo + 10min

    for (const seat of seats) {
      seat.status = 'locked';
      seat.lockedBy = userId;
      seat.lockedExpiresAt = expiry;

      await seat.save();
    }
    res.status(200).json({
      success: true,
      lockedSeats: seatIds,
      expiresAt: expiry,
    });
  } catch (error) {
    res.status(500).json({
      error : error.message
    })
  }
};




