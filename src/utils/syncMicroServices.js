/**
 * @author Mohit Verma
 * @description this file has common methods which used in entire application to call third-party apis/microservices apis
 */
const axios = require('axios');
module.exports.microServices = {
	/**
	 * @description Microservice
	 * @param {string} url Url value
	 * @param {object} payload Payload
	 */
	post: (url, payload) => {
		return new Promise((resolve, reject) => {
			axios({
				method: 'POST',
				url: url,
				headers: {
					'Content-Type': 'application/json',
					'client-id': 'node-supplier-admin-service',
				},
				data: payload,
			})
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					reject(error.response);
				});
		});
	},
	/**
	 * @description Put method
	 * @param {string} url Url value
	 * @param {object} payload Payload
	 */
	put: (url, payload) => {
		return new Promise((resolve, reject) => {
			axios({
				method: 'PUT',
				url: url,
				headers: {
					'Content-Type': 'application/json',
					'client-id': 'node-supplier-admin-service',
				},
				data: payload,
			})
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					reject(error.response);
				});
		});
	},
};
