const express = require('express');
const router = express.Router();
const localPackageController = require('../controllers/localpackage.controller');
const {
	authorize,
	permission,
	permissionUpdate,
} = require('../../../../middlewares/auth');
const valid = require('../validations/user.validation');

//router.post('/addDistance', distanceController.addDistance);
router.get('/', localPackageController.getLocalPackage);

module.exports = router;
