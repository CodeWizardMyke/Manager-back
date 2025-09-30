const express = require('express');
const router = express.Router();

const client_cart_controller = require('../controllers/client_cart_controller');

router.get('/client/:id', client_cart_controller.get_pending);

module.exports = router;
