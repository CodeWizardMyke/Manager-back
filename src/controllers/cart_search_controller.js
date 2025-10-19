const {Cart} = require('../database/models');

const paginateDefine = require('../functions/paginateDefine');

const cart_search_controller = {
  get_cart_client:  async (req, res) => {
    try {
      const {page, size} = paginateDefine(req);
      let {client_id,state} = req.headers;

      if(!client_id){
        return res.status(401).json({Error:{msg:"Nenhum id de cliente foi passado!"}})
      }

      const data = await Cart.findAndCountAll({
        where:{
          fk_client_id:client_id,
          state: state ? state : 'pendding'
        },
        limit: size,
        offset: size * (page - 1),
      })

      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error)  
    }
  },
  get_all_cart:  async (req, res) => {
    try {
      const {page, size} = paginateDefine(req);
      let {state} = req.headers;

      const data = await Cart.findAndCountAll({
        where:{
          state: state ? state : 'pendding' 
        },
        limit: size,
        offset: size * (page - 1),
      })

      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error)  
    }
  }, 
};

module.exports = cart_search_controller;