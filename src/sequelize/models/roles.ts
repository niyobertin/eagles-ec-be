import {  DataTypes, Model } from 'sequelize';
import sequelize from "../../config/dbConnection";
import dotenv from 'dotenv';
dotenv.config();

export interface IRole {
  id?: number;
  name: string;
  permissions?: string;
}



class Role extends Model {
  public id!: number;
  public name!: string;
  public permissions?: string;
}

Role.init({
  id: {
    type: DataTypes.NUMBER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    unique: true,
    type: new DataTypes.STRING(128),
    allowNull: false,
  },
  
}, {
  tableName: 'Roles',
  sequelize: sequelize,
});

export { Role };