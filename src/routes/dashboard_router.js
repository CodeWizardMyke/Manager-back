const express =  require('express');
const router = express.Router();

const jsonwebtoken = require('../middlewares/jsonwebtoken');
const dashboard_controller = require('../controllers/dashboard_controller');

router.get("/", jsonwebtoken, dashboard_controller.read );


module.exports = router;
