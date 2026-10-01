const express = require('express');
const router = express.Router();
const { getLocation, getCities } = require('../controllers/cityController');

router.get('/getLocation', getLocation);
router.get('/cities', getCities);

module.exports = router;