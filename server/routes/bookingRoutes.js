const express =  require('express') ;
const { createBoooking } = require('../controllers/bookingControllers');


const router = express.Router() ;


router.post('/create' , createBoooking  )

module.exports = router