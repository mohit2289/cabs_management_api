/**
 * @description Api error function
 * @param {string} message error/success message
 * @param {*} status status code
 * @param {*} extra extra information
 */
module.exports = function APIError(message, status = 500, extra = null) {
	Error.captureStackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.message = message;
	this.status = status;
	this.extra = extra;
};

require('util').inherits(module.exports, Error);
