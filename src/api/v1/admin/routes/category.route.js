/**
 * @author Mohit Verma
 * @description this file has to handle all middleware to validate payload, authenticate and controller related to category
 */
const express = require('express');
const router = express.Router();
const valid = require('../validations/category.validation');
const categoryController = require('../controllers/category.controller');
const { uploadFiles } = require('../../../../middlewares/upload');
const { L2_DATA } = require('../../../../utils/constants');
const { authorize } = require('../../../../middlewares/auth');

router.post('/', authorize, valid.create, categoryController.create); // validate and create collection
router.post('/update', authorize, valid.update, categoryController.update); // validate and update collection
router.delete('/', valid.remove, categoryController.remove); // validate and delete collection

module.exports = router;
