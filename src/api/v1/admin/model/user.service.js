const pool = require('../../../../config/db');

/**
 * @param {*} data
 * @returns
 */
module.exports.authentication = async (data) => {
	const { mobile, password } = data;
	try {
		return await new Promise((res, rej) => {
			pool.query(
				'Select * from users where mobile=? and password=?',
				[mobile, password],
				(err, results) => {
					if (err) return rej(err);
					res(results);
				}
			);
		});
	} catch (err) {
		console.log(`${err.name}: ${err.message}`);
	}
};
/**
 *
 * @returns
 */
module.exports.getUserData = async () => {
	try {
		return await new Promise((res, rej) => {
			pool.query('Select * from users', (err, results) => {
				if (err) return rej(err);
				res(results);
			});
		});
	} catch (err) {
		console.log(`${err.name}: ${err.message}`);
	}
};

/**
 *
 * @param {*} data
 * @returns
 */
module.exports.addDriver = async (data) => {
	try {
		return await new Promise((res, rej) => {
			const sql = `INSERT INTO driver 
        (   driver_name, 
			driver_mobile, 
			driver_email, 
			pincode, 
			state, 
			city, 
			locality, 
			address, 
			aadhar_number, 
			pan_number, 
			vehicle_category_id, 
			vehicle_id, 
			dl_number, 
			dl_expiry) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;
			pool.query(
				sql,
				[
					data.driver_name,
					data.driver_mobile,
					data.driver_email,
					data.pincode,
					data.state,
					data.city,
					data.locality,
					data.address,
					data.aadhar_number,
					data.pan_number,
					data.vehicle_category_id,
					data.vehicle_id,
					data.dl_number,
					data.dl_expiry,
				],
				(err, results) => {
					if (err) return rej(err);
					res(results);
				}
			);
		});
	} catch (err) {
		console.log(`${err.name}: ${err.message}`);
	}
};


module.exports.registration = async(data) => {
	try {
		return await new Promise((res, rej) => {
			const sql = `INSERT INTO users 
        	(username, 
			mobile,
			email, 
			password
			) VALUES (?,?,?,?);`;
			pool.query(
				sql,
				[
					data.username,
					data.mobile,
					data.email,
					data.password
				],
				(err, results) => {
					if (err) return rej(err);
					res(results);
				}
			);
		});
	} catch (err) {
		console.log(`${err.name}: ${err.message}`);
	}
}
