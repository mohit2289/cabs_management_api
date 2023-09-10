const pool = require('../../../../config/db');

module.exports.getAllStates = async () => {
	try {
		return await new Promise((res, rej) => {
			const sql = `SELECT * FROM master_state;`;
			pool.query(sql, (err, results) => {
				if (err) return rej(err);
				res(results);
			});
		});
	} catch (err) {
		console.log(`${err.name}: ${err.message}`);
	}
};
