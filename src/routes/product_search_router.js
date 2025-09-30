const express = require('express');
const router = express.Router();

const product_search_controller = require('../controllers/product_search_controller');
const jsonwebtoken = require('../middlewares/jsonwebtoken');

router.get('/title', jsonwebtoken, product_search_controller.getByTitle);
router.get('/product_id', jsonwebtoken, product_search_controller.getById);
router.get('/GTIN', jsonwebtoken, product_search_controller.getByGTIN);

module.exports = router;
