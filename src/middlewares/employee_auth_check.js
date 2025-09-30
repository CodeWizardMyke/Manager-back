const {Employee} = require('../database/models');
const bcrypt = require('bcrypt');

const employee_auth_check = async (req, res, next) => {
  const {email, password} = req.body;

  const data = await Employee.findOne({
    where: {
      email:email
    }
  });

  if(!data) return res.status(409).send({errors:[{path:'email', msg:'credenciais incorretas!'}]}); 

  const decoded = bcrypt.compareSync(password, data.password);
  if(!decoded) return res.status(409).send({errors:[{path:'email', msg:'credenciais incorretas!'}]});

  data.password = null;
  req.userAuthPass = data;

  return next();
};

module.exports = employee_auth_check;
