const { handleSuccess, handleFailure } = require('../../../../utils/helpers');
const BOOKING = require('../model/booking.service');

/**
 * @description This method related to add a new city distance
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.addbooking = async (req, res) => {
	try {
		const result = await BOOKING.addbooking(req.body);
		handleSuccess(res, result);
	} catch (error) {
		handleFailure(res, 500, error);
	}
};

/**
 * @description Get all fare details
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.getAllBooking = async (req, res) => {
	try {
		const response = await BOOKING.getAllBookingList();
		handleSuccess(res, response);
	} catch (error) {
		handleFailure(res, 500, error);
	}
};

/**
 * @description Get all fare details
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
exports.getSearhCab = async (req, res) => {
	const city_id = req.body.city_id;
	const master_package_id = req.body.master_package_id;
	const local_pkg_id = req.body.local_pkg_id;
	const seating_capacity =
		typeof req.body.seating_capacity != 'undefined'
			? Number(req.body.seating_capacity)
			: 0;
	const luggage =
		typeof req.body.luggage != 'undefined' ? Number(req.body.luggage) : 0;
	const pickup_date = req.body.pickup_date; // Pickup Date
	const pickup_time = req.body.pickup_time; // Pickup time
	const pickup_date_time = pickup_date + ' ' + pickup_time;

	const arrparam = {
		city_id: city_id,
		master_package_id: master_package_id,
		local_pkg_id: local_pkg_id,
		seating_capacity: seating_capacity,
		luggage: luggage,
	};

	const faredata = await getFareDataByCityIdPackageId(arrparam);
	handleSuccess(res, faredata);
};

/**
 * @description Get vehicle fare details
 * @param {object} req HttpRequest Object
 * @param {object} res HttpResponse Object
 */
const getFareDataByCityIdPackageId = async (arrobj) => {
	const cityid = arrobj.cityid;
	const master_package_id = arrobj.master_package_id;
	const seating_capacity = arrobj.seating_capacity;
	const luggage = arrobj.luggage;
	const masterpackagemodeid = arrobj.masterpackagemodeid;
	const local_pkg_id = arrobj.local_pkg_id;

	const getFareObj = {
		city_id: arrobj.city_id,
		master_package_id: arrobj.master_package_id,
		local_pkg_id: arrobj.local_pkg_id,
	};
	const faredata = await FARE.sp_fare_details(getFareObj);
	let min_pkg_km = '';
	let min_pkg_hrs = '';
	let ignore_hrs = '';
	let ignore_km = '';
	let minimumCharge = '';
	let distance = '';
	let totalbill = '';
	let local_pkg_fare_mode = '';
	let local_pkg_name = '';
	let duration = 0;
	let searchVehicleDetail = [];
	for (var i = 0; i < faredata.length; i++) {
		let base_vehicle_id = faredata[i].base_vehicle_id;
		let localpkgFare = await FARE.getPackageFareByPackageId(
			base_vehicle_id,
			local_pkg_id
		);
		let localpkgData = localpkgFare[0];
		if (typeof localpkgData !== 'undefined' && localpkgData != '') {
			min_pkg_km = localpkgData.km;
			min_pkg_hrs = localpkgData.hrs;
			totalbill = localpkgData.price;
			ignore_hrs = localpkgData.hrs;
			ignore_km = localpkgData.km;
			minimumCharge = totalbill;
			distance = localpkgData.km;
			local_pkg_fare_mode = localpkgData.package_mode_id;
			local_pkg_name = localpkgData.name;

			let base_comb_id = faredata[i].base_comb_id;
			let master_packge_mode_id = faredata[i].master_package_mode_id;
			let package_mode = faredata[i].package_mode;

			let city_name = faredata[i].city_name;
			let base_vehicle_id = faredata[i].base_vehicle_id;
			let vehicle_type_id = faredata[i].master_vehicle_type_id;
			let vehicle_category_id = faredata[i].vehicle_category_id;
			let vehicle_image = faredata[i].vehicle_image;
			let vehicle_type = faredata[i].vehicle_type;
			let vehicle_name = faredata[i].vehicle_name;
			let vehicle_model = faredata[i].vehicle_model;
			let vehicle_color = faredata[i].vehicle_color;
			let ignition_type = faredata[i].ignition_type;
			let vehicle_baggage = faredata[i].luggage;
			let seating_capacity = faredata[i].seating_capacity;
			let luggage = faredata[i].luggage;

			if (local_pkg_fare_mode != '') {
				master_packge_mode_id = local_pkg_fare_mode;
			}

			var param1 = {
				master_package_type: master_package_id,
				master_package_mode_id: master_packge_mode_id,
				base_vehicle_id: base_vehicle_id,
				minimumCharge: minimumCharge,
				ignore_hrs: ignore_hrs,
				ignore_km: ignore_km,
				distance: distance,
				duration: duration,
			};

			let getmodeFare = await FARE.getFareByPackagemodeId(
				master_packge_mode_id,
				base_vehicle_id
			);
			if (getmodeFare.length > 0) {
				getmodeFare = getmodeFare[0];
				vehicleFare = await FARE.getfareCalculation(param1, getmodeFare);
				totalbill = Math.round(totalbill);
				//console.log(val.minimum_charge); return false;

				vehicleFare.base_comb_id = base_comb_id;
				vehicleFare.city_name = city_name;
				vehicleFare.local_pkg_name = local_pkg_name;
				vehicleFare.vehicle_type_id = vehicle_type_id;
				vehicleFare.base_vehicle_id = base_vehicle_id;
				vehicleFare.vehicle_image = vehicle_image;
				vehicleFare.vehicle_type = vehicle_type;
				vehicleFare.vehicle_name = vehicle_name;
				vehicleFare.vehicle_model = vehicle_model;
				vehicleFare.vehicle_color = vehicle_color;
				vehicleFare.ignition_type = ignition_type;
				vehicleFare.base_fare = Number(vehicleFare.minimum_charge).toFixed(2); // base fare + markup //
				vehicleFare.per_km_price = Number(vehicleFare.per_km_charge).toFixed(2); // per km + markup //
				vehicleFare.totalbill = Number(vehicleFare.totalbill).toFixed(2);
			}
			searchVehicleDetail.push(vehicleFare);
		}
	}
	const resp = { status: 'success', data: searchVehicleDetail };
	return searchVehicleDetail;
};


exports.getBookingDetailById = async(req,res) => {
	try {
		console.log(req.params.id);
		const response = await BOOKING.getBookingById(req.params.id);
		handleSuccess(res, response);
	} catch (error) {
		handleFailure(res, 500, error);
	}
}
