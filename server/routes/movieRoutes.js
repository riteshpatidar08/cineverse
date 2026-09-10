const express = require('express');
const { getAllMovies, nowPlaying, fetchMovieByCity } = require('../controllers/movieController.js');

const router = express.Router() ;


router.get('/movies' , getAllMovies)
router.get('/movies/now-playing' , nowPlaying)
router.get('/movies/nearby' , fetchMovieByCity)
module.exports = router ;

