'use strict';

import {
  Model, InferAttributes, InferCreationAttributes
} from 'sequelize';

module.exports = (sequelize: any, DataTypes: any) => {
  class Indicator_Reference extends Model<InferAttributes<Indicator_Reference>, InferCreationAttributes<Indicator_Reference>> {
    declare id: number;
    declare series_id: string;
    declare full_name: string;
    declare abbr_name: string;
    declare description: string;

    static associate(models: any) {
      Indicator_Reference.hasMany(models.Indicator, {
        foreignKey: 'indicator_reference_id',
      })
    }
  }
  Indicator_Reference.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    series_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    abbr_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Indicator_Reference',
  });
  return Indicator_Reference;
};
