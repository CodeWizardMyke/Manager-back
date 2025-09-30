const express = require('express');
const router = express.Router();

const client_crud_controller = require('../controllers/client_crud_cronteller');


const jsonwebtoken = require('../middlewares/jsonwebtoken');

router.post('/create', client_crud_controller.create);
router.get('/read', client_crud_controller.read);
router.put('/update', client_crud_controller.update);
router.delete('/destroy', jsonwebtoken, client_crud_controller.delete);

module.exports = router;