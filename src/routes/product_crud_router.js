const express = require('express');
const router = express.Router();

const product_crud_controller = require('../controllers/product_crud_controller');

const sweep_fields = require('../functions/pc_sweep_fields');

const check_fields = require('../middlewares/pc_check_fields');
const update_check_fields = require('../middlewares/update_check_fields');
const jsonwebtoken = require('../middlewares/jsonwebtoken');
const images_upload = require('../middlewares/images_upload');

router.post('/create', 
    images_upload.array('thumbnails',6),
    sweep_fields,
    check_fields,
    jsonwebtoken,
    product_crud_controller.create
);

router.get('/read', 
    jsonwebtoken,
    product_crud_controller.read
);

router.put('/update', 
    images_upload.array('thumbnails',6),
    jsonwebtoken,
    update_check_fields
    ,product_crud_controller.update
);

router.delete('/destroy', 
    jsonwebtoken,
    product_crud_controller.destroy
);

module.exports = router;