import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/dbConnection";

export interface UserAttributes {
  id?: number;
  name: string;
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class UserTest extends Model<UserAttributes> implements UserAttributes {
  id!: number | undefined;
  name!: string;
  username!: string;
  email!: string;
  password!: string;
  createdAt!: Date | undefined;
  updatedAt!: Date | undefined; // Corrected typo here
}

UserTest.init(
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
    modelName: "usersTests",
  },
);

export default UserTest;
