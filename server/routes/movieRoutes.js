const express = require('express');
const { getAllMovies, nowPlaying, fetchMovieByCity, getMovieById } = require('../controllers/movieController.js');

const router = express.Router() ;


router.get('/movies' , getAllMovies)
router.get('/movies/now-playing' , nowPlaying)
router.get('/movies/nearby' , fetchMovieByCity)
router.get('/movies/:id' , getMovieById)
module.exports = router ;

