/**
 * @author Mohit Verma
 * @description this file has to handle all middleware to validate payload, authenticate and controller related to configuration
 */
const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/config.controller');
const { authorize } = require('../../../../middlewares/auth');

router.get('/', authorize, departmentController.getDepartment);
router.get('/navigation', authorize, departmentController.getNavigation);
module.exports = router;
