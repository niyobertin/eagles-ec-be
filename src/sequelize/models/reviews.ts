import { Model, DataType, DataTypes } from "sequelize";
import sequelize from "../../config/dbConnection";

export interface reviewAttributes {
    id?: number,
    userId: number,
    productId: number,
    rating: number,
    feedback: string,
    createdAt?:Date,
    updatedAt?:Date 
}

class Review extends Model<reviewAttributes> implements reviewAttributes {
    id!: number;
    userId!: number;
    productId!: number;
    rating!: number;
    feedback!: string;
    createdAt?:Date;
    updatedAt?:Date 
}

Review.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "User",
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Product",
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    rating: {
        type: DataTypes.ENUM,
        values:["0", "1", "2", "3", "4", "5"],
        defaultValue: 0,
        allowNull: false
    },
    feedback: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
    }
    
},{
    sequelize,
    tableName: "reviews",
})

export default Review