'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn(
      'client',
      'owner_employee_id',
      {
        type: Sequelize.INTEGER,
        allowNull: true,

        references: {
          model: 'employee',
          key: 'employee_id'
        },

        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    );

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeColumn(
      'client',
      'owner_employee_id'
    );
  }
};