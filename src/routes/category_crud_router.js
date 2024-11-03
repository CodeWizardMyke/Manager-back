const express = require('express');
const router = express.Router();

const category_crud_controller = require('../controllers/category_crud_controller');
const category_swreep_fields = require('../functions/category_swreep_fields');
const category_check = require('../middlewares/category_check');
const jsonwebtoken = require('../middlewares/jsonwebtoken');

router.get('/', jsonwebtoken, category_crud_controller.read);
router.post('/', jsonwebtoken, category_swreep_fields, category_check, category_crud_controller.create)
router.put('/', jsonwebtoken, category_crud_controller.update);
router.delete('/', jsonwebtoken, category_crud_controller.delete);

router.get('/id', category_crud_controller.getById);

module.exports = router;
