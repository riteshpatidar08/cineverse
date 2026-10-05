const express = require('express');
const { getShowSeats, lockSeat } = require('../controllers/showSeatController');


const router = express.Router() ;


router.get('/:showId/seats' , getShowSeats);
router.post('/:showId/seats/lock' , lockSeat)


module.exports = router;