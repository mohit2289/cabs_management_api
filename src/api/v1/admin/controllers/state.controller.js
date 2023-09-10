const { handleSuccess, handleFailure } = require('../../../../utils/helpers');
const STATE = require('../model/state.service');

/**
 * @description This method retrieves all air/rail/bus stands from the database
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.getAllStates = async (req, res) => {
	try {
		const allAirBusRail = await STATE.getAllStates();
		handleSuccess(res, allAirBusRail);
	} catch (error) {
		handleFailure(res, 500, error);
	}
};
