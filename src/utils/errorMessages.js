/**
 * @author Mohit Verma
 * @description this file contain all error/success content and method response message
 */
module.exports = {
	collection: {
		id: 'collection id is required!',
		homepageBannerImage: 'homePage Banner is required!',
		categoryPageBannerImage: 'category Banner is required!',
		name: 'collection name is required and support only alphaNumeric and some special char like - & [] ()!',
		status: 'collection status is required must be boolean!',
		description:
			'collection description support only alphaNumeric and some special char like - & [] ()!!',
	},
	category: {
		id: 'category id is required!',
		parentCategoryId: 'category collection id is required!',
		categoryPageBannerImage: 'category image Url is required!',
		name: 'category name is required and support only alphaNumeric and some special char like - & [] ()!',
		status: 'category status is required must be boolean!',
		description:
			'category description support only alphaNumeric and some special char like - & [] ()!',
	},
	subCategory: {
		id: 'sub-category id is required!',
		parentCategoryId: 'category id is required!',
		templateFileUrl: 'categoryUrl is required!',
		categoryPageBannerImage: 'BannerImage is required',
		returnPolicy: 'categoryUrl return policy is required!',
		disclaimer: 'disclaimer is required!',
		name: 'sub-category name is required and support only alphaNumeric and some special char like - & [] ()!',
		status: 'sub-category status is must be boolean!',
		description:
			'sub-category description is required and support only alphaNumeric and some special char like - & [] ()!',
	},
	common: {
		dimensionKey: 'Dimension is missing!',
		fileType: 'Invalid file type',
		csvFileType: 'File type should be csv!',
	},
	categories: {
		levels: 'Required (L1,L2,L3) levels',
		levelcountmsg: 'Levels should not more then three levels',
		levelmatch: 'Levels should be like(L1,L2,L3)',
		levelDuplicate: 'Duplciate levels cant support',
	},
	categoriesStatus: {
		id: 'id is required and must be integer',
		checkerStatus:
			'checkerStatus is required and must be like (APPROVED/REJECTED)',
		requestBodyFormat: 'Request body must be array of object format like [{}]',
		rejectReason: 'Rejected reason is required',
		rejectReasonCharCount: 'Rejected reason more then 4 character',
		duplicateId: 'Duplicate id can not support',
		appovedReasonMsg: 'In approved status is not required rejected reason',
	},
	authMsg: {
		username: 'username is required',
		mobile: 'Mobile no is required',
		email: 'username must be valid email id',
		password:
			'Password is required and must be min 8 characters, max 16 characters, Alphanumeric value allowed, include at least 1 uppercase value, 1 numeric value, 1 special character',
		confirmPassword: 'Confirm password must be same',
	},
	user: {
		id: 'id is required and must be integer',
		fullName: 'fullName is required and must be string',
		email: 'email is required and must be string',
		mobile: 'mobile is required and must be integer',
		type: 'type is required and must be string',
		isMGMTUser: 'isMGMTUser is required and must be boolean',
		departments: 'departments is required and must be array',
		deptId: 'deptId is required and must be string',
		roleId: 'roleId is required and must be string',
		userType: 'userType is required and must be string',
		permissions: 'permissions is required and must be array',
		permit: 'you have only SUPERVISOR, EXECUTIVE and ASSOCIATE permission',
		/**
		 * @description Error string in the case when user does not have sufficient permission to create/update user
		 * @param {string} deptId department id/name
		 */
		associate: (deptId) => {
			return `you are not authorised to create user in this ${deptId}`;
		},
		/**
		 * @description Error string in the case when user does not have sufficient permission to create/update user
		 * @param {string} permissions department id/name
		 * @param {string} deptId department id/name
		 * @param {string} flag role id/name
		 */
		permissionsDyn: (permissions, deptId, flag) => {
			return `you have only ${permissions} permissions as ${deptId} ${flag}`;
		},
		/**
		 * @description Error string in the case when user does not have sufficient permission to update user
		 */
		degrade: () => {
			return 'degrade not allowed';
		},
		/**
		 * @description Error string in the case when user does not have sufficient permission to create/update user
		 * @param {string} deptId department id/name
		 */
		access: (deptId) => {
			return `access denied for ${deptId} department`;
		},
	},
};
