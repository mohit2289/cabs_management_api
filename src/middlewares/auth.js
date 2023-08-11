/**
 * @author Mohit Verma
 * @description this file has middleware methods to validate user token and check permission for user request and sync with microservices
 */
const { handleFailure } = require('../utils/helpers');
const { user } = require('../utils/errorMessages');
/**
 * @description This file has method related to authorization validation
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 * @param {any} next called for next available route
 */
exports.authorize = (req, res, next) => {
	const header = req.headers;

	req['userName'] = '';
	const user1 =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MWIyZjFkZTIzODA3MThmY2M0MGMwY2EiLCJleHAiOjE2NDMxNzgyMDIsImlhdCI6MTY0MzA5MTgwMn0.bZKrD6YHFOAWgBhfvw_7cYuv-P6_wTG9qtNs0FoQgkY';
	const user2 =
		'eyJajlsdhjkashdiuhqwuidn3o8qidXVCJ9.eyJzdWIiOiI2askdjklasjdklajskldjaskldjlkasjdlkajsldkjeHAiOjE2NDMxNzgyMDIsImlhdCI6MTY0MzA5MTgwMn0.bZKrD6YHFOAWgBhfvw_7cYuv-P67w9e8fuibjkwbefiulewbuifY';
	if (header.authorization == user1) {
		req.userName = 'mohit.verma@gmail.com';
	} else if (header.authorization == user2) {
		req.userName = 'dhee.bisht2@gmail.com';
	}
	next();
};

/**
 * @description This file has method related to permission validation
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 * @param {any} next called for next available route
 */
exports.permission = (req, res, next) => {
	const roles = [
		{
			roleId: 'roleId1',
			roleName: 'MANAGEMENT',
		},
		{
			roleId: 'roleId2',
			roleName: 'SUPERVISOR',
		},
		{
			roleId: 'roleId3',
			roleName: 'EXECUTIVE',
		},
		{
			roleId: 'roleId4',
			roleName: 'ASSOCIATE',
		},
	];
	const data = {
		sub: 'userId',
		name: 'Bhawani',
		data: {
			isMGMTUser: false,
			departments: [
				{
					deptId: 'deptId2',
					role: {
						roleId: 'roleId2',
						userType: 'MAKER',
						permissions: ['ROLE_VIEW_CATALOGUE', 'ROLE_ADD_CATALOGUE'],
					},
				},
				{
					deptId: 'deptId4',
					role: {
						roleId: 'roleId2',
						userType: 'MAKER',
						permissions: ['ROLE_EDIT_CATALOGUE', 'ROLE_ADD_CATALOGUE'],
					},
				},
			],
		},
	};
	if (data.data.isMGMTUser) {
		next();
	} else {
		try {
			const bodyData = req.body;
			bodyData.departments.forEach((value) => {
				const department = data.data.departments.find(
					(o) => o.deptId == value.deptId
				);
				if (department == undefined) {
					throw new Error(user.access(value.deptId));
				}
				const flag = roles.find(
					(o) => o.roleId === department.role.roleId
				).roleName;
				const payLoad = roles.find(
					(o) => o.roleId === value.role.roleId
				).roleName;
				if (flag == 'MANAGEMENT') {
					if (
						!value.role.permissions.every((item) =>
							department.role.permissions.includes(item)
						)
					) {
						throw new Error(
							user.permissionsDyn(
								department.role.permissions,
								value.deptId,
								flag
							)
						);
					}
				} else if (flag == 'SUPERVISOR') {
					if (!['SUPERVISOR', 'EXECUTIVE', 'ASSOCIATE'].includes(payLoad)) {
						throw new Error(user.permit);
					}
					if (
						!value.role.permissions.every((item) =>
							department.role.permissions.includes(item)
						)
					) {
						throw new Error(
							user.permissionsDyn(
								department.role.permissions,
								value.deptId,
								flag
							)
						);
					}
				} else if (flag == 'EXECUTIVE') {
					throw new Error(user.associate(value.deptId));
				} else if (flag == 'ASSOCIATE') {
					throw new Error(user.associate(value.deptId));
				}
			});
			next();
		} catch (error) {
			handleFailure(res, 400, error.message);
		}
	}
};

/**
 * @description This file has method related to update permission validation
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 * @param {any} next called for next available route
 */
exports.permissionUpdate = (req, res, next) => {
	const weight = ['MANAGEMENT', 'SUPERVISOR', 'EXECUTIVE', 'ASSOCIATE'];
	const roles = [
		{
			roleId: 'roleId1',
			roleName: 'MANAGEMENT',
		},
		{
			roleId: 'roleId2',
			roleName: 'SUPERVISOR',
		},
		{
			roleId: 'roleId3',
			roleName: 'EXECUTIVE',
		},
		{
			roleId: 'roleId4',
			roleName: 'ASSOCIATE',
		},
	];
	const data = {
		sub: 'userId',
		name: 'Bhawani',
		data: {
			isMGMTUser: false,
			departments: [
				{
					deptId: 'deptId2',
					role: {
						roleId: 'roleId2',
						userType: 'MAKER',
						permissions: ['ROLE_VIEW_CATALOGUE', 'ROLE_ADD_CATALOGUE'],
					},
				},
				{
					deptId: 'deptId3',
					role: {
						roleId: 'roleId2',
						userType: 'MAKER',
						permissions: ['ROLE_EDIT_CATALOGUE', 'ROLE_ADD_CATALOGUE'],
					},
				},
			],
		},
	};

	const userData = {
		id: '12',
		fullName: 'mohit',
		email: 'mohit@gmail.com',
		mobile: '7909069042',
		type: 'BACKOFFICE',
		isMGMTUser: false,
		departments: [
			{
				deptId: 'deptId2',
				role: {
					roleId: 'roleId2',
					userType: 'MAKER',
					permissions: ['ROLE_VIEW_CATALOGUE', 'ROLE_ADD_CATALOGUE'],
				},
			},
			{
				deptId: 'deptId3',
				role: {
					roleId: 'roleId2',
					userType: 'MAKER_CHECKER',
					permissions: ['ROLE_ADD_CATALOGUE'],
				},
			},
		],
	};
	if (data.data.isMGMTUser) {
		next();
	} else {
		try {
			const bodyData = req.body;
			bodyData.departments.forEach((value) => {
				const department = data.data.departments.find(
					(o) => o.deptId == value.deptId
				);
				if (department == undefined) {
					throw new Error(user.access(value.deptId));
				}
				const flag = roles.find(
					(o) => o.roleId === department.role.roleId
				).roleName;
				const payLoad = roles.find(
					(o) => o.roleId === value.role.roleId
				).roleName;
				if (flag == 'MANAGEMENT') {
					if (
						!value.role.permissions.every((item) =>
							department.role.permissions.includes(item)
						)
					) {
						throw new Error(
							user.permissionsDyn(
								department.role.permissions,
								value.deptId,
								flag
							)
						);
					}
				} else if (flag == 'SUPERVISOR') {
					const departmentOld = userData.departments.find(
						(o) => o.deptId == value.deptId
					);
					if (departmentOld == undefined) {
						throw new Error(user.access(value.deptId));
					}
					const flagNew = roles.find(
						(o) => o.roleId === departmentOld.role.roleId
					).roleName;
					if (weight.indexOf(flagNew) < weight.indexOf(payLoad)) {
						throw new Error(user.degrade());
					}
					if (!['SUPERVISOR', 'EXECUTIVE', 'ASSOCIATE'].includes(payLoad)) {
						throw new Error(user.permit);
					}
					if (
						!value.role.permissions.every((item) =>
							department.role.permissions.includes(item)
						)
					) {
						throw new Error(
							user.permissionsDyn(
								department.role.permissions,
								value.deptId,
								flag
							)
						);
					}
				} else if (flag == 'EXECUTIVE') {
					throw new Error(user.associate(value.deptId));
				} else if (flag == 'ASSOCIATE') {
					throw new Error(user.associate(value.deptId));
				}
			});
			next();
		} catch (error) {
			handleFailure(res, 400, error.message);
		}
	}
};
