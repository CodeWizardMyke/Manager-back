const {check} = require('express-validator');

const category_swreep_fields = [
    check('category_name').notEmpty().trim().isString().withMessage('Nome da categoria não atende os requisitos necessários!')
]

module.exports = category_swreep_fields;
