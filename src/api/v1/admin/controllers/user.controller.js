/**
 * @author Mohit Verma
 * @description this is a user controller file has method to authenticate user and sync with micro-services
 */
const { handleSuccess, handleFailure } = require('../../../../utils/helpers');
const USER = require('../model/user.service');
/**
 * @description This method related to get user details with pagination
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */

exports.getUserList = async (req, res) => {
	try {
		const userData = await USER.getUserData();
		handleSuccess(res, userData);
	} catch (error) {
		handleFailure(res, 500, error);
	}
};

/**
 * @description This method related to add new user
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.addUser = async (req, res) => {
	try {
		//const userData = await USER.addDriver(req.body);
		handleSuccess(res, req.body);
	} catch (error) {
		handleFailure(res, 500, error);
	}
};

/**
 * @description This method related to update user
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.updateUser = async (req, res) => {
	try {
		handleSuccess(res, req.body);
	} catch (error) {
		handleFailure(res, 500, error);
	}
};

/**
 * @description This method related to delete user
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.deleteUser = async (req, res) => {
	try {
		handleSuccess(res, req.body);
	} catch (error) {
		handleFailure(res, 500, error);
	}
};
