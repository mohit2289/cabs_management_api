const pool = require('../../../../config/db');
const moment = require('moment');

module.exports.addCabCategory = async (data) => {
	try {
		return await new Promise((res, rej) => {
			const sql = `INSERT INTO master_vehicle_type 
        (vehicle_type, seating_capacity, seat_code, status, created_date, created_by) 
        VALUES (?, ?, ?, ?, ?, ?);`;

			const { category_name, seat_no, seat_code, status, added_date } = data;

			pool.query(
				sql,
				[category_name, seat_no, seat_code, status, added_date, 1],
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

module.exports.addCabs = async (data) => {
	try {
		data.created_date = moment(new Date()).format('yyyy-MM-DD hh:mm:ss');
		return await new Promise((res, rej) => {
			const sql = `INSERT INTO master_vehicle_model 
        (name, model_year, vehicle_type_id, person_capacity, luggage_capacity, amenities, status, created_date) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;

			const {
				cab_name,
				model_year,
				category_id,
				cab_seat,
				no_bags,
				amenities,
				status,
				created_date,
			} = data;

			pool.query(
				sql,
				[
					cab_name,
					model_year,
					category_id,
					cab_seat,
					no_bags,
					amenities.toString(),
					status,
					created_date,
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

module.exports.getAllCabs = async () => {
	try {
		return await new Promise((res, rej) => {
			const sql = `SELECT 
						cabs.id as cab_id,			
						cabs.name as cab_name,
						cabs.model_year, 
						cabs.person_capacity as cab_seat, 
						cabs.luggage_capacity as no_bags,
						cabs.amenities,
						cabs.status,
						cabs.vehicle_type_id as category_id,
						cab_category.vehicle_type as category_name 
						FROM master_vehicle_model as cabs left join master_vehicle_type as cab_category on cabs.vehicle_type_id = cab_category.id ;`;
			pool.query(sql, (err, results) => {
				if (err) return rej(err);
				res(results);
			});
		});
	} catch (err) {
		console.log(`${err.name}: ${err.message}`);
	}
};

module.exports.getAllCabCategories = async () => {
	try {
		return await new Promise((res, rej) => {
			const sql = `SELECT * FROM master_vehicle_type;`;
			pool.query(sql, (err, results) => {
				if (err) return rej(err);
				res(results);
			});
		});
	} catch (err) {
		console.log(`${err.name}: ${err.message}`);
	}
};

module.exports.getCabsByCategoryId = async (categoryId) => {
	try {
		return await new Promise((res, rej) => {
			const sql = `SELECT 
			cabs.id as cab_id,			
			cabs.name as cab_name,
			cabs.model_year, 
			cabs.person_capacity as cab_seat, 
			cabs.luggage_capacity as no_bags,
			cabs.amenities,
			cabs.status,
			cabs.vehicle_type_id as category_id,
			cab_category.vehicle_type as category_name 
			FROM master_vehicle_model as cabs 
			left join master_vehicle_type as cab_category on cabs.vehicle_type_id = cab_category.id  
			where cabs.vehicle_type_id = ?;`;
			pool.query(sql, [categoryId], (err, results) => {
				if (err) return rej(err);
				res(results);
			});
		});
	} catch (err) {
		console.log(`${err.name}: ${err.message}`);
	}
};
