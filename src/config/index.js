const local = {
	port: 8080,
	app: 'Node Express Boiler Plate Backend',
	// eslint-disable-next-line
	env: process.env.NODE_ENV,
	secret: 'KJBHUISH#*(YE*(#Y*(#HD*(#',
	s3AccessKey: 'AKIA23TEEHNYCUPLSFOT',
	s3SecretKey: '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',
	bucketPath: 'dev-node-aggregator-bucket',
	micro: {
		categoryUrl:
			'http://catalog-service-lb-745385173.ap-south-1.elb.amazonaws.com/v1/categories',
	},
};

const qa = {};

const prod = {};

module.exports =
	// eslint-disable-next-line
	process.env.NODE_ENV === 'qa'
		? qa
		: // eslint-disable-next-line
		process.env.NODE_ENV === 'prod'
		? prod
		: local;
