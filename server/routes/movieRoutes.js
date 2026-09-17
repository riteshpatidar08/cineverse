const express = require('express');
const { getAllMovies, nowPlaying, fetchMovieByCity, getMovieById, getShowsByMovieId } = require('../controllers/movieController.js');

const router = express.Router() ;

// Place specific routes BEFORE generic :id routes
router.get('/movies/now-playing' , nowPlaying)
router.get('/movies/nearby' , fetchMovieByCity)
router.get('/movies/:id/shows' , getShowsByMovieId)
router.get('/movies' , getAllMovies)
router.get('/movies/:id' , getMovieById)

module.exports = router ;

