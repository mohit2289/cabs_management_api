/**
 * @author Mohit Verma
 * @description this file has to handle all middleware to validate payload, authenticate and controller related to sub category
 */
const express = require('express');
const router = express.Router();
//const validator = require('express-validation');
const valid = require('../validations/subcategory.validation');
//const auth = require('../../middlewares/authorization');
const subcategoryController = require('../controllers/sub-category.controller');
const { uploadFiles } = require('../../../../middlewares/upload');
const { L3_DATA } = require('../../../../utils/constants');
const { authorize } = require('../../../../middlewares/auth');

router.post('/', authorize, valid.create, subcategoryController.create);
router.post('/update', authorize, valid.update, subcategoryController.update);
router.delete('/', valid.remove, subcategoryController.delete);

module.exports = router;
