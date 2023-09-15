const { handleSuccess, handleFailure } = require('../../../../utils/helpers');
const FARE = require('../model/fare.service');

/**
 * @description This method related to add a new city distance
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.addFare = async (req, res) => {
	try {
		const distanceData = req.body; // Assuming the request body contains the necessary data for city distance
		const result = await FARE.addFare(distanceData);
		handleSuccess(res, result);
	} catch (error) {
		handleFailure(res, 500, error);
	}
};

/**
 * @description Get all fare details
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.getAllFareList = async (req, res) => {
	try {
		const driverData = await FARE.getAllFareList();
		handleSuccess(res, driverData);
	} catch (error) {
		handleFailure(res, 500, error);
	}
};
