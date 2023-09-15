const mysql = require('mysql2');

const pool = mysql.createPool({
	//   host     : '38.153.39.203',
	//   user     : 'jmtwebs_car_management',
	//   password : '5kaiGBT5',
	//   database : 'jmtwebs_car_management',
	//   port	   : 3306

	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'root',
	database: 'cab_management',
});

pool.getConnection((err) => {
	if (err) {
		console.log('err--', err);
		//throw err;
	} else {
		console.log('Database connected successfully');
	}
});

/* const pool = mysql.createConnection({
	// host     : '38.153.39.203',
	// user     : 'jmtwebs_car_management',
	// password : '5kaiGBT5',
	// port: 3306,
	// database : 'jmtwebs_car_management',
	//multipleStatements : true,
	
	host     : 'localhost',
	port	 : 3306,
	user     : 'root',
	password : 'root',
	database : 'cab_management'
  });
   
  pool.connect((err) => {
	  if(err)console.log('errr--',err)
	  console.log('Connected to MySQL Server!');
  }); */

module.exports = pool;
