import { Model,DataTypes } from "sequelize";
import sequelize from "../../config/dbConnection";
import User from "./users";

export interface MessagesAttributes{
    id?:number,
    sender:string,
    userId:number,
    message:string,
    createdAt?:Date,
    updatedAt?:Date 
}

class Message extends Model<MessagesAttributes> implements MessagesAttributes{
    id?:number;
    sender!:string;
    userId!: number;
    message!:string;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}
Message.init({
    id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    sender:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:"User",
            key:"id"
        } 
    },
    message:{
        type: DataTypes.STRING,
        allowNull: false,
    },
},{
    sequelize:sequelize,
    modelName:"messages"
});
User.hasMany(Message,{
    foreignKey: 'userId'
})
Message.belongsTo(User,{ 
    foreignKey: 'userId' 
})
export default Message;