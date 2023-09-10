const { handleSuccess, handleFailure } = require('../../../../utils/helpers');
const CITY = require('../model/city.service');

/**
 * @description This method related to add a new air/rail/bus stand
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.addAirBusRail = async (req, res) => {
	try {
		const airBusRailData = req.body; // assuming the request body contains the necessary data for air/rail/bus stand
		const result = await CITY.addAirBusRail(airBusRailData);
		handleSuccess(res, result);
	} catch (error) {
		handleFailure(res, 500, error);
	}
};

/**
 * @description This method retrieves all air/rail/bus stands from the database
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.getAllAirBusRail = async (req, res) => {
	try {
		const allAirBusRail = await CITY.getAllAirBusRail();
		handleSuccess(res, allAirBusRail);
	} catch (error) {
		handleFailure(res, 500, error);
	}
};

/**
 * @description This method retrieves all air/rail/bus stands from the database
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.getCityByStateId = async (req, res) => {
	try {
		const stateId = req.params.stateId;
		const allAirBusRail = await CITY.getCityByStateId(stateId);
		handleSuccess(res, allAirBusRail);
	} catch (error) {
		handleFailure(res, 500, error);
	}
};

/**
 * @description This method retrieves all air/rail/bus stands from the database
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.addCity = async (req, res) => {
	try {
		const postData = req.body; // assuming the request body contains the necessary data for air/rail/bus stand
		const result = await CITY.addCity(postData);
		handleSuccess(res, result);
	} catch (error) {
		handleFailure(res, 500, error);
	}
};

/**
 * @description This method retrieves all air/rail/bus stands from the database
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.getAllCity = async (req, res) => {
	try {
		const result = await CITY.getAllCity();
		handleSuccess(res, result);
	} catch (error) {
		handleFailure(res, 500, error);
	}
};

/**
 * @description This method retrieves all air/rail/bus stands from the database
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.addCityDistance = async (req, res) => {
	try {
		const postData = req.body; // assuming the request body contains the necessary data for air/rail/bus stand
		const result = await CITY.addCityDistance(postData);
		handleSuccess(res, result);
	} catch (error) {
		handleFailure(res, 500, error);
	}
};
