'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable('employee_office',{
      role_id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
      },
      role:Sequelize.STRING
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('employee_office');
  }
};
