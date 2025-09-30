'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('product',{
      product_id:{
        type:Sequelize.INTEGER,
        autoIncrement: true ,
        primaryKey:true,
        allowNull:false,
        unique:true
      },
      title:{
        type:Sequelize.STRING,
        allowNull:false
      },
      official_store_name:Sequelize.STRING,
      discribe:Sequelize.TEXT,
      currency:Sequelize.STRING,
      product_cost:{
        type:Sequelize.DECIMAL,
        allowNull:false
      },
      selling_price:{
        type:Sequelize.DECIMAL,
        allowNull:false
      },
      profit_margin:{
        type:Sequelize.DECIMAL,
        allowNull:false
      },
      discounts:Sequelize.INTEGER,
      stock:{
        type:Sequelize.INTEGER,
        allowNull:false
      },
      use_thumbnail:Sequelize.STRING,
      product_state:Sequelize.STRING,
      use_movie:Sequelize.STRING,
      movie_url:Sequelize.STRING,
      GTIN:Sequelize.STRING,
      NET_VOLUM:{
        type:Sequelize.STRING,
        allowNull:false
      },
      NET_WEIGHT:Sequelize.STRING,
      winner_item_id:Sequelize.STRING,
      catalog_listing:Sequelize.STRING,
      additional:Sequelize.STRING,
      product_shape:Sequelize.STRING,
      isNewArrival:Sequelize.STRING,
      targetGender:Sequelize.STRING,
      age_group:Sequelize.STRING,
      fk_category_id:{
        type:Sequelize.INTEGER,
        references:{
          model:'category',
          key:'category_id'
        }
      },
      fk_brand_id:{
        type:Sequelize.INTEGER,
        references:{
          model:'brand',
          key:'brand_id'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    })
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('product');
  }
};
