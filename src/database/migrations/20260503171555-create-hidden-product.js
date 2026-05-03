'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('hidden_product', {

      hidden_product_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      fk_employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: 'employee',
          key: 'employee_id'
        },

        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      fk_product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: 'product',
          key: 'product_id'
        },

        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      expires_at: {
        type: Sequelize.DATE,
        allowNull: true
      },

      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }

    });

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable('hidden_product');

  }

};