const express = require('express');
const router = express.Router();
const { getTheaters } = require('../controllers/theaterController.js');

router.get('/theaters', getTheaters);

module.exports = router;
