'use strict';

module.exports = {
  async up (queryInterface,Sequelize) {
    queryInterface.createTable('employee',{
      employee_id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false,
        unique:true
      },
      name:{
        type:Sequelize.STRING,
        allowNull:false,
      },
      role:Sequelize.STRING,
      email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
      },
      password:{
        type:Sequelize.STRING,
        allowNull:false
      },
      createdAt:Sequelize.DATE,
      updatedAt:Sequelize.DATE,
    })
  },
  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('employee');
  }
};