const express = require('express');
const { getAllMovies, nowPlaying, fetchMovieByCity, getMovieById, getShowsByMovieId } = require('../controllers/movieController.js');

const router = express.Router() ;


router.get('/movies' , getAllMovies)
router.get('/movies/now-playing' , nowPlaying)
router.get('/movies/nearby' , fetchMovieByCity)
router.get('/movies/:id' , getMovieById)
router.get('/movies/:movieid/shows' , getShowsByMovieId)
module.exports = router ;

