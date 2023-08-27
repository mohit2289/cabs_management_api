const { handleSuccess, handleFailure } = require('../../../../utils/helpers');
const CABS = require('../model/cabs.service');
const moment = require('moment');

/**
 * @description This method related to add a new cab category
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.addCabCategory = async (req, res) => {
	try {
		let cabCategoryData = req.body; 
		cabCategoryData.added_date = moment(new Date()).format('yyyy-MM-DD hh:mm:ss');
		const result = await CABS.addCabCategory(cabCategoryData);
		handleSuccess(res, result);
	} catch (error) {
		handleFailure(res, 500, error);
	}
};

/**
 * @description This method related to add new cabs
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.addCabs = async (req, res) => {
	try {
		const cabsData = req.body; 
		cabsData.added_date = moment(new Date()).format('yyyy-MM-DD hh:mm:ss');
		const result = await CABS.addCabs(cabsData); // Placeholder for the addCabs function in cabs.service.js
		handleSuccess(res, result);
	} catch (error) {
		handleFailure(res, 500, error);
	}
};

/**
 * @description This method retrieves all cabs from the database
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.getAllCabs = async (req, res) => {
	try {
		const allCabs = await CABS.getAllCabs();
		handleSuccess(res, allCabs);
	} catch (error) {
		handleFailure(res, 500, error);
	}
};

/**
 * @description This method retrieves all cab categories from the database
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.getAllCabCategories = async (req, res) => {
	try {
		const allCabCategories = await CABS.getAllCabCategories();
		handleSuccess(res, allCabCategories);
	} catch (error) {
		handleFailure(res, 500, error);
	}
};
