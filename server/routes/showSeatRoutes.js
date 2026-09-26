const express = require('express');
const { getShowSeats } = require('../controllers/showSeatController');


const router = express.Router() ;


router.get('/:showId/seats' , getShowSeats);



module.exports = router;