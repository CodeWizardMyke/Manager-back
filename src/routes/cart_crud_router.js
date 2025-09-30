const express = require('express');
const router = express.Router();

const cart_crud_controller = require('../controllers/cart_crud_controller');
const jsonwebtoken = require('../middlewares/jsonwebtoken');
const check_client_existis = require('../middlewares/check_client_existis');

router.post('/create',jsonwebtoken, check_client_existis, cart_crud_controller.create);
router.get('/read', jsonwebtoken, cart_crud_controller.read);
router.put('/update',jsonwebtoken, cart_crud_controller.update);
router.delete('/destroy', jsonwebtoken, cart_crud_controller.delete);

module.exports = router;
