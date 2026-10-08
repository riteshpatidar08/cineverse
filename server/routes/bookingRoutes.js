const express =  require('express') ;
const { createBoooking, verifyPayment } = require('../controllers/bookingControllers');


const router = express.Router() ;


router.post('/create' , createBoooking  )
router.post('/verifyPayment' , verifyPayment)

module.exports = router