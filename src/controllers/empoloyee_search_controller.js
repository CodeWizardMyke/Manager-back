const {Employee} = require('../database/models');

const { Op } = require('sequelize');
const  paginateDefine = require('../functions/paginateDefine');

const empoloyee_search_controller = {
  getById: async (req, res) => {
    try {
      let {query} = req.headers;
      
      if(!query) query = req.decoded.employee_id;

      const data = await Employee.findByPk(query);
      return res.json(data);

    } catch (error) {
      return res.status(500).json(error);      
    }

  },
  getByName: async (req, res) => {
    try {
      const {size, page} = paginateDefine(req);
      
      const {query} = req.headers;
      if(!query) return res.status(401).json({error:{path:'title',msg:'Informe o nome do funcionário!'}});

      const data = await Employee.findAndCountAll({
        where:{ name:{[Op.like]: `%${query}%`} },
        limit: size,
        offset: size * (page - 1),
      })
      return res.json(data);

    } catch (error) {
      return res.status(500).json(error);      
    };
  },
  getByEmail: async (req, res) => {
    try {
      const {size, page} = paginateDefine(req);
      
      const {query} = req.headers;
      console.log(req.headers)
      if(!query) return res.status(401).json({error:{path:'email',msg:'Informe o email do funcionário!'}});

      const data = await Employee.findAndCountAll({
        where:{ email:{[Op.like]: `${query}%`} },
        limit: size,
        offset: size * (page - 1),
      })
      return res.json(data);

    } catch (error) {
      return res.status(500).json(error);      
    };    
  },
}

module.exports = empoloyee_search_controller;
