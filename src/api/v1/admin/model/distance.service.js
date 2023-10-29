const pool = require('../../../../config/db');
const moment = require('moment');

module.exports.addDistance = async (data) => {
	try {		
		data.added_date = moment(new Date()).format('yyyy-MM-DD hh:mm:ss');
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
			const sql = `SELECT dist.from_city,city.name as from_city_name, dist.to_city, city2.name as to_city_name, dist.distance, dist.status FROM city_distance as dist left join master_city as city ON dist.from_city = city.id  left join master_city as city2 ON dist.to_city = city2.id  ;`;
			pool.query(sql, (err, results) => {
				if (err) return rej(err);
				res(results);
			});
		});
	} catch (err) {
		console.log(`${err.name}: ${err.message}`);
	}
};
