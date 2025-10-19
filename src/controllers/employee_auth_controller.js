require('dotenv').config();

const { Employee } = require('../database/models');
const jwt = require('jsonwebtoken');

const employee_auth_controller = {
  login: async (req, res) => {
    try {
      const {userAuthPass} = req;

      const token = jwt.sign({ employee_id:userAuthPass.employee_id }, process.env.JWT_TOKEN, /*{expiresIn:'0h'}*/ );;

      const userAuth = {
        token: token,
        user: userAuthPass
      };
      return res.json(userAuth);

    } catch (error) {
      console.log(error);
      return res.status(500).json(error)  
    }
  },
  logout: async (req, res) => {
    try {
      return res.json('logout realizado com sucesso!')
    } catch (error) {
      console.log(error);
      return res.status(500).json(error)
    }
  }
};

module.exports = employee_auth_controller;
