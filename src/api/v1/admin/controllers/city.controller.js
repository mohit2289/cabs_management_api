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
