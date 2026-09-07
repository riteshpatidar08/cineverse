const express = require('express');
const { getAllMovies, nowPlaying } = require('../controllers/movieController.js');

const router = express.Router() ;


router.get('/movies' , getAllMovies)
router.get('/movies/now-playing' , nowPlaying)
module.exports = router ;

