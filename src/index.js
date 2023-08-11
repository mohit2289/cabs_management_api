/**
 * @author Mohit Verma
 * @description this is a entry file has method to start listner.
 */
//const mongoose = require('./services/mongoose');
const app = require('./services/express');

// eslint-disable-next-line
process.on('uncaughtException', (err) => {
	// eslint-disable-next-line
	console.error('There was an uncaught error', err);
});

// start app and connect to database
app.start();

module.exports = app;
