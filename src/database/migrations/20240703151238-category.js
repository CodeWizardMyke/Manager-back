'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('category',{
      category_id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
      },
      category_name:Sequelize.STRING,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('category');
  }
};
