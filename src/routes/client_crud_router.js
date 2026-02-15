const express = require('express');
const router = express.Router();

const client_crud_controller = require('../controllers/client_crud_cronteller');


const jsonwebtoken = require('../middlewares/jsonwebtoken');
const clientCheckFields = require('../functions/clientCheckFields');
const clientFilterFields = require('../middlewares/clientFilterFields');

router.post('/create',jsonwebtoken, clientCheckFields.clientCreate, clientFilterFields, client_crud_controller.create);
router.get('/read',jsonwebtoken, client_crud_controller.read);
router.put('/update',jsonwebtoken, client_crud_controller.update);
router.delete('/destroy', jsonwebtoken, client_crud_controller.delete);

module.exports = router;