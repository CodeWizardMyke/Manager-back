const {Employee} = require('../database/models');

require('dotenv').config();
const {validationResult} = require ('express-validator');
const bcrypt = require ('bcrypt');

const ec_check_fields = async (req, res, next )=> {
  const {email} = req.body;
  if(email){
    const data = await Employee.findOne({where: {email: email}})
    if(data) return res.status(400).json({errors: [{path:'email',msg: 'Email já esta registrado'}]})
  }

  let checkResult = validationResult(req);
  if (!checkResult.isEmpty()) {
    checkResult.errors.map( element => element.value = "")
    console.log(checkResult);
    return res.status(400).json(checkResult);
  }

  req.body.password = bcrypt.hashSync(req.body.password, 10)
  delete req.body.re_password;
  
  return next();
};

module.exports = ec_check_fields;
 