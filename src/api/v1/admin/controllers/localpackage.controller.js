const { handleSuccess, handleFailure } = require('../../../../utils/helpers');
const LOCALPACKAGE = require('../model/localpackage.service');

/**
 * @description This method related to add a new city distance
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.addDistance = async (req, res) => {
	try {
		const distanceData = req.body; // Assuming the request body contains the necessary data for city distance
		const result = await DISTANCE.addDistance(distanceData);
		handleSuccess(res, result);
	} catch (error) {
		handleFailure(res, 500, error);
	}
};

/**
 * @description This method retrieves all city distances from the database
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.getLocalPackage = async (req, res) => {
	try {
		const allDistances = await LOCALPACKAGE.getLocalPackage();
		handleSuccess(res, allDistances);
	} catch (error) {
		handleFailure(res, 500, error);
	}
};
