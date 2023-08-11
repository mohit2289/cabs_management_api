/**
 * @author Mohit Verma
 * @description this file has method to validate payload for user request
 */
const Joi = require('joi');
const { handleFailure } = require('../../../../utils/helpers');
const { user } = require('../../../../utils/errorMessages');

/**
 * @description This file has method related to add user payload validation
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 * @param {any} next called for next available route
 */
module.exports.addUser = async (req, res, next) => {
	const create = Joi.object().keys({
		fullName: Joi.string().required().trim().error(new Error(user.fullName)),
		email: Joi.string().email().required().error(new Error(user.email)),
		mobile: Joi.string().required().trim().error(new Error(user.mobile)),
		type: Joi.string().required().trim().error(new Error(user.type)),
		isMGMTUser: Joi.boolean().required().error(new Error(user.isMGMTUser)),
		departments: Joi.array()
			.items(
				Joi.object({
					deptId: Joi.string().required().error(new Error(user.deptId)),
					role: Joi.object().keys({
						roleId: Joi.string().required().error(new Error(user.roleId)),
						userType: Joi.string().required().error(new Error(user.userType)),
						permissions: Joi.array()
							.required()
							.min(1)
							.error(new Error(user.permissions)),
					}),
				})
			)
			.required(),
	});
	try {
		const result = Joi.validate(req.body, create);
		if (result.error) throw result.error;
		next();
	} catch (error) {
		handleFailure(res, 400, error.message);
	}
};

/**
 * @description This file has method related to update user payload validation
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 * @param {any} next called for next available route
 */
module.exports.updateUser = async (req, res, next) => {
	const update = Joi.object().keys({
		id: Joi.string().required().trim().error(new Error(user.id)),
		isMGMTUser: Joi.boolean().required().error(new Error(user.isMGMTUser)),
		departments: Joi.array()
			.items(
				Joi.object({
					deptId: Joi.string().required().error(new Error(user.deptId)),
					role: Joi.object().keys({
						roleId: Joi.string().required().error(new Error(user.roleId)),
						userType: Joi.string().required().error(new Error(user.userType)),
						permissions: Joi.array()
							.required()
							.min(1)
							.error(new Error(user.permissions)),
					}),
				})
			)
			.required(),
	});
	try {
		const result = Joi.validate(req.body, update);
		if (result.error) throw result.error;
		next();
	} catch (error) {
		handleFailure(res, 400, error.message);
	}
};

/**
 * @description This file has method related to delete user payload validation
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 * @param {any} next called for next available route
 */
module.exports.deleteUser = async (req, res, next) => {
	const del = Joi.object().keys({
		id: Joi.string().required().trim().error(new Error(user.id)),
	});
	try {
		const result = Joi.validate(req.body, del);
		if (result.error) throw result.error;
		next();
	} catch (error) {
		handleFailure(res, 400, error.message);
	}
};
