import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/dbConnection';
import Profile from './profiles';
import {Role} from './roles'; 
import Wishes from './wishes';
import Product from './products';
import Review from './reviews';

export interface UserAttributes {
  id?: number;
  name: string;
  username: string;
  email: string;
  password: string | undefined;
  roleId: number | undefined;
  isActive?:boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class User extends Model<UserAttributes> implements UserAttributes {
  id!: number | undefined;
  name!: string;
  username!: string;
  email!: string;
  password!: string;
  isActive: boolean | undefined;
  roleId!: number | undefined;
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
    password: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    roleId: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 1,
      references:{
        model: 'Roles',
        key: 'id'
      }
    },
    isActive:{
      type: DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:true
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
  // associations with users table
  
  User.belongsTo(Role, {
    foreignKey: 'roleId', 
    as: 'userRole'
  })
  Role.hasMany(User, {
    foreignKey: 'roleId', 
    as: 'users'
  })

  
  User.hasOne(Profile, {
    foreignKey: 'userId',
    as: 'profile'
  });
  
  Profile.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  User.hasMany(Wishes, {
    foreignKey: 'userId',
    as: 'user'
  });

  Wishes.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  })

  User.hasMany(Product,{
    foreignKey: 'categoryID'
});
Product.belongsTo(User,{
    foreignKey: 'categoryID'
});

User.hasMany(Review,  {
  foreignKey: "userId",
  as: "review"
})

Review.belongsTo(User,  {
  foreignKey: "userId",
  as: "user"
})

export default User;
