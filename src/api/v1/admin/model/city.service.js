const pool = require('../../../../config/db');
const moment = require('moment');

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

module.exports.getCityByStateId = async (id) => {
	try {
		return await new Promise((res, rej) => {
			const sql = `SELECT id,name,state_id FROM master_city where state_id= ? ;`;
			pool.query(sql, [id], (err, results) => {
				if (err) return rej(err);
				res(results);
			});
		});
	} catch (err) {
		console.log(`${err.name}: ${err.message}`);
	}
};

module.exports.addCity = async (postData) => {
	try {
		return await new Promise((res, rej) => {
			const sql = `INSERT INTO master_city 
        (name, state_id) 
        VALUES (?, ?);`;
			const { name, state_id } = postData;
			pool.query(sql, [name, state_id], (err, results) => {
				if (err) return rej(err);
				console.log(results);
				res(results);
			});
		});
	} catch (err) {
		console.log(`${err.name}: ${err.message}`);
	}
};

module.exports.getAllCity = async () => {
	try {
		return await new Promise((res, rej) => {
			const sql = `SELECT master_city.id,master_city.name,master_city.state_id,master_state.name as state_name FROM master_city left join master_state on master_city.state_id=master_state.id  ;`;
			pool.query(sql, (err, results) => {
				if (err) return rej(err);
				res(results);
			});
		});
	} catch (err) {
		console.log(`${err.name}: ${err.message}`);
	}
};

module.exports.addCityDistance = async (postData) => {
	try {
		postData.added_date = moment(new Date()).format('yyyy-MM-DD hh:mm:ss');
		return await new Promise((res, rej) => {
			const sql = `INSERT INTO city_distance 
        (from_city, to_city,distance,status,added_date) 
        VALUES (?, ?, ?, ?, ?);`;
			const { from_city, to_city, distance, status, added_date } = postData;

			pool.query(
				sql,
				[from_city, to_city, distance, status, added_date],
				(err, results) => {
					if (err) return rej(err);
					console.log(results);
					res(results);
				}
			);
		});
	} catch (err) {
		console.log(`${err.name}: ${err.message}`);
	}
};
