'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('thumbnails', { 
      thumbnail_id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
      },
      path:Sequelize.TEXT,
      type:Sequelize.INTEGER,
      fk_product_id:{
        type:Sequelize.INTEGER,
        references:{
          model:'product',
          key:'product_id'
        }
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('thumbnails');
  }
};
