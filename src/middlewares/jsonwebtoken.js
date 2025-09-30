const { Token_black_list } = require('../database/models');

require('dotenv').config()
const jwt = require('jsonwebtoken');

const jsonwebtoken = async (req, res, next) => {
  const baerer = req.headers.authorization;

  if(!baerer){
    return res.status(401).json({msg:"Obtenha o token para realizar esssa ação!"})
  }

  const token = baerer.split(' ')[1];
  
  if(!baerer || !token) return res.status(401).json({errors: [{path:'token',msg:'token inválido!'}] });

  const black_list = await Token_black_list.findOne({
    where:{ token: token }
  })
  if(black_list) return res.status(401).json({errors: [{path:'token',msg:'token negado!'}] });

  jwt.verify(token, process.env.JWT_TOKEN, (error, decoded) => {
    if(error) return res.status(401).json({errors: [{path:'token',msg:'algum Error com token ocorreu!'}] } );
    
    req.token_decoded = decoded;
    return next();
  });
};

module.exports = jsonwebtoken;