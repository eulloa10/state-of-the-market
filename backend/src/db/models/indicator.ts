'use strict';

import {
  Model, InferAttributes, InferCreationAttributes
} from 'sequelize';

module.exports = (sequelize: any, DataTypes: any) => {
  class Indicator extends Model<InferAttributes<Indicator>, InferCreationAttributes<Indicator>> {
    declare id:number;
    declare indicator_reference_id: number;
    declare indicator_value: number;
    declare indicator_date: string;
    declare indicator_period: string;

    static associate(models: any) {
      Indicator.hasMany(models.Report, {
        foreignKey: 'indicator_data_id'
      })

      Indicator.belongsTo(models.Indicator_Reference, {
        foreignKey: 'indicator_reference_id',
        onDelete: 'cascade'
      })
    }
  }
  Indicator.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    indicator_reference_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    indicator_value: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    indicator_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    indicator_period: {
      type: DataTypes.STRING,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Indicator',
  });

  return Indicator;
};
