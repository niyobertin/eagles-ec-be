import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/dbConnection";
import Product, { ProductsAttributes } from "./products";


export interface CartItemAttributes {
  id?: number;
  cartId: number | undefined;
  productId: number | undefined;
  quantity: number;
  product?: ProductsAttributes;
}

class CartItem extends Model<CartItemAttributes> implements CartItemAttributes {
  id!: number | undefined;
  cartId!: number;
  productId!: number;
  quantity!: number;
  product?: ProductsAttributes;
}

CartItem.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.NUMBER,
    },
    cartId: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    productId: {
      allowNull: false,
      type: DataTypes.NUMBER,
      references: {
        model: Product,
        key: "id",
      },
    },
    quantity: {
      allowNull: false,
      type: DataTypes.NUMBER,
      defaultValue: 1,
    },
  },
  {
    sequelize: sequelize,
    modelName: "cartItems",
  },
);

CartItem.belongsTo(Product, { foreignKey: "productId", as: "product" });


export default CartItem;
