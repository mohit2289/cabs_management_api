/**
 * @author Mohit Verma
 * @description this file has to configure all route files with health check router
 */
const express = require('express');
const router = express.Router();
const authRouter = require('./auth.route');
const configRoute = require('./config.route');
const userRoute = require('./user.route');

const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router.get('/health', async (req, res) => {
	res.send({ status: 'OK', data: [] });
}); // admin status

// mount paths

router.use('/auth', authRouter);

router.use('/config', configRoute);
router.use('/user', userRoute);
module.exports = router;
