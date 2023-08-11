/**
 * @author Mohit Verma
 * @description this file has method to validate payload for sub category request
 */
const Joi = require('joi');
const probe = require('probe-image-size');
const excelvalid = require('../../../../utils/excelValidator');
const { subCategory, common } = require('../../../../utils/errorMessages');
const utils = require('../../../../utils/helpers');
const { IMAGE_DIMENSION_L3 } = require('../../../../utils/constants');

// eslint-disable-next-line no-useless-escape
const regxForAlfaNum = /^(?![0-9]*$)[A-Za-z0-9-,& /\]/\[()]*$/;
const onlyNum = /^[0-9]*$/;

const create = Joi.object().keys({
	name: Joi.string().required().error(new Error(subCategory.name)),
	description: Joi.string()
		.optional()
		.regex(regxForAlfaNum)
		.max(200)
		.error(new Error(subCategory.description)),
	parentCategoryId: Joi.string()
		.required()
		.regex(onlyNum)
		.error(new Error(subCategory.parentCategoryId)),
	templateFileUrl: Joi.string()
		.required()
		.error(new Error(subCategory.templateFileUrl)),
	categoryPageBannerImage: Joi.string()
		.required()
		.error(new Error(subCategory.categoryPageBannerImage)),
	returnPolicy: Joi.string()
		.valid('test')
		.error(new Error(subCategory.returnPolicy)),
	disclaimer: Joi.string()
		.valid('test')
		.error(new Error(subCategory.disclaimer)),
	status: Joi.boolean().required().error(new Error(subCategory.status)),
});

const update = Joi.object().keys({
	id: Joi.string().required().regex(onlyNum).error(new Error(subCategory.id)),
	description: Joi.string()
		.optional()
		.regex(regxForAlfaNum)
		.max(200)
		.error(new Error(subCategory.description)),
	templateFileUrl: Joi.string()
		.allow('')
		.error(new Error(subCategory.templateFileUrl)),
	categoryPageBannerImage: Joi.string()
		.required()
		.error(new Error(subCategory.categoryPageBannerImage)),
	returnPolicy: Joi.string()
		.valid('test')
		.error(new Error(subCategory.returnPolicy)),
	disclaimer: Joi.string()
		.valid('test')
		.error(new Error(subCategory.disclaimer)),
	status: Joi.boolean().optional().error(new Error(subCategory.status)),
});

const remove = Joi.object().keys({
	id: Joi.string().required().regex(onlyNum).error(new Error(subCategory.id)),
});

/**
 * @description Sub category create function
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @param {object} next next step
 */
module.exports.create = async (req, res, next) => {
	let filename = '';
	try {
		if (Object.entries(req.files).length > 0) {
			for (const [key, value] of Object.entries(req.files)) {
				if (
					!['jpeg', 'jpg', 'png'].includes(value[0].mimetype.split('/')[1]) &&
					key == 'categoryPageBannerImage'
				)
					throw new Error(key + ' ' + common.fileType);
				req.body[key] = value[0].location;
				const imageType = value[0].mimetype;
				if (
					(imageType == 'image/png' ||
						imageType == 'image/jpeg' ||
						imageType == 'image/jpg') &&
					key == 'categoryPageBannerImage'
				) {
					const result = await probe(value[0].location);
					if (IMAGE_DIMENSION_L3[key] == undefined)
						throw new Error(common.dimensionKey);
					if (
						result.width != IMAGE_DIMENSION_L3[key][0] &&
						result.height != IMAGE_DIMENSION_L3[key][1]
					)
						throw new Error(
							key + ' dimension should be ' + IMAGE_DIMENSION_L3[key]
						);
				} else {
					if (
						!['csv'].includes(value[0].mimetype.split('/')[1]) &&
						key == 'templateFileUrl'
					)
						throw new Error(key + ' ' + common.csvFileType);
					if (value[0].key != '') {
						filename = value[0].key;
						const rulename = 'template2';
						const excelValid = await excelvalid.excelValiation(
							filename,
							rulename
						);
						if (excelValid.error) {
							throw new Error(excelValid.error);
						} else if (excelValid.error == false) {
							utils.handleFailure(res, 400, excelValid.data);
						}
					}
				}
			}
		}
		const result = Joi.validate(req.body, create);
		if (result.error) {
			throw result.error;
		}
		next();
	} catch (error) {
		if (Object.entries(req.files).length > 0) {
			await utils.deleteS3Object(
				Object.values(req.files).map((v) => {
					return { Key: v[0].key };
				})
			);
		}
		utils.handleFailure(res, 400, error.message);
	}
};

/**
 * @description Sub category update function
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @param {object} next next step
 */
module.exports.update = async (req, res, next) => {
	let filename = '';
	try {
		if (Object.entries(req.files).length > 0) {
			for (const [key, value] of Object.entries(req.files)) {
				if (
					!['jpeg', 'jpg', 'png'].includes(value[0].mimetype.split('/')[1]) &&
					key == 'categoryPageBannerImage'
				)
					throw new Error(key + ' ' + common.fileType);
				req.body[key] = value[0].location;
				const imageType = value[0].mimetype;
				if (
					(imageType == 'image/png' ||
						imageType == 'image/jpeg' ||
						imageType == 'image/jpg') &&
					key == 'categoryPageBannerImage'
				) {
					const result = await probe(value[0].location);
					if (IMAGE_DIMENSION_L3[key] == undefined)
						throw new Error(common.dimensionKey);
					if (
						result.width != IMAGE_DIMENSION_L3[key][0] &&
						result.height != IMAGE_DIMENSION_L3[key][1]
					)
						throw new Error(
							key + ' dimension should be ' + IMAGE_DIMENSION_L3[key]
						);
				} else {
					if (
						!['csv'].includes(value[0].mimetype.split('/')[1]) &&
						key == 'templateFileUrl'
					)
						throw new Error(key + ' ' + common.csvFileType);
					if (value[0].key != '') {
						filename = value[0].key;
						const rulename = 'template2';
						const excelValid = await excelvalid.excelValiation(
							filename,
							rulename
						);
						if (excelValid.error) {
							throw new Error(excelValid.error);
						} else if (excelValid.error == false) {
							utils.handleFailure(res, 400, excelValid.data);
						}
					}
				}
			}
		}
		const result = Joi.validate(req.body, update);
		if (result.error) {
			throw result.error;
		}
		next();
	} catch (error) {
		if (Object.entries(req.files).length > 0) {
			await utils.deleteS3Object(
				Object.values(req.files).map((v) => {
					return { Key: v[0].key };
				})
			);
		}
		utils.handleFailure(res, 400, error.message);
	}
};

/**
 * @description Sub category remove function
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
		utils.handleFailure(res, 400, error);
	}
};
