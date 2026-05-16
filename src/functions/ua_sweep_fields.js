const {check} = require('express-validator');

const ua_sweep_fields = [
  check('email')
  .trim()
  .notEmpty()
  .withMessage('Endereço de email vazio!')
  .isEmail()
  .withMessage('Endereço de email inválido!'),
  check('password').notEmpty().withMessage('A senha não pode estar vazia').trim(),
]

module.exports = ua_sweep_fields;
