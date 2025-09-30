const express = require('express');
const router = express.Router();

const brand_crud_controller = require('../controllers/brand_crud_controller');
const brand_swreep_fields = require('../functions/brand_swreep_fields');
const brand_check = require('../middlewares/brand_check');
const jsonwebtoken = require('../middlewares/jsonwebtoken');

router.get('/', jsonwebtoken, brand_crud_controller.read);
router.post('/', brand_swreep_fields, brand_check, jsonwebtoken, brand_crud_controller.create)
router.put('/', jsonwebtoken, brand_crud_controller.update);
router.delete('/', jsonwebtoken, brand_crud_controller.delete);

router.get('/id', brand_crud_controller.getById);

module.exports = router;
