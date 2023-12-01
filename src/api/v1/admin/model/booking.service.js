const pool = require('../../../../config/db');
const { generateBookingNo } = require('../../../../utils/helpers');
const moment = require('moment');

module.exports.addbooking = async (data) => {
	try {
		data.created_date = moment(new Date()).format('yyyy-MM-DD hh:mm:ss');
		data.date_from = moment(new Date()).format('yyyy-MM-DD hh:mm:ss');
		data.date_to = moment(new Date()).format('yyyy-MM-DD hh:mm:ss');
		data.created_by = data.created_by ? data.created_by : 1;
		data.user_id = data.user_id ? data.user_id : 1;

		const resp = await addNewBooking(data);
		data.booking_id = resp.insertId;
		const resp2 = await addBookingEstimation(data);
		//const resp3 = await addDistanceHourExtraCharges(data);
		return resp;
	} catch (err) {
		console.log(`${err.name}: ${err.message}`);
	}
};

module.exports.getAllBookingList = async (data) => {
	try {
		return await new Promise((res, rej) => {
			const sql = ` Select bk.*, vm.name as vehice_name, mp.name as booking_type
							FROM
							booking AS bk
							INNER JOIN
							booking_estimation AS bkest ON  bkest.booking_id = bk.booking_id
							LEFT join master_vehicle_model as vm ON bk.vehicle_master_id = vm.id
							LEFT JOIN master_package as mp ON bk.master_package_id = mp.id
							
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

module.exports.getBookingById = async (bookingid) => {
	try {
		return await new Promise((res, rej) => {
			const sql = ` Select bk.*, vm.name as vehice_name, mp.name as booking_type,bkest.*, lp.name as local_package_name,city.name as city_name
							FROM
							booking AS bk
							INNER JOIN
							booking_estimation AS bkest ON  bkest.booking_id = bk.booking_id
							LEFT join master_vehicle_model as vm ON bk.vehicle_master_id = vm.id
							LEFT JOIN master_package as mp ON bk.master_package_id = mp.id
							LEFT JOIN local_package as lp ON bk.package_id = lp.id
							LEFT JOIN master_city as city ON bk.pickup_city = city.id
							where bk.booking_id = ${bookingid}					
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

const addNewBooking = async (data) => {
	try {
		let yearmonth = moment(new Date()).format('YYMM');
		let generateBookingref = generateBookingNo();
		let bookingRef = `TK${generateBookingref}${yearmonth}`;
		data.booking_reference = bookingRef;
		data.booking_status = 1;
		data.booking_date = moment(new Date()).format('yyyy-MM-DD hh:mm:ss');
		data.created_date = moment(new Date()).format('yyyy-MM-DD hh:mm:ss');
		//data.created_by = data.created_by ? data.created_by : 1;
		return await new Promise((res, rej) => {
			const sql = `INSERT INTO booking 
        (
		user_id,
		booking_reference,
		booking_status,
		package_id,
		master_package_mode_id,
		master_package_id,
		master_vehicle_type_id,
		base_vehicle_id,
		vehicle_master_id,
		name, 
		mobile, 
		email, 
		passenger, 
		pickup_address,
		pickup_city, 		
		drop_address, 
		travel_date, 
		travel_time,
		created_date) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?);`;

			const {
				user_id,
				booking_reference,
				booking_status,
				package_id,
				master_package_mode_id,
				master_package_id,
				master_vehicle_type_id,
				base_vehicle_id,
				vehicle_master_id,
				name,
				mobile,
				email,
				passenger,
				pickup_address,
				pickup_city,
				drop_address,
				travel_date,
				travel_time,
				created_date,
			} = data;

			pool.query(
				sql,
				[
					user_id,
					booking_reference,
					booking_status,
					package_id,
					master_package_mode_id,
					master_package_id,
					master_vehicle_type_id,
					base_vehicle_id,
					vehicle_master_id,
					name,
					mobile,
					email,
					passenger,
					pickup_address,
					pickup_city,
					drop_address,
					travel_date,
					travel_time,
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

const addBookingEstimation = async (data) => {
	try {
		return await new Promise((res, rej) => {
			const sql = `INSERT INTO booking_estimation 
        (booking_id, estimated_time, estimated_distance, estimated_final_price,approx_after_km, approx_after_hour,approx_hour_charge,approx_distance_charge,minimum_charge,created_date) 
        VALUES (?, ?, ?, ?, ?, ?, ? ,? ,?, ?);`;

			const {
				booking_id,
				estimated_time,
				estimated_distance,
				estimated_final_price,
				approx_after_km,
				approx_after_hour,
				approx_hour_charge,
				approx_distance_charge,
				minimum_charge,
				created_date,
			} = data;

			pool.query(
				sql,
				[
					booking_id,
					estimated_time,
					estimated_distance,
					estimated_final_price,
					approx_after_km,
					approx_after_hour,
					approx_hour_charge,
					approx_distance_charge,
					minimum_charge,
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
