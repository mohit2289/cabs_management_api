const pool = require('../../../../config/db');

module.exports.addDistance = async (data) => {
	try {
		return await new Promise((res, rej) => {
			const sql = `INSERT INTO city_distance 
        (from_city, to_city, distance, status, added_date) 
        VALUES (?, ?, ?, ?, ?);`;

			const { from_city, to_city, distance, status, added_date } = data;

			pool.query(
				sql,
				[from_city, to_city, distance, status, added_date],
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

module.exports.getLocalPackage = async () => {
	try {
		return await new Promise((res, rej) => {
			const sql = `SELECT lp.id,mpm.id as package_mode_id,mpm.package_mode,lp.name,lp.hrs,lp.km,lp.status FROM local_package as lp join master_package_mode as mpm ON lp.booking_mode = mpm.id where lp.status =1 ;`;
			pool.query(sql, (err, results) => {
				if (err) return rej(err);
				res(results);
			});
		});
	} catch (err) {
		console.log(`${err.name}: ${err.message}`);
	}
};
