import { DataTypes, Model } from "sequelize"
import sequelize from "../../config/dbConnection";

export interface INotification {
    id?: number,
    userId: number,
    title: string,
    message: string,
    isRead?: boolean,
    createdAt?: Date,
    updatedAt?: Date
}


class Notification extends Model<INotification> implements INotification{
    id?: number;
    userId!: number;
    title!: string;
    message!: string;
    isRead?: boolean;
    createdAt?: Date;
    updatedAt?: Date
}

Notification.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
    
    }
}, {
    sequelize: sequelize,
    tableName:"notifications"
})

export default Notification;