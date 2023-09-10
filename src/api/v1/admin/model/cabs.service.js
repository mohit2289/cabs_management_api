const pool = require('../../../../config/db');

module.exports.addCabCategory = async (data) => {
	try {
		return await new Promise((res, rej) => {
			const sql = `INSERT INTO cab_category 
        (category_name, seat_no, seat_code, status, added_date) 
        VALUES (?, ?, ?, ?, ?);`;

			const { category_name, seat_no, seat_code, status, added_date } = data;

			pool.query(
				sql,
				[category_name, seat_no, seat_code, status, added_date],
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
		console.log(data);
		return await new Promise((res, rej) => {
			const sql = `INSERT INTO cabs 
        (cab_name, model_year, category_id, cab_seat, no_bags, amenities, status, added_date) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;

			const {
				cab_name,
				model_year,
				category_id,
				cab_seat,
				no_bags,
				amenities,
				status,
				added_date,
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
					added_date,
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
						cabs.cab_id,			
						cabs.cab_name,
						cabs.model_year, 
						cabs.cab_seat, 
						cabs.no_bags,
						cabs.amenities,
						cabs.status,
						cabs.category_id,
						cab_category.category_name 
						FROM cabs left join cab_category on cabs.category_id = cab_category.category_id ;`;
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
			const sql = `SELECT * FROM cab_category;`;
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
			const sql = `SELECT cabs.cab_id, cabs.cab_name,
						cabs.model_year, 
						cabs.cab_seat, 
						cabs.no_bags,
						cabs.amenities,
						cabs.status,
						cabs.category_id,
						cab_category.category_name 
						FROM cabs left join cab_category on cabs.category_id = cab_category.category_id  where cabs.category_id = ?;`;
			pool.query(sql, [categoryId], (err, results) => {
				if (err) return rej(err);
				res(results);
			});
		});
	} catch (err) {
		console.log(`${err.name}: ${err.message}`);
	}
};
