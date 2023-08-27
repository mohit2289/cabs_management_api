const pool = require('../../../../config/db');

module.exports.addAirBusRail = async (data) => {
	try {
		return await new Promise((res, rej) => {
			const sql = `INSERT INTO air_rail_bus_stands 
        (type, state, city, stand_name, stand_address, status, added_date) 
        VALUES (?, ?, ?, ?, ?, ?, ?);`;

			const {
				type,
				state,
				city,
				stand_name,
				stand_address,
				status,
				added_date,
			} = data;
			console.log(data);
			pool.query(
				sql,
				[type, state, city, stand_name, stand_address, status, added_date],
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

module.exports.getAllAirBusRail = async () => {
	try {
		return await new Promise((res, rej) => {
			const sql = `SELECT * FROM air_rail_bus_stands;`;
			pool.query(sql, (err, results) => {
				if (err) return rej(err);
				res(results);
			});
		});
	} catch (err) {
		console.log(`${err.name}: ${err.message}`);
	}
};

// add addCity and getAllCities after you add city table
