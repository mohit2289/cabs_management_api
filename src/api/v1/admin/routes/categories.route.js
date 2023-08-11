/**
 * @author Mohit Verma
 * @description this file has to handle all middleware to validate payload, authenticate and controller related to categories
 */
const express = require('express');
const router = express.Router();
const valid = require('../validations/category.validation');
const { authorize } = require('../../../../middlewares/auth');
const categoriesController = require('../controllers/categories.controller');

router.get('/', valid.getCategory, categoriesController.getCategoriesData);
router.put(
	'/status',
	authorize,
	valid.updateStatus,
	categoriesController.updateCategoriesStatus
);
module.exports = router;
