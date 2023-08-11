/**
 * @author Mohit Verma
 * @description this file has to handle all middleware to validate payload, authenticate and controller related to collection
 */
const express = require('express');
const router = express.Router();
const valid = require('../validations/collection.validation');
const collectionController = require('../controllers/collection.controller');
const { uploadFiles } = require('../../../../middlewares/upload');
const { L1_DATA } = require('../../../../utils/constants');
const { authorize } = require('../../../../middlewares/auth');

router.post('/', authorize, valid.create, collectionController.create); // validate and create collection
router.post('/update', authorize, valid.update, collectionController.update); // validate and update collection
router.delete('/', valid.remove, collectionController.remove); // validate and delete collection

module.exports = router;
