const {Employee} = require('../database/models');
const bcrypt = require('bcrypt');

const eu_pass_update = async (req, res, next) => {
  const {password, email} = req.body;

  if(password){
    const {re_password} = req.body;
    if(!re_password){
      return res.status(400).json({errors:[{path:'re_password',msg:"Digite novamente sua senha!"}]})
    }
    if(password !== re_password){
      return res.status(400).json({errors:[{path:'re_password',msg:"As devem ser iguais!"}]})
    }
    req.body.password =  bcrypt.hashSync(password, 10)
  };

  if(email){
    const emailExistis = await Employee.findOne({where:{email:email}})
    if(emailExistis){
      return res.status(400).json({errors:[{path:'email',msg:"Endereço de email já registrado!"}]})
    }
  }

  return next();
};

module.exports = eu_pass_update;