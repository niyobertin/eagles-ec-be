import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/dbConnection";

export interface TokenAttributes {
  token: number;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Token extends Model<TokenAttributes> implements TokenAttributes {
  public token!: number;
  public userId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Token.init(
  {
    token: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    modelName: "Token",
  },
);

export default Token;
