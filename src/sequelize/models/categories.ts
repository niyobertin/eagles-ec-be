import { Model,DataTypes } from "sequelize";
import sequelize from "../../config/dbConnection";
import Product from "./products";

export interface CategoryAttributes{
 id?:number,
 name:string,
 description:string,
 image:string,
 createdAt:Date,
 updatedAt:Date
};

class Category extends Model<CategoryAttributes> implements CategoryAttributes{
    id?: number;
    name!: string;
    description!: string;
    image!: string;
    createdAt!: Date;
    updatedAt!: Date;
};

Category.init({
    id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.NUMBER
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    description:{
       type:DataTypes.STRING(10485760),
       allowNull:true,
    },
    image:{
        type:DataTypes.STRING(10485760),
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
},{
    sequelize:sequelize,
    modelName:"categories"
});
Category.hasMany(Product,{
    foreignKey: 'categoryID'
});
Product.belongsTo(Category,{
    foreignKey: 'categoryID'
});
export default Category;