/**
 * @author Mohit Verma
 * @description this file has methods to handel request not found and error
 */
/**
 * @description handle not found
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @param {object} next next step
 */
exports.handleNotFound = (req, res) => {
	res.status(404);
	res.json({
		message: 'Requested resource not found',
	});
	res.end();
};

/**
 * @description handle error
 * @param {object} err Error Object
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @param {object} next next step
 */
exports.handleError = (err, req, res) => {
	res.status(err.status || 500);
	res.json({
		message: err.message,
		extra: err.extra,
		errors: err,
	});
	res.end();
};
