'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Indicator_References', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      indicator_series_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      indicator_full_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      indicator_abbr_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      indicator_description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Indicator_References');
  }
};
