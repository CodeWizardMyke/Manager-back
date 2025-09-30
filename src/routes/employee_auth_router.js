const express = require('express');
const router = express.Router();

const employee_auth_controller = require('../controllers/employee_auth_controller');

const ua_sweep_fields = require('../functions/ua_sweep_fields');

const ua_check_fields = require('../middlewares/ua_check_fields');
const employee_auth_check = require('../middlewares/employee_auth_check');
const token_add_black_list = require('../middlewares/token_add_black_list');
const jsonwebtoken = require('../middlewares/jsonwebtoken');

router.post('/login', ua_sweep_fields, ua_check_fields, employee_auth_check, employee_auth_controller.login);
router.post('/logout', jsonwebtoken, token_add_black_list, employee_auth_controller.logout);

module.exports = router;
