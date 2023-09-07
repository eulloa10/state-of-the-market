'use strict';

import {
  Model, InferAttributes, InferCreationAttributes
} from 'sequelize';

module.exports = (sequelize: any, DataTypes: any) => {
  class Report extends Model<InferAttributes<Report>,InferCreationAttributes<Report>> {
    declare id: number;
    declare report_name: string;
    declare econ_indicator_1_id: number;
    declare econ_indicator_1_prior_id: number;
    declare econ_indicator_2_id: number;
    declare econ_indicator_2_prior_id: number;
    declare econ_indicator_3_id: number;
    declare econ_indicator_3_prior_id: number;
    declare econ_indicator_4_id: number;
    declare econ_indicator_4_prior_id: number;
    declare econ_indicator_5_id: number;
    declare econ_indicator_5_prior_id: number;
    declare econ_indicator_6_id: number;
    declare econ_indicator_6_prior_id: number;
    declare econ_indicator_7_id: number;
    declare econ_indicator_7_prior_id: number;
    declare econ_indicator_8_id: number;
    declare econ_indicator_8_prior_id: number;
    declare econ_indicator_9_id: number;
    declare econ_indicator_9_prior_id: number;
    declare econ_indicator_10_id: number;
    declare econ_indicator_10_prior_id: number;
    declare econ_indicator_11_id: number;
    declare econ_indicator_11_prior_id: number;

    static associate(models: any) {
      Report.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete:'cascade'
      })

      Report.hasMany(models.Indicator, {
        foreignKey: 'indicator_id'
      })
    }
  }
  Report.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      unique: true
    },
    report_name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    econ_indicator_1_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    econ_indicator_1_prior_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    econ_indicator_2_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    econ_indicator_2_prior_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    econ_indicator_3_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    econ_indicator_3_prior_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    econ_indicator_4_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    econ_indicator_4_prior_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    econ_indicator_5_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    econ_indicator_5_prior_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    econ_indicator_6_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    econ_indicator_6_prior_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    econ_indicator_7_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    econ_indicator_7_prior_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    econ_indicator_8_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    econ_indicator_8_prior_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    econ_indicator_9_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    econ_indicator_9_prior_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    econ_indicator_10_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    econ_indicator_10_prior_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    econ_indicator_11_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    econ_indicator_11_prior_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Report',
  });
  return Report;
};
