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

module.exports = router;
