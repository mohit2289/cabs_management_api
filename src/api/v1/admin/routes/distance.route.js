const express = require('express');
const router = express.Router();
const distanceController = require('../controllers/distance.controller');
const {
	authorize,
	permission,
	permissionUpdate,
} = require('../../../../middlewares/auth');
const valid = require('../validations/user.validation');

router.post('/add-city-distance', distanceController.addDistance);
router.get('/get-all-distances', distanceController.getAllDistances);

module.exports = router;
