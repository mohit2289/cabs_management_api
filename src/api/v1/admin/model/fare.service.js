const pool = require('../../../../config/db');
const moment = require('moment');

module.exports.addFare = async (data) => {
	try {
		data.created_date = moment(new Date()).format('yyyy-MM-DD hh:mm:ss');
		data.date_from = moment(new Date()).format('yyyy-MM-DD hh:mm:ss');
		data.date_to = moment(new Date()).format('yyyy-MM-DD hh:mm:ss');
		data.created_by = data.created_by ? data.created_by : 1;

		const resp = await addCityPackageMode(data);
		const resp2 = await addLocalPackageBaseFare(data);
		const resp3 = await addDistanceHourExtraCharges(data);
		return resp3;
	} catch (err) {
		console.log(`${err.name}: ${err.message}`);
	}
};

const addCityPackageMode = async (data) => {
	try {
		return await new Promise((res, rej) => {
			const sql = `INSERT INTO city_package_mode 
        (city_id, master_package_id, master_package_mode_id, date_from,date_to, created_date,created_by, status) 
        VALUES (?, ?, ?, ?, ?, ? ,?,?);`;

			const {
				city_id,
				master_package_id,
				master_package_mode_id,
				date_from,
				date_to,
				created_date,
				created_by,
			} = data;

			pool.query(
				sql,
				[
					city_id,
					master_package_id,
					master_package_mode_id,
					date_from,
					date_to,
					created_date,
					created_by,
					'1',
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

const addLocalPackageBaseFare = async (data) => {
	try {
		return await new Promise((res, rej) => {
			const sql = `INSERT INTO local_package_fare 
        (base_vehicle_id, local_pkg_id, local_pkg_fare, created_date,created_by, status) 
        VALUES (?, ?, ?, ?, ?, ?);`;

			const {
				vehicle_model,
				local_package,
				local_pkg_fare,
				created_date,
				created_by,
			} = data;

			pool.query(
				sql,
				[
					vehicle_model,
					local_package,
					local_pkg_fare,
					created_date,
					created_by,
					'1',
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

const addDistanceHourExtraCharges = async (data) => {
	try {
		return await new Promise((res, rej) => {
			const sql = `INSERT INTO distance_hour_fare 
        (base_vehicle_id, per_km_charge, per_hr_charge, created_date,created_by, status) 
        VALUES (?, ?, ?, ?, ?, ?);`;

			const {
				vehicle_model,
				per_km_charge,
				per_hr_charge,
				created_date,
				created_by,
			} = data;

			pool.query(
				sql,
				[
					vehicle_model,
					per_km_charge,
					per_hr_charge,
					created_date,
					created_by,
					'1',
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

module.exports.getAllFareList = async (data) => {
	try {
		return await new Promise((res, rej) => {
			const sql = `SELECT
			bc.city_id,
			city.name as city_name,
			bc.id AS base_comb_id,
			bc.date_from,
			bc.date_to,
			bvt.base_vehicle_id,
			mpm.id AS master_package_mode_id,
			mpm.package_mode,
			mp.id AS master_package_id,
			mp.name AS package_name,
			mp.image,
			mvt.id AS master_vehicle_type_id,
			mvt.vehicle_type,
			vmodel.name  as vehicle_name,
			mvt.vehicle_image,
			mvt.seating_capacity,
			mvt.amenities,
			mvt.luggage,
			lpf.local_pkg_fare,
			dhf.per_km_charge,
			dhf.per_hr_charge
		  FROM
			city_package_mode AS bc
		  INNER JOIN
			base_vehicle_type AS bvt ON bc.id = bvt.base_comb_id 
		  INNER JOIN 
		   local_package_fare AS lpf ON bvt.base_vehicle_id = lpf.base_vehicle_id
		  INNER join 
		   local_package AS lp ON lpf.local_pkg_id = lp.id
		  LEFT JOIN
			master_package_mode AS mpm ON lp.booking_mode = mpm.id
		  LEFT JOIN
			master_package AS mp ON lp.id = mp.id 
		  LEFT JOIN
			master_vehicle_type AS mvt ON bvt.vehicle_type_id = mvt.id 
		  LEFT JOIN
		  master_vehicle_model as vmodel ON mvt.id =vmodel.vehicle_type_id
		  left join 
		  master_city as city ON bc.city_id = city.id 
		  left JOIN 
 		  distance_hour_fare AS dhf ON bvt.base_vehicle_id = dhf.base_vehicle_id
		  WHERE
			bc.status  = 1 
			 ;`;
			pool.query(sql, (err, results) => {
				if (err) return rej(err);
				res(results);
			});
		});
	} catch (err) {
		console.log(`${err.name}: ${err.message}`);
	}
};
