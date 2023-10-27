const pool = require('../../../../config/db');
const {generateBookingNo} =  require('../../../../utils/helpers');
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

const addNewBooking = async (data) => {
	try {
		let yearmonth = moment(new Date()).format('YYMM');
		let generateBookingref = generateBookingNo();
		let bookingRef = `TK${generateBookingref}${yearmonth}`;
		data.booking_reference = bookingRef;
		data.booking_status = 1;
		data.created_date = moment(new Date()).format('yyyy-MM-DD hh:mm:ss');
		//data.created_by = data.created_by ? data.created_by : 1;
		return await new Promise((res, rej) => {
		
		const sql = `INSERT INTO booking 
        (
		user_id,
		booking_reference,
		booking_status,
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
		drop_address, 
		travel_date, 
		travel_time,
		created_date) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

			const {
				user_id,
				booking_reference,
				booking_status,
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
				drop_address, 
				travel_date, 
				travel_time,
				created_date
			} = data;

			pool.query(
				sql,
				[
					user_id,
					booking_reference,
					booking_status,
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
					drop_address, 
					travel_date, 
					travel_time,
					created_date
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
				created_date
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
					created_date
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

module.exports.sp_fare_details = async(data) => {
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
		  	bc.city_id  = ${data.city_id} 
			AND bc.master_package_mode_id = ${data.master_package_id} 
			AND lpf.local_pkg_id =  ${data.local_pkg_id}
			and bc.status  = 1 
			 ;`;
			pool.query(sql, (err, results) => {
				if (err) return rej(err);
				res(results);
			});
		});
	} catch (err) {
		console.log(`${err.name}: ${err.message}`);
	}
}

module.exports.getPackageFareByPackageId = async(base_vehicle_id,local_pkg_id) =>{
	try {
		return await new Promise((res, rej) => {
			const sql = `select lp.id AS local_pkg_id, 
			mpm.id AS package_mode_id, 
			mpm.package_mode, 
			lpf.local_pkg_fare AS price, 
			lpf.local_pkg_fare_id AS local_package_id, 
			lp.name, lp.hrs, lp.km 
			from local_package as lp 
			Left join local_package_fare as lpf ON lp.id = lpf.local_pkg_id 
			LEFT JOIN master_package_mode AS mpm ON lp.booking_mode = mpm.id
			LEFT JOIN base_vehicle_type AS bvt ON lpf.base_vehicle_id = bvt.base_vehicle_id 
			LEFT JOIN city_package_mode As bc ON bvt.base_comb_id = bc.id 
			where lpf.base_vehicle_id= ${base_vehicle_id}
			AND  lpf.local_pkg_id = ${local_pkg_id} 
			AND lp.status=1
			 ;`;
			pool.query(sql, (err, results) => {
				if (err) return rej(err);
				res(results);
			});
		});
	}catch (err) {
		console.log(`${err.name}: ${err.message}`);
	}
}

module.exports.getfareCalculation = async(param, fareData) => {
	return new Promise((resolve, reject) => {
		var datam1 = {};
		var permntavr = 40 / 60;
		var markupPrice = 0;             // This markup price will be calculate on base fare//
		var markupData = param.markupData;
		var distance = param.distance;
		var duration = param.duration;
		var packagemodeid = param.master_package_mode_id;
		let status = param.status;
		let ignore_hrs = param.ignore_hrs;
		let ignore_km = param.ignore_km;
		let minimumCharge = param.minimumCharge;
		let master_package_type = param.master_package_type;
		var total_days = param.total_days;

		
		if (packagemodeid == 1) {
			ignore_hrs = 0;
			ignore_km = (typeof fareData.minimum_distance !== 'undefined') ? fareData.minimum_distance : 0;
			minimumCharge = (typeof fareData.minimum_charge !== 'undefined') ? fareData.minimum_charge : 0;
		} else if (packagemodeid == 2) {
			ignore_hrs = (typeof fareData.minimum_hrs !== 'undefined') ? fareData.minimum_hrs : 0;
			ignore_km = 0;
			minimumCharge = (typeof fareData.minimum_charge !== 'undefined') ? fareData.minimum_charge : 0;
		} else if (packagemodeid == 3) {
			ignore_hrs = (typeof fareData.minimum_hrs !== 'undefined') ? fareData.minimum_hrs : 0;
			ignore_km = (typeof fareData.minimum_distance !== 'undefined') ? fareData.minimum_distance : 0;
			minimumCharge = (typeof fareData.minimum_charge !== 'undefined') ? fareData.minimum_charge : 0;
		} else if (packagemodeid == 4) {
			ignore_hrs = 0;
			ignore_km = (typeof fareData.minimum_distance !== 'undefined') ? fareData.minimum_distance : 0;
			minimumCharge = (typeof fareData.minimum_charge !== 'undefined') ? fareData.minimum_charge : 0;
		}
		

		if (master_package_type == "4") {
			ignore_km = ignore_km * total_days;
			minimumCharge = minimumCharge * total_days;
		}


		if (packagemodeid == 1) {
			let distance = distance;       // This will come from local package //
			let travel_hrs = ignore_hrs;

			if (distance > ignore_km) {
				let ExtraKM = distance - ignore_km;
				let ExtraFare = ExtraKM * ((typeof fareData.per_km_charge !== 'undefined') ? fareData.per_km_charge : 0);
				let EstimatedPrice = Number(ExtraFare) + Number(minimumCharge);
			} else {
				let EstimatedPrice = minimumCharge;
			}

			datam1.per_km_charge = (typeof fareData.per_km_charge) ? fareData.per_km_charge : 0;
			datam1.min_distance = ignore_km;
			datam1.minimum_charge = minimumCharge;

		} else if (packagemodeid == 2) {      // Hourly mode Fare Calculation //
			let totalmint = parseInt(duration);
			let ignore_hrs = ignore_hrs;
			let ignore_km = 0;
			let minimumCharge = minimumCharge;//(typeof fareData.minimum_charge !== 'undefined') ? fareData.minimum_charge : 0;

			let ignore_first_hours = ignore_hrs * 60; //die;
			if (totalmint > ignore_hrs) {
				let hourlyRate = (totalmint - ignore_hrs)*60;

				let rate_per_min = ((typeof fareData.per_hr_charge) ? fareData.per_hr_charge : 0) / 60;
				let EstimatedPrice = hourlyRate * rate_per_min;

			} else {
				let EstimatedPrice = minimumCharge;
			}
			//// In Case per Hourly Charge 120 Rs and If car is running 40 Km Per hrs then per km charge is 120/40 is 3 Rs per Km Charge
			let EstimatedPrice =  Number(EstimatedPrice) + Number(minimumCharge);

			datam1.per_km_charge = 0;
			datam1.per_hr_charge = (typeof fareData.per_hr_charge !== 'undefined') ? fareData.per_hr_charge : 0;
			datam1.min_hour = ignore_hrs;
			datam1.min_distance = ignore_km;//ignore_hrs * 40;
			datam1.minimum_charge = minimumCharge;

		} else if (packagemodeid == 3) {        // Distance + hour Mode

			ignore_hrs = ignore_hrs; //(typeof fareData.minimum_hrs !== 'undefined') ? fareData.minimum_hrs : 0;
			ignore_km = ignore_km;//(typeof fareData.minimum_distance !== 'undefined') ? fareData.minimum_distance : 0;
			minimumCharge = minimumCharge;//(typeof fareData.minimum_charge !== 'undefined') ? fareData.minimum_charge : 0;
			let travel_hrs = parseInt(duration);        //come from travell distance hour//
			let hourlyRate= 0;
			let distanceRate = 0;
			if (distance < ignore_km) {
				distanceRate = 0;
			} else {
				distanceRate = (distance - ignore_km) * ((typeof fareData.per_km_charge !== 'undefined') ? fareData.per_km_charge : 0);
			}
			if (travel_hrs < ignore_hrs) {
				hourlyRate = 0;
			} else {
				hourlyRate = (travel_hrs - ignore_hrs)*60;
				let rate_per_min = ((typeof fareData.per_hr_charge) ? fareData.per_hr_charge : 0) / 60;
				hourlyRate = hourlyRate * rate_per_min;
			}

			var EstimatedPrice = Number(distanceRate) + Number(hourlyRate) + Number(minimumCharge);

			datam1.min_distance = ignore_km;
			datam1.minimum_charge = minimumCharge;
			datam1.per_km_charge = (typeof fareData.per_km_charge !== 'undefined') ? fareData.per_km_charge : 0;
			datam1.per_hr_charge = (typeof fareData.per_hr_charge !== 'undefined') ? fareData.per_hr_charge : 0;
			//console.log(datam1);

		} else if (packagemodeid == 4) {        //Distance + Waiting //
			//console.log(distance); //return false;
			let ignore_hrs = 0;
			let ignore_km = ignore_km;//(typeof fareData.minimum_distance) ? fareData.minimum_distance : 0;
			let minimumCharge = minimumCharge;//(typeof fareData.minimum_charge) ? fareData.minimum_charge : 0;
			//console.log(minimumCharge);return false;
			let EstimatedPrice;
			if (distance > ignore_km) {
				let ExtraKM = Number(distance) - Number(ignore_km);
				let ExtraFare = ExtraKM * ((typeof fareData.per_km_charge !== 'undefined') ? fareData.per_km_charge : 0);
				EstimatedPrice = Number(ExtraFare) + Number(minimumCharge);
			} else {
				EstimatedPrice = minimumCharge;
			}

			datam1.per_km_charge = (typeof fareData.per_km_charge !== 'undefined') ? fareData.per_km_charge : 0;
			datam1.per_hr_charge = (typeof fareData.per_hr_charge !== 'undefined') ? fareData.per_hr_charge : 0;
			datam1.min_distance = ignore_km;
			datam1.minimum_charge = minimumCharge;
			//console.log(datam1);return false;
		}
		//console.log(EstimatedPrice);
		datam1.totalbill = EstimatedPrice;
		datam1.min_pkg_hrs = ignore_hrs;
		datam1.min_pkg_km = ignore_km;

		//console.log(datam1);
		resolve(datam1);
	});
}

module.exports.getFareByPackagemodeId = async(pkgmodeid, basevehicleid) =>{
	let packagemodeid = pkgmodeid;
	let sqlquery='';
	if(packagemodeid==1){
		sqlquery = `SELECT * FROM distance_fare WHERE base_vehicle_id=${basevehicleid};`
	}else if(packagemodeid == 2 ){
		sqlquery = `SELECT * FROM hourly_fare WHERE base_vehicle_id=${basevehicleid};`
	}
	else if(packagemodeid == 3 ){
		sqlquery = `SELECT * FROM distance_hour_fare WHERE base_vehicle_id=${basevehicleid};`
	}
	else if(packagemodeid == 4 ){
		sqlquery = `SELECT * FROM distance_waiting_fare WHERE base_vehicle_id=${basevehicleid};`
	}

	try {
		return await new Promise((res, rej) => {			
			pool.query(sqlquery, (err, results) => {
				if (err) return rej(err);
				res(results);
			});
		});
	}catch (err) {
		console.log(`${err.name}: ${err.message}`);
	}
	
}
