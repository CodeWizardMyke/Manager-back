const {check} = require('express-validator');

const brand_swreep_fields = [
    check('brand_name').notEmpty().trim().isString().withMessage('Nome da marca não atende os requisitos necessários!')
]

module.exports = brand_swreep_fields;
