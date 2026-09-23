const express = require('express') ;
const { getScreenByTheater } = require('../controllers/screenController');
const router = express.Router() ;



router.get('/theater/:theaterId' , getScreenByTheater);

module.exports = router