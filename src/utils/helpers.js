/**
 * @author Mohit Verma
 * @description this file has common methods which used in entire application
 */
//const aws = require('aws-sdk');
const config = require('../config/index');

// aws.config.update({
// 	accessKeyId: config.s3AccessKey,
// 	secretAccessKey: config.s3SecretKey,
// });
//const s3 = new aws.S3();

module.exports = {
	/**
	 * @description String to Url function
	 * @param {*} value Value
	 */
	processStringToUrlFriendly: (value) => {
		return value == undefined
			? ''
			: value
					.replace(/[^a-z0-9_]+/gi, '-')
					.replace(/^-|-$/g, '')
					.toLowerCase();
	},
	/**
	 * @description Get Mongo Document Id
	 * @param {object} doc Document
	 */
	getDocumentIdString: (doc) => {
		return doc._id.toString();
	},
	/**
	 * @description This is common function to send API success message
	 * @param {*} res Response
	 * @param {*} data Data
	 * @param {*} message Error/success message
	 */
	handleSuccess: (res, data, message) => {
		const response = {
			data: data,
			error: false,
		};
		if (message) response.message = message;
		res.status(200).send(response);
	},
	/**
	 * @description This is common function to send API failure message
	 * @param {*} res Response
	 * @param {*} statusCode Status code
	 * @param {*} message Success/Error message
	 */
	handleFailure: (res, statusCode, message) => {
		res
			.status(statusCode || 500)
			.send({ error: true, message: message || 'Server error' });
	},
	/**
	 * @description This is common function to get AWS s3 bucket
	 * @param {*} bucket Bucket value
	 * @param {*} key key
	 */
	// getS3Object: (bucket, key) => {
	// 	return new Promise((resolve, reject) => {
	// 		s3.getObject(
	// 			{
	// 				Bucket: bucket, // your bucket name,
	// 				Key: key,
	// 			},
	// 			(err, data) => {
	// 				// Handle any error and exit
	// 				if (err) reject(err);
	// 				else resolve(data);
	// 			}
	// 		);
	// 	});
	// },
	/**
	 * @description This is common function to remove item from array data
	 * @param {array} array Items in array
	 * @param {*} value Value
	 */
	removeItemFromScalarAarray: (array, value) => {
		const index = array.indexOf(value);
		if (index > -1) {
			array.splice(index, 1);
		}
		return array;
	},
	/**
	 * @description This is common function to get AWS s3 stream data
	 * @param {*} bucket Bucket name
	 * @param {*} filename File name
	 */
	getS3Stream: (bucket, filename) => {
		return s3.getObject({ Bucket: bucket, Key: filename }).createReadStream();
	},
	/**
	 * @description This is common function to delete s3 object
	 * @param {object} objects Objects
	 */
	deleteS3Object: (objects) => {
		return new Promise((resolve, reject) => {
			s3.deleteObjects(
				{ Bucket: config.bucketPath, Delete: { Objects: objects } },
				(err, data) => {
					if (err) reject(err);
					else resolve(data);
				}
			);
		});
	},
	/**
	 * @description This is common function to clean
	 * @param {object} obj Object
	 */
	clean: (obj) => {
		for (const propName in obj) {
			if (obj[propName] === null || obj[propName] === undefined) {
				delete obj[propName];
			}
		}
		return obj;
	},
	generateBookingNo: () => {
		return (result = Math.random().toString(36).substring(2, 7).toUpperCase());
	},
};
