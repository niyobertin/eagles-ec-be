import { Request, Response } from "express";
import Notification from "../sequelize/models/Notification";
import { UserAttributes } from "../sequelize/models/users";
import eventEmmiter from "../events/emmiter";

export const getUserNotifications = async (req: Request, res: Response) => {
  //@ts-ignore
  const currentUser: UserAttributes = req.user;
  try {
    const userNotifications = await Notification.findAll({ where: { userId: currentUser.id } });

    return res.status(200).json({
      message: "user notification",
      notifications: userNotifications,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const readNotification = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const currentNotification = await Notification.findByPk(id);
    if (!currentNotification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    } else {
      await Notification.update({ isRead: true }, { where: { id: id } });
      return res.status(200).json({
        message: "Notification read successfully",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};
