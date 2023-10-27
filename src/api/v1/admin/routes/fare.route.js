const express = require('express');
const router = express.Router();
const fareController = require('../controllers/fare.controller');
const {
	authorize,
	permission,
	permissionUpdate,
} = require('../../../../middlewares/auth');
const valid = require('../validations/fare.validation');

router.post('/add-fare', fareController.addFare);
router.get('/get-all-fare', fareController.getAllFareList);
router.post('/search-cab', fareController.getSearhCab);

module.exports = router;
