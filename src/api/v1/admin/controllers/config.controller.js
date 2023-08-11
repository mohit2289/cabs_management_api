/**
 * @author Mohit Verma
 * @description this is a config controller file has method to set user permission and sync with micro-services
 */
const { handleSuccess, handleFailure } = require('../../../../utils/helpers');
/**
 * @description get department data with role access permission
 * @param {object} req Request object data
 * @param {object} res Response object data
 */
exports.getDepartment = async (req, res) => {
	try {
		const data = {
			departments: [
				{
					id: 'uuid',
					deptName: 'CATALOGUE',
					deptDesc: 'Catalogue Department',
					roles: [
						{
							roleId: 'roleId2',
							userTypes: [
								{
									type: 'MAKER',
									permissions: ['ROLE_VIEW_CATEGORY'],
								},
								{
									type: 'CHECKER',
									permissions: ['ROLE_VIEW_CATEGORY', 'ROLE_EDIT_CATALOGUE'],
								},
								{
									type: 'MAKER_CHECKER',
									permissions: ['ROLE_VIEW_CATEGORY', 'ROLE_EDIT_CATALOGUE'],
								},
							],
						},
					],
					permissions: [
						{
							PermissionId: 'ROLE_VIEW_CATALOGUE',
							Label: 'View Catalogue',
						},
						{
							PermissionId: 'ROLE_ADD_CATALOGUE',
							Label: 'Add Catalogue',
						},
						{
							PermissionId: 'ROLE_EDIT_CATALOGUE',
							Label: 'Edit Catalogue',
						},
						{
							PermissionId: 'ROLE_DELETE_CATALOGUE',
							Label: 'Delete Catalogue',
						},
					],
				},
				{
					id: 'uuid',
					deptName: 'ANALYTICS',
					deptDesc: 'Analytics Department',
					roles: [
						{
							roleId: 'roleId2',
							userTypes: [
								{
									type: 'MAKER',
									permissions: [
										'ROLE_VIEW_ANALYTICS',
										'ROLE_ADD_ANALYTICS',
										'ROLE_EDIT_ANALYTICS',
									],
								},
								{
									type: 'CHECKER',
									permissions: ['ROLE_VIEW_ANALYTICS', 'ROLE_EDIT_ANALYTICS'],
								},
								{
									type: 'MAKER_CHECKER',
									permissions: [
										'ROLE_VIEW_ANALYTICS',
										'ROLE_EDIT_ANALYTICS',
										'ROLE_DELETE_ANALYTICS',
									],
								},
							],
						},
						{
							roleId: 'roleId4',
							userTypes: [
								{
									type: 'MAKER',
									permissions: ['ROLE_VIEW_ANALYTICS'],
								},
							],
						},
					],
					permissions: [
						{
							PermissionId: 'ROLE_VIEW_ANALYTICS',
							Label: 'View Analytics',
						},
						{
							PermissionId: 'ROLE_ADD_ANALYTICS',
							Label: 'Add Analytics',
						},
						{
							PermissionId: 'ROLE_EDIT_ANALYTICS',
							Label: 'Edit Analytics',
						},
						{
							PermissionId: 'ROLE_DELETE_ANALYTICS',
							Label: 'Delete Analytics',
						},
					],
				},
			],
			roles: [
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
			],
			userType: [
				{
					typeId: 'MAKER',
					typeName: 'Maker',
				},
				{
					typeId: 'CHECKER',
					typeName: 'Checker',
				},
				{
					typeId: 'MAKER_CHECKER',
					typeName: 'Maker and Checker',
				},
			],
		};

		data.departments.forEach((value) => {
			value.roles.forEach((val) => {
				val['roleName'] = data.roles.find(
					(o) => o.roleId === val.roleId
				).roleName;
				val.userTypes.forEach((valType) => {
					valType['typeName'] = data.userType.find(
						(o) => o.typeId === valType.type
					).typeName;
					const permissionArray = [];
					valType.permissions.forEach((premit) => {
						const permission = value.permissions.find(
							(o) => o.PermissionId === premit
						);
						if (permission != undefined) {
							permissionArray.push(permission);
						}
					});
					if (permissionArray.length > 0) {
						valType['permissions'] = permissionArray;
					}
				});
			});
		});

		handleSuccess(res, data);
	} catch (error) {
		handleFailure(res, 500, error);
	}
};

/**
 * @description get navigation data
 * @param {object} req Request data
 * @param {object} res Response Data
 */
exports.getNavigation = async (req, res) => {
	try {
		const data = [
			{
				item: 'Category',
				child: [
					{
						item: 'Dashboard',
						oneOfPermission: null,
						oneOfRole: ['MANAGEMENT', 'SUPERVISOR'],
					},
				],
			},
			{
				item: 'Collection',
				child: [
					{
						item: 'View',
						oneOfPermission: ['VIEW_CATEGORY', 'ADD_CATEGORY'],
						oneOfRole: null,
					},
				],
			},
			{
				item: 'Category',
				oneOfRole: null,
				oneOfPermission: ['VIEW_CATEGORY'],
				child: null,
			},
			{
				item: 'Supplier',
				child: [
					{
						item: 'Activate',
						oneOfRole: null,
						oneOfPermission: ['ACTIVATE_SUPPLIER'],
					},
					{
						item: 'Deactivate',
						oneOfRole: null,
						oneOfPermission: ['DEACTIVATE_SUPPLIER'],
					},
				],
			},
		];

		handleSuccess(res, data);
	} catch (error) {
		handleFailure(res, 500, error);
	}
};
