const express = require('express');
const router = express.Router();

const client_search_controller= require('../controllers/client_search_controller');

const jsonwebtoken = require('../middlewares/jsonwebtoken');

router.get('/', jsonwebtoken, client_search_controller.get_all );
router.get('/instagram', jsonwebtoken, client_search_controller.instagram );

module.exports = router;