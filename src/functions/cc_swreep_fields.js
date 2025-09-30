const {check} = require('express-validator');

const cc_swreep_fields = [
  check('clientName').notEmpty().withMessage('Nome do cliente não informado').trim(),
  check('clientInstagram').notEmpty().withMessage('Informe o instagram do cliente').trim(),
]

module.exports = cc_swreep_fields;
