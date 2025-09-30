const {check} = require('express-validator');

const ua_sweep_fields = [
  check('email').notEmpty().withMessage('Insira o email de login do funcionário!').trim(),
  check('password').notEmpty().withMessage('Insira a senha do funcionário').trim(),
]

module.exports = ua_sweep_fields;
