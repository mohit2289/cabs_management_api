/**
 * @author Mohit Verma
 * @description this file has to handle all middleware to validate payload, authenticate and controller related to user
 */
const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driver.controller');
const {
	authorize,
	permission,
	permissionUpdate,
} = require('../../../../middlewares/auth');
const valid = require('../validations/user.validation');

router.get('/', driverController.getDriverList);
router.post('/', driverController.addDriver);
router.put('/', authorize, valid.updateUser, driverController.updateUser);
router.delete('/', authorize, valid.deleteUser, driverController.deleteUser);

module.exports = router;
