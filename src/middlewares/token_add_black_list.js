const {Token_black_list} = require('../database/models')

const token_add_black_list = async (req, res , next) => {
  const baerer = req.headers.authorization;
  const token = baerer.split(' ')[1];

  const add_in_black_list = await Token_black_list.create({token: token})

  if(!add_in_black_list) return res.status(401).json({message:'erro ao fazer logout!'});

  return next();
};

module.exports = token_add_black_list;
