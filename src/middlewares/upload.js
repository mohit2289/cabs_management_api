/**
 * @author Mohit Verma
 * @description this file has middleware methods to upload files in S3 bucket using multer
 */

/**
 * @description Upload file
 * @param {*} key Key
 * @returns
 */
const uploadsFile = (key) => {
	// return multer({
	// 	storage: multerS3({
	// 		s3: s3,
	// 		bucket: config.bucketPath,
	// 		acl: 'public-read',
	// 		metadata: (req, file, cb) => {
	// 			cb(null, { fieldName: file.fieldname });
	// 		},
	// 		key: (req, file, cb) => {
	// 			cb(
	// 				null,
	// 				key +
	// 					'/' +
	// 					Date.now().toString() +
	// 					'.' +
	// 					file.originalname.split('.')[1]
	// 			);
	// 		},
	// 	}),
	// 	fileFilter: (req, file, cb) => {
	// 		if (
	// 			file.mimetype === 'image/jpeg' ||
	// 			file.mimetype === 'image/png' ||
	// 			file.mimetype === 'text/csv'
	// 		) {
	// 			cb(null, true);
	// 		} else {
	// 			cb(null, true);
	// 		}
	// 	},
	// 	limits: {
	// 		fileSize: 1080 * 1080 * 5,
	// 	},
	// });
};

module.exports.uploadFiles = uploadsFile;
