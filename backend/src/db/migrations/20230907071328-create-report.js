'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      report_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      econ_indicator_1_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      econ_indicator_1_prior_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      econ_indicator_2_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      econ_indicator_2_prior_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      econ_indicator_3_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      econ_indicator_3_prior_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      econ_indicator_4_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      econ_indicator_4_prior_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      econ_indicator_5_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      econ_indicator_5_prior_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      econ_indicator_6_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      econ_indicator_6_prior_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      econ_indicator_7_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      econ_indicator_7_prior_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      econ_indicator_8_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      econ_indicator_8_prior_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      econ_indicator_9_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      econ_indicator_9_prior_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      econ_indicator_10_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      econ_indicator_10_prior_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      econ_indicator_11_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      econ_indicator_11_prior_id: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Reports');
  }
};
