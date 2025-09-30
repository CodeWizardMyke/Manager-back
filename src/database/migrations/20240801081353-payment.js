'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('payment', {
      payment_id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false,
        unique:true
      },
      fk_client_id:{
        type:Sequelize.INTEGER,
        references:{
          model:'client',
          key:'client_id'
        }
      },
      fk_cart_id:{
        type: Sequelize.INTEGER,
        references: {
          model: 'cart',
          key: 'cart_id'
        }
      },
      payment_method:{
        type:Sequelize.STRING,
        allowNull:false,
      },
      payment_status:{
        type:Sequelize.STRING,
        allowNull:false,
      },  
      createdAt:Sequelize.DATE,
      updatedAt:Sequelize.DATE,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('payment')
  }
};
