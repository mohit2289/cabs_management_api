const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

const valid = require('../validations/fare.validation');

router.post('/add', bookingController.addbooking);
router.get('/getbooking', bookingController.getAllFareList);

module.exports = router;
