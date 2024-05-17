import { Model,DataTypes } from "sequelize";
import sequelize from "../../config/dbConnection";
import Wishes from "./wishes";
import Review from "./reviews";

export interface ProductsAttributes{
  id?:number,
  name:string,
  images:string[],
  stockQuantity:number,
  price:number,
  discount:number,
  categoryID:number,
  userId:number,
  isAvailable?: boolean,
  expiryDate:Date,
  createdAt?:Date,
  updatedAt?:Date 
}

class Product extends Model<ProductsAttributes> implements ProductsAttributes{
    id?: number;
    name!: string;
    images!: string[];
    stockQuantity!: number;
    price!: number;
    expiryDate!: Date;
    discount!: number;
    categoryID!: number;
    isAvailable: boolean | undefined;
    userId!: number;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}

Product.init({
    id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    images:{
        type:DataTypes.ARRAY(DataTypes.STRING(10485760)),
        allowNull: false,
    },
    stockQuantity:{
      allowNull: false,
      type: DataTypes.INTEGER, 
    },
    price:{
        allowNull: false,
        type: DataTypes.FLOAT,
    },
    discount:{
        allowNull: false,
        type: DataTypes.FLOAT,   
    },
    categoryID:{
        type:DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:"Category",
            key:"id"
        }
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:"User",
            key:"id"
        }
    },
    isAvailable:{
        type:DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    expiryDate:{
      allowNull: false,
      type: DataTypes.DATE,
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
    sequelize:sequelize,
    modelName:"products",
});

Product.hasMany(Wishes, {
    foreignKey: 'productId', 
    as: 'product'
  })
  
  Wishes.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product'
  });
Product.hasMany(Review, {
    foreignKey: 'productId', 
    as: 'review'
  })
  
Review.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product'
  });


export default Product;

