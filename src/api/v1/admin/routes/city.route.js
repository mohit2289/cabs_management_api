const express = require('express');
const router = express.Router();
const cityController = require('../controllers/city.controller');
const {
	authorize,
	permission,
	permissionUpdate,
} = require('../../../../middlewares/auth');
const valid = require('../validations/user.validation');

router.post('/addAirBusRail', cityController.addAirBusRail);
router.get('/getAllAirBusRail', cityController.getAllAirBusRail);
router.get('/city-by-state/:stateId', cityController.getCityByStateId);
router.post('/add-city', cityController.addCity);
router.get('/city-list', cityController.getAllCity);
router.post('/add-city-distance', cityController.addCityDistance);

module.exports = router;
