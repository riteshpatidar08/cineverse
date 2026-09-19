const express = require('express')

const router = express.Router() ;
const {getLocation} = require('../controllers/cityController')

router.get('/getLocation' , getLocation);



module.exports = router ;