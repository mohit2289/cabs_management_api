/**
 * @author Mohit Verma
 * @description this file has method to validate payload for collection request
 */
const Joi = require('joi');
const probe = require('probe-image-size');
const { collection, common } = require('../../../../utils/errorMessages');
const { handleFailure, deleteS3Object } = require('../../../../utils/helpers');
const { IMAGE_DIMENSION_L1 } = require('../../../../utils/constants');
// eslint-disable-next-line no-useless-escape
const regxForAlfaNum = /^(?![0-9]*$)[A-Za-z0-9-,& /\]/\[()]*$/;
const onlyNum = /^[0-9]*$/;

const create = Joi.object().keys({
	homepageBannerImage: Joi.string()
		.required()
		.error(new Error(collection.homepageBannerImage)),
	categoryPageBannerImage: Joi.string()
		.required()
		.error(new Error(collection.categoryPageBannerImage)),
	name: Joi.string()
		.required()
		.regex(regxForAlfaNum)
		.error(new Error(collection.name)),
	status: Joi.boolean().required().error(new Error(collection.status)),
	description: Joi.string()
		.optional()
		.regex(regxForAlfaNum)
		.max(200)
		.error(new Error(collection.description)),
});

const update = Joi.object().keys({
	id: Joi.string().required().regex(onlyNum).error(new Error(collection.id)),
	homepageBannerImage: Joi.string()
		.allow('')
		.error(new Error(collection.homepageBannerImage)),
	categoryPageBannerImage: Joi.string()
		.allow('')
		.error(new Error(collection.categoryPageBannerImage)),
	status: Joi.boolean().optional().error(new Error(collection.status)),
	description: Joi.string()
		.optional()
		.regex(regxForAlfaNum)
		.max(200)
		.error(new Error(collection.description)),
});

const remove = Joi.object().keys({
	id: Joi.string().required().regex(onlyNum).error(new Error(collection.id)),
});

/**
 * @description Collection create function
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @param {object} next next step
 */
module.exports.create = async (req, res, next) => {
	try {
		if (Object.entries(req.files).length > 0) {
			for (const [key, value] of Object.entries(req.files)) {
				if (!['jpeg', 'jpg', 'png'].includes(value[0].mimetype.split('/')[1]))
					throw new Error(common.fileType);
				req.body[key] = value[0].location;
				const result = await probe(value[0].location);
				if (IMAGE_DIMENSION_L1[key] == undefined)
					throw new Error(common.dimensionKey);
				if (
					result.width != IMAGE_DIMENSION_L1[key][0] &&
					result.height != IMAGE_DIMENSION_L1[key][1]
				)
					throw new Error(
						key + ' dimension required is ' + IMAGE_DIMENSION_L1[key]
					);
			}
		}
		const result = Joi.validate(req.body, create);
		if (result.error) throw result.error;
		next();
	} catch (error) {
		if (Object.entries(req.files).length > 0) {
			await deleteS3Object(
				Object.values(req.files).map((v) => {
					return { Key: v[0].key };
				})
			);
		}
		handleFailure(res, 400, error.message);
	}
};

/**
 * @description Collection update function
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @param {object} next next step
 */
module.exports.update = async (req, res, next) => {
	try {
		if (Object.entries(req.files).length > 0) {
			for (const [key, value] of Object.entries(req.files)) {
				if (!['jpeg', 'jpg', 'png'].includes(value[0].mimetype.split('/')[1]))
					throw new Error(common.fileType);
				req.body[key] = value[0].location;
				const result = await probe(value[0].location);
				if (IMAGE_DIMENSION_L1[key] == undefined)
					throw new Error(common.dimensionKey);
				if (
					result.width != IMAGE_DIMENSION_L1[key][0] &&
					result.height != IMAGE_DIMENSION_L1[key][1]
				)
					throw new Error(
						key + ' dimension required is ' + IMAGE_DIMENSION_L1[key]
					);
			}
		}
		const result = Joi.validate(req.body, update);
		if (result.error) throw result.error;
		next();
	} catch (error) {
		if (Object.entries(req.files).length > 0) {
			await deleteS3Object(
				Object.values(req.files).map((v) => {
					return { Key: v[0].key };
				})
			);
		}
		handleFailure(res, 400, error.message);
	}
};

/**
 * @description Collection remove function
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @param {object} next next step
 */
module.exports.remove = async (req, res, next) => {
	try {
		const result = Joi.validate(req.body, remove);
		if (result.error) throw result.error;
		next();
	} catch (error) {
		return next(error);
	}
};
