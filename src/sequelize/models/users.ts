import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/dbConnection";

export interface UserAttributes {
  id?: number;
  name: string;
  username: string;
  email: string;
  isMerchant?: boolean;
  twoFAEnabled?: boolean;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class User extends Model<UserAttributes> implements UserAttributes {
  id!: number | undefined;
  name!: string;
  username!: string;
  email!: string;
  twoFAEnabled!: boolean;
  isMerchant!: boolean;
  password!: string;
  createdAt!: Date | undefined;
  updatedAt1: Date | undefined;
}

User.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.NUMBER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    isMerchant: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    twoFAEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: sequelize,
    modelName: "users",
  },
);

export default User;
