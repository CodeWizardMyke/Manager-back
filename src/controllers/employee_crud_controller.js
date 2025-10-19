const {Employee} = require('../database/models');
const paginateDefine = require('../functions/paginateDefine');

const employee_crud_controller = {
  createEmployee: async (req, res) => {
    try {
      const data = await Employee.create(req.body)
      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error)  
    }
  },
  readEmployee:  async (req, res) => {
    try {
      const {page, size} = paginateDefine(req);
      
      let data = await Employee.findAndCountAll({
        limit: size,
        offset: size * (page - 1), 
      })

      data.rows.map( item => { item.password = undefined })

      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error)  
    }
  },
  updateEmployee: async (req, res) => {
    try {
      const {employee_id} = req.headers;
      const data = await Employee.findByPk(employee_id);
      data.password = undefined
      await data.update(req.body);
      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error)  
    }
  },
  deleteEmployee: async (req, res) => {
    try {
      const {employee_id} = req.headers;
      const data = await Employee.findByPk(employee_id);
      await data.destroy();
      return res.json(`successfully deleted employee_id = ${data}`);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error)  
    } 
  }
};

module.exports = employee_crud_controller;