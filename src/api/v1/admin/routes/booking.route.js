const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

const valid = require('../validations/fare.validation');

router.post('/add', bookingController.addbooking);
router.get('/bookinglist', bookingController.getAllBooking);
router.get('/booking-details/:id', bookingController.getBookingDetailById);

module.exports = router;
