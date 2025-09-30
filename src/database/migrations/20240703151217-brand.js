'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('brand',{
      brand_id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
      },
      brand_name:Sequelize.STRING,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('brand');
  }
};
