const asyncHandler = require('express-async-handler');
const Show = require('../models/showModel.js');
const Screen = require('../models/ScreenModel.js');
const ShowSeat = require('../models/showSeatModel.js');
exports.getShowSeats = asyncHandler(async (req, res) => {
  const { showId } = req.params;

  const show = await Show.findById(showId)
    .populate('movie')
    .populate('theater')
    .lean();
  console.log(show);
  if (!show) {
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
    console.log('ssssssssssssssssssss', s.seatId, new Date(s.lockedExpiresAt));
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

  const newRows = rows.map((row) => {
    const rowCategory = row.category.toUpperCase();
    const rowPrice = price[rowCategory];
    console.log(rowPrice);

    const newSeats = row.seats.map((seat) => {
      const seatId = `${row.label}${seat.number} `;
      console.log(seatId, 'idddididididdidididi');
      const status = seatStatus.get(seatId);
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
});

// step 1  when we click on 9:30 show get the id from the frontend using path paramter /show/dsljdf

// show ===> screen 1, 2 ,3 => layout => seat => status => booked/freee
