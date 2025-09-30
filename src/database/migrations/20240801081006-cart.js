'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('cart', {
      cart_id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
        unique:true
      },
      qtd_products:{
        type:Sequelize.INTEGER,
        allowNull:false
      },
      amount:{
        type:Sequelize.DECIMAL,
        allowNull:false
      },
      state:Sequelize.STRING,
      fk_client_id:{
        type:Sequelize.INTEGER,
        references:{
          model:'client',
          key:'client_id'
        }
      },
      createdAt:Sequelize.DATE,
      updatedAt:Sequelize.DATE,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('cart');
  }
};
