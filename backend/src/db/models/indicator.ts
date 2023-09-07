'use strict';

import {
  Model, InferAttributes, InferCreationAttributes
} from 'sequelize';

module.exports = (sequelize: any, DataTypes: any) => {
  class Indicator extends Model<InferAttributes<Indicator>, InferCreationAttributes<Indicator>> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    declare id:number;
    declare indicator_value: number;
    declare indicator_date: string;

    static associate(models: any) {
      Indicator.belongsTo(models.Report, {
        foreignKey: 'indicator_id',
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
    indicator_value: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    indicator_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Indicator',
  });
  return Indicator;
};
