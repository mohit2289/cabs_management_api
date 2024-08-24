/**
 * @author Mohit Verma
 * @description this file has to handle all middleware like [payload] validation, controller related to user auth
 */
const express = require('express');
const router = express.Router();
const payloadValidation = require('../validations/auth.validation');
const authController = require('../controllers/auth.controller');

router.post('/login', payloadValidation.login, authController.login);
router.post('/signup', payloadValidation.registeruser, authController.registration);
router.post(
	'/reset-password',
	payloadValidation.resetpass,
	authController.resetPassword
);

module.exports = router;
