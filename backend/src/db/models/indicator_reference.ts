'use strict';

import {
  Model, InferAttributes, InferCreationAttributes
} from 'sequelize';

module.exports = (sequelize: any, DataTypes: any) => {
  class Indicator_Reference extends Model<InferAttributes<Indicator_Reference>, InferCreationAttributes<Indicator_Reference>> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    declare id: number;
    declare indicator_series_id: string;
    declare indicator_full_name: string;
    declare indicator_abbr_name: string;
    declare indicator_description: string;

    static associate(models: any) {
      Indicator_Reference.belongsTo(models.Indicator, {
        foreignKey: 'indicator_reference_id',
        onDelete: 'cascade'
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
    indicator_series_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    indicator_full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    indicator_abbr_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    indicator_description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Indicator_Reference',
  });
  return Indicator_Reference;
};
