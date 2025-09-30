const express = require('express');
const router = express.Router();

const empoloyee_search_controller = require('../controllers/empoloyee_search_controller');
const jsonwebtoken = require('../middlewares/jsonwebtoken');

router.get('/id', jsonwebtoken, empoloyee_search_controller.getById);
router.get('/name', jsonwebtoken, empoloyee_search_controller.getByName);
router.get('/email', jsonwebtoken, empoloyee_search_controller.getByEmail);

module.exports = router;
