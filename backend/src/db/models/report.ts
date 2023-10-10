'use strict';

import {
  Model, InferAttributes, InferCreationAttributes
} from 'sequelize';

module.exports = (sequelize: any, DataTypes: any) => {
  class Report extends Model<InferAttributes<Report>,InferCreationAttributes<Report>> {
    declare id: number;
    declare indicator_data_id: number;
    declare user_id: number;
    declare report_name: string;

    static associate(models: any) {
      Report.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'cascade'
      })

      Report.belongsTo(models.Indicator, {
        foreignKey: 'indicator_data_id',
        onDelete: 'cascade'
      })
    }
  }
  Report.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    indicator_data_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    report_name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Report',
  });
  return Report;
};
