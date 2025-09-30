const express = require('express');
const router = express.Router();

const cart_item_crud_router = require('../controllers/cart_items_crud_controller');
const jsonwebtoken = require('../middlewares/jsonwebtoken');

router.post('/create',jsonwebtoken, cart_item_crud_router.create);
router.get('/read', jsonwebtoken, cart_item_crud_router.read);
router.put('/update',jsonwebtoken, cart_item_crud_router.update);
router.delete('/destroy', jsonwebtoken, cart_item_crud_router.delete);

module.exports = router;
