import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/dbConnection';
import Profile from './profiles';

export interface UserAttributes {
  id?: number;
  name: string;
  username: string;
  email: string;
  role?: string[];
  password: string | undefined;
  createdAt?: Date;
  updatedAt?: Date;
}

class User extends Model<UserAttributes> implements UserAttributes {
  id!: number | undefined;
  name!: string;
  username!: string;
  email!: string;
  role!: string[];
  password!: string;
  createdAt!: Date | undefined;
  updatedAt!: Date | undefined;
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
    role: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: ["buyer"],
    },
    password: {
      allowNull: true,
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
    sequelize,
    modelName: 'users',
  });
  
  User.hasOne(Profile, {
    foreignKey: 'userId',
    as: 'profile'
  });
  
  Profile.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });


export default User;
