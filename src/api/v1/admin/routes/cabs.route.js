const express = require('express');
const router = express.Router();
const cabsController = require('../controllers/cabs.controller');
const {
	authorize,
	permission,
	permissionUpdate,
} = require('../../../../middlewares/auth');
const valid = require('../validations/user.validation');

router.post('/addCabCategory', cabsController.addCabCategory);
router.post('/addCabs', cabsController.addCabs);
router.get('/getAllCabs', cabsController.getAllCabs);
router.get('/getAllCabCategories', cabsController.getAllCabCategories);
router.get('/category/:categoryid', cabsController.getCabsByCategoryId);
module.exports = router;
