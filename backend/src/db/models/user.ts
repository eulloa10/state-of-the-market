'use strict';

import {
  Model, InferAttributes, InferCreationAttributes
} from 'sequelize';

module.exports = (sequelize: any, DataTypes: any) => {

  class User extends Model<InferAttributes<User>,InferCreationAttributes<User>> {
    declare id:number;
    declare username:string;
    declare email:string;
    declare hashed_password: string;

    static associate(models: any) {
      User.hasMany(models.Report, {
        foreignKey: 'user_id'
      })
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique:true
    },
    hashed_password: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
