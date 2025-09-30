const {check} = require('express-validator');

const pc_sweep_fields = [
  check('name').notEmpty().withMessage('Prencha o nome completo do funcionário!').trim(),
  check('email').notEmpty().withMessage('Informe um email de login!').trim(),
 
  check('password')
  .notEmpty().withMessage('A senha não foi inserida').bail()
  .trim().bail()
  .isLength({min:8}).withMessage('Senha inválida ou muito curta'),

  check('re_password')
  .notEmpty().withMessage('As senhas não podem ser diferentes').bail()
  .isLength({min:8}).withMessage('Senha inválida ou muito curta').bail()
  .custom((value, {req} ) => {
    let {password,re_password} = req.body
      if(password !== re_password){
        throw new Error(`as senhas informados são diferentes`)
      }
      return true
  }),
]

module.exports = pc_sweep_fields;
