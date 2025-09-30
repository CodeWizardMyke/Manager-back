'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('client',{
      client_id:{
        primaryKey:true,
        autoIncrement:true,
        unique:true,
        type:Sequelize.INTEGER
      },
      clientName:Sequelize.STRING,
      clientInstagram:{
        type:Sequelize.STRING,
        unique:true,
        allowNull:false
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('client');
  }
};
