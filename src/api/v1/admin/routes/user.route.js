/**
 * @author Mohit Verma
 * @description this file has to handle all middleware to validate payload, authenticate and controller related to user
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const {
	authorize,
	permission,
	permissionUpdate,
} = require('../../../../middlewares/auth');
const valid = require('../validations/user.validation');

router.get('/', userController.getUserList);
//router.post('/', authorize, valid.addUser, permission, userController.addUser);
router.post('/', userController.addUser);
router.put(
	'/',
	authorize,
	valid.updateUser,
	permissionUpdate,
	userController.updateUser
);
router.delete('/', authorize, valid.deleteUser, userController.deleteUser);

module.exports = router;
