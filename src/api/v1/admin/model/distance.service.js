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

module.exports.getAllDistances = async () => {
	try {
		return await new Promise((res, rej) => {
			const sql = `SELECT * FROM city_distance;`;
			pool.query(sql, (err, results) => {
				if (err) return rej(err);
				res(results);
			});
		});
	} catch (err) {
		console.log(`${err.name}: ${err.message}`);
	}
};
