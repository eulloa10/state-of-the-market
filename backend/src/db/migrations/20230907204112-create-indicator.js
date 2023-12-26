'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Indicators', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      indicator_reference_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      indicator_value: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      indicator_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      indicator_period: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addConstraint('Indicators', {
      type: 'unique',
      name: 'indicatorValueDateCompositeKey',
      fields: ['indicator_reference_id', 'indicator_date', 'indicator_period'],
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Indicators', 'indicatorValueDateCompositeKey');
    await queryInterface.dropTable('Indicators');
  }
};
