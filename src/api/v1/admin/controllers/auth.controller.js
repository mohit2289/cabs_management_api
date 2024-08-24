/**
 * @author Mohit Verma
 * @description this is a auth controller file has method to sync with micro-services to authenticate user
 */
const { handleSuccess, handleFailure } = require('../../../../utils/helpers');
const USER = require('../model/user.service');

/**
 * @description Login function
 * @param {object} req Request object
 * @param {object} res Response object
 */
exports.login = async (req, res) => {
	try {
		const resp = await USER.authentication(req.body);
		if (resp.length > 0) {
			handleSuccess(res, resp, 'login success');
		} else {
			handleFailure(res, 500, 'Invalid email or password');
		}
	} catch (error) {
		if (error.status == 400) {
			handleFailure(res, error.status, error.data.message);
		} else {
			handleFailure(res, 500, error);
		}
	}
};

/**
 * @description Reset password function
 * @param {object} req Request object
 * @param {object} res Response object
 */
exports.resetPassword = async (req, res) => {
	try {
		const { newPassword, confirmPassword } = req.body;
		const payLoad = {
			newPassword,
			confirmPassword,
		};
		handleSuccess(res, payLoad, 'reset password');
	} catch (error) {
		if (error.status == 400) {
			handleFailure(res, error.status, error.data.message);
		} else {
			handleFailure(res, 500, error);
		}
	}
};

exports.registration = async(req,res) => {
	try{
		const resp = await USER.registration(req.body);
		handleSuccess(res, resp, 'User register successfully');
	}
	catch (error) {
		if (error.status == 400) {
			handleFailure(res, error.status, error.data.message);
		} else {
			handleFailure(res, 500, error);
		}
	}
}
