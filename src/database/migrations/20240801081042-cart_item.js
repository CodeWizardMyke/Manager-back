'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable('cart_item', {
      cart_item_id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false,
        unique:true
      },
      fk_cart_id:{
        type:Sequelize.INTEGER,
        references:{
          model:'cart',
          key:'cart_id'
        }
      },
      fk_product_id:{
        type:Sequelize.INTEGER,
        references:{
          model:'product',
          key:'product_id'
        }
      },
      qtd_products:{
        type:Sequelize.INTEGER,
        allowNull:false
      }
    })

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('cart_item')
  }
};
