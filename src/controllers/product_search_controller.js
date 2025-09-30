const {Product} = require('../database/models');

const { Op } = require('sequelize');
const  paginateDefine = require('../functions/paginateDefine');

const product_search_controller = {
  getByTitle: async (req, res) => {
    try {
      const {size, page} = paginateDefine(req);
      
      const {title} = req.headers;
      if(!title) return res.status(401).json({error:{path:'title',msg:'Nenhum título foi recebido!'}});

      const data = await Product.findAndCountAll({
        where:{ title:{[Op.like]: `%${title}%`} },
        limit: size,
        offset: size * (page - 1),
      })
      return res.json(data);

    } catch (error) {
      return res.status(500).json(error);      
    };
  },
  getById: async (req, res) => {
    try {
      const {product_id} = req.headers;

      const data = await Product.findByPk(product_id);
      return res.json(data);

    } catch (error) {
      return res.status(500).json(error);      
    }

  },
  getByGTIN: async (req, res) => {
    try {
      const {size, page} = paginateDefine(req);
      
      const {gtin} = req.headers;
      console.log(req.headers)
      if(!gtin) return res.status(401).json({error:{path:'GTIN',msg:'Nenhuma refêrencia recebido!'}});

      const data = await Product.findAndCountAll({
        where:{ GTIN:{[Op.like]: `${gtin}%`} },
        limit: size,
        offset: size * (page - 1),
      })
      return res.json(data);

    } catch (error) {
      return res.status(500).json(error);      
    };    
  },
}

module.exports = product_search_controller;
