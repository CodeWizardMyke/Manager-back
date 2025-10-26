const {Product, Brand, Thumbnails, Category} = require('../database/models');

const { Op } = require('sequelize');
const  paginateDefine = require('../functions/paginateDefine');

const product_search_controller = {
  getByTitle: async (req, res) => {
    try {
      const {size, page} = paginateDefine(req);
      
      const {query} = req.headers;
      let   title = query.toString().trim();
      if(!title) return res.status(401).json({error:{path:'title',msg:'Nenhum título foi recebido!'}});

      const data = await Product.findAndCountAll({
        where:{ title:{[Op.like]: `%${title}%`} },
        limit: size,
        offset: size * (page - 1),
        include:[
          {model:Brand, as:'brandProduct'},
          {model:Category , as:'categoryProduct'},
          {model:Thumbnails, as: 'thumbnails', require:false},
      ],
      })
      return res.json(data);

    } catch (error) {
      return res.status(500).json(error);      
    };
  },
  getById: async (req, res) => {
    try {
      const {product_id} = req.headers;

      const data = await Product.findOne({
        where:{ product_id: product_id },
        include:[
          {model:Brand, as:'brandProduct'},
                    {model:Category , as:'categoryProduct'},
                    {model:Thumbnails, as: 'thumbnails', require:false},
      ]
      });

      return res.json(data);
    } catch (error) {
      return res.status(500).json(error);      
    }

  },
  getByGTIN: async (req, res) => {
    try {
      const {size, page} = paginateDefine(req);
      
      const {gtin} = req.headers;
      if(!gtin) return res.status(401).json({error:{path:'GTIN',msg:'Nenhuma refêrencia recebido!'}});

      const data = await Product.findAndCountAll({
        where:{ GTIN:{[Op.like]: `${gtin}%`} },
        limit: size,
        offset: size * (page - 1),
        include:[
          {model:Brand, as:'brandProduct'},
          {model:Category , as:'categoryProduct'},
          {model:Thumbnails, as: 'thumbnails', require:false},
      ]
      })
      return res.json(data);

    } catch (error) {
      return res.status(500).json(error);      
    };    
  },
}

module.exports = product_search_controller;
