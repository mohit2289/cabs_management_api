/**
 * @author Mohit Verma
 * @description this file has method to validate payload for category request
 */
const Joi = require('joi');
const {
	category,
	common,
	categories,
	categoriesStatus,
} = require('../../../../utils/errorMessages');
const { handleFailure, deleteS3Object } = require('../../../../utils/helpers');
const probe = require('probe-image-size');
const { IMAGE_DIMENSION_L2 } = require('../../../../utils/constants');
// eslint-disable-next-line no-useless-escape
const regxForAlfaNum = /^(?![0-9]*$)[A-Za-z0-9-,& /\]/\[()]*$/;
const categoryRegexp = /^[A-Za-z0-9-,]*$/;
const onlyNum = /^[0-9]*$/;

const create = Joi.object().keys({
	parentCategoryId: Joi.string()
		.required()
		.regex(onlyNum)
		.error(new Error(category.parentCategoryId)),
	categoryPageBannerImage: Joi.string()
		.required()
		.error(new Error(category.categoryPageBannerImage)),
	name: Joi.string()
		.required()
		.regex(regxForAlfaNum)
		.error(new Error(category.name)),
	status: Joi.boolean().required().error(new Error(category.status)),
	description: Joi.string()
		.optional()
		.regex(regxForAlfaNum)
		.max(200)
		.error(new Error(category.description)),
});

const update = Joi.object().keys({
	id: Joi.string().required().regex(onlyNum).error(new Error(category.id)),
	categoryPageBannerImage: Joi.string()
		.allow('')
		.error(new Error(category.imageUrl)),
	status: Joi.boolean().optional().error(new Error(category.status)),
	description: Joi.string()
		.optional()
		.regex(regxForAlfaNum)
		.max(200)
		.error(new Error(category.description)),
});

const remove = Joi.object().keys({
	id: Joi.string().required().regex(onlyNum).error(new Error(category.id)),
});

const getCategoryValidate = Joi.object().keys({
	levels: Joi.string()
		.required()
		.regex(categoryRegexp)
		.min(2)
		.max(8)
		.error(new Error(categories.levels)),
});

const updatestatusfields = Joi.array().items({
	id: Joi.number().required().error(new Error(categoriesStatus.id)),
	checkerStatus: Joi.string()
		.valid('APPROVED', 'REJECTED')
		.error(new Error(categoriesStatus.checkerStatus)),
	rejectReason: Joi.string().allow('').error(new Error()),
});

/**
 * @description Category create function
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
				if (IMAGE_DIMENSION_L2[key] == undefined)
					throw new Error(common.dimensionKey);
				if (
					result.width != IMAGE_DIMENSION_L2[key][0] &&
					result.height != IMAGE_DIMENSION_L2[key][1]
				)
					throw new Error(
						key + ' dimension required is ' + IMAGE_DIMENSION_L2[key]
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
 * @description Category update function
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
				if (IMAGE_DIMENSION_L2[key] == undefined)
					throw new Error(common.dimensionKey);
				if (
					result.width != IMAGE_DIMENSION_L2[key][0] &&
					result.height != IMAGE_DIMENSION_L2[key][1]
				)
					throw new Error(
						key + ' dimension required is ' + IMAGE_DIMENSION_L2[key]
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
 * @description Category remove function
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
		handleFailure(res, 400, error.message);
	}
};

/**
 * @description Category get function
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @param {object} next next step
 */
module.exports.getCategory = async (req, res, next) => {
	try {
		const acceptedValue = ['L1', 'L2', 'L3'];
		const result = Joi.validate(req.query, getCategoryValidate);
		const arr = req.query.levels.split(',');
		if (arr.length > 3) {
			throw new Error(categories.levelcountmsg);
		}
		let invalidValueExist = false;
		arr.forEach((level) => {
			if (!acceptedValue.includes(level)) {
				invalidValueExist = true;
			}
		});
		if (invalidValueExist) {
			throw new Error(categories.levelmatch);
		}
		const levelCount = { L1: 0, L2: 0, L3: 0 };
		arr.forEach((level) => {
			levelCount[level] = levelCount[level] + 1;
		});

		const checkDuplicateLevel = Object.keys(levelCount).filter((key) => {
			return levelCount[key] > 1;
		});
		if (checkDuplicateLevel.length > 0) {
			throw new Error(categories.levelDuplicate);
		}

		if (result.error) throw result.error;
		next();
	} catch (error) {
		handleFailure(res, 400, error.message);
	}
};

/**
 * @description Category update status function
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @param {object} next next step
 */
module.exports.updateStatus = async (req, res, next) => {
	try {
		const postData = req.body;
		if (typeof postData.length == 'undefined') {
			throw new Error(categoriesStatus.requestBodyFormat);
		}
		const result = Joi.validate(req.body, updatestatusfields);
		const idcountArr = [];
		const counts = {};
		for (let i = 0; i < postData.length; i++) {
			if (!postData[i].hasOwnProperty('checkerStatus')) {
				throw new Error(categoriesStatus.checkerStatus);
			}
			if (postData[i]['checkerStatus'] == 'REJECTED') {
				idcountArr[i] = postData[i]['id'];
				if (!postData[i].hasOwnProperty('rejectReason')) {
					throw new Error(categoriesStatus.rejectReason);
				}
				if (
					postData[i].hasOwnProperty('rejectReason') &&
					postData[i]['rejectReason'].length < 4
				) {
					throw new Error(categoriesStatus.rejectReasonCharCount);
				}
			}
			if (
				postData[i]['checkerStatus'] == 'APPROVED' &&
				postData[i].hasOwnProperty('rejectReason')
			) {
				throw new Error(categoriesStatus.appovedReasonMsg);
			}
		}
		idcountArr.forEach((x) => {
			counts[x] = (counts[x] || 0) + 1;
		});
		const checkDuplicateId = Object.keys(counts).filter((key) => {
			return counts[key] > 1;
		});
		if (checkDuplicateId.length > 0) {
			throw new Error(categoriesStatus.duplicateId);
		}
		if (result.error) throw result.error;
		next();
	} catch (error) {
		handleFailure(res, 400, error.message);
	}
};
