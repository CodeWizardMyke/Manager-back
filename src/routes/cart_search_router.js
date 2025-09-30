const express = require('express');
const router = express.Router();

const cart_search_controller = require('../controllers/cart_search_controller');
const jsonwebtoken = require('../middlewares/jsonwebtoken');

router.get('/',  cart_search_controller.get_all_cart);
router.get('/client',  cart_search_controller.get_cart_client);

module.exports = router;
