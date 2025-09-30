'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('token_black_list', { 
      id:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false,
        unique:true,
        autoIncrement:true,
      },
      token: {
        allowNull:false,
        type:Sequelize.TEXT,
      },
      updatedAt: Sequelize.DATE,
      createdAt: Sequelize.DATE
    });
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.dropTable('token_black_list');
  }
};
