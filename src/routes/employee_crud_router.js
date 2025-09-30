const express = require('express');
const router = express.Router();

const employee_crud_controller = require('../controllers/employee_crud_controller');
const ec_sweep_fields = require('../functions/ec_sweep_fields');
const ec_check_fields = require('../middlewares/ec_check_fields');
const update_check_fields = require('../middlewares/update_check_fields');
const eu_pass_update = require('../middlewares/eu_pass_update');
const jsonwebtoken = require('../middlewares/jsonwebtoken');

router.post('/create', ec_sweep_fields, ec_check_fields, employee_crud_controller.createEmployee);
router.get('/read', jsonwebtoken, employee_crud_controller.readEmployee);
router.put('/update', jsonwebtoken, update_check_fields, eu_pass_update, employee_crud_controller.updateEmployee);
router.delete('/destroy', jsonwebtoken, employee_crud_controller.deleteEmployee);

module.exports = router;