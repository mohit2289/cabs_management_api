const { handleSuccess, handleFailure } = require('../../../../utils/helpers');
const DISTANCE = require('../model/distance.service');

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
exports.getAllDistances = async (req, res) => {
	try {
		const allDistances = await DISTANCE.getAllDistances();
		handleSuccess(res, allDistances);
	} catch (error) {
		handleFailure(res, 500, error);
	}
};

exports.getCityDistances = async(req,res) => {
	try {
		const formCity  = req.body.from_city; 
		const toCity  = req.body.to_city; 
		const allDistances = await DISTANCE.getCityDistanceByCityId(formCity,toCity);
		handleSuccess(res, allDistances);
	} catch (error) {
		handleFailure(res, 500, error);
	}
}
