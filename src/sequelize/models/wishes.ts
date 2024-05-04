import { Model,DataTypes } from "sequelize";
import sequelize from "../../config/dbConnection";
import User from "./users";

export interface wishAttributes {
  id?: number;
  userId: number;
  productId: number;
  createdAt?: Date;
  updatedAt?: Date;
}


  class Wishes extends Model<wishAttributes>  implements wishAttributes {
    id!: number | undefined;
    userId!: number;
    productId!: number;
    createdAt!: Date | undefined;
    updatedAt!: Date | undefined;
  }

  Wishes.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'wishes',
  });
  
  export default Wishes