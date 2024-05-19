import cron from "node-cron";
import Product from "../sequelize/models/products";
import User from "../sequelize/models/users";
import * as mailService from "../services/mail.service";
import { expiredProductTemplate } from "../email-templates/expired";
import Notification from "../sequelize/models/Notification";
import { disableProductVisisbility } from "../services/product.service";
import { notificationEmitter } from "../utils/server";

export const findExpiredProduct = () => {
  return cron.schedule("*/1 * * * *", async () => {
    try {
      const currentTime = Date.now();
      const products = await Product.findAll({
        where: { isAvailable: true },
        attributes: ["id", "userId", "name", "expiryDate"],
        include: [{ model: User, as: "user" }],
      });

      const expiredProducts = products.filter((product) => {
        const expiryDateTimestamp = new Date(product.expiryDate).getTime();
        return currentTime > expiryDateTimestamp;
      });

      if (expiredProducts.length === 0) {
        return;
      }

      const expiredProductInfo = expiredProducts.map(async (prod) => {
        const owner = await User.findOne({ where: { id: prod.userId } });

        const info = {
          id: prod.id,
          name: prod.name,
          userId: prod.userId,
          email: owner?.email,
        };

        return info;
      });

      const resolved = await Promise.all(expiredProductInfo);

      resolved.forEach(async (info) => {
        const notification = await Notification.create({
          title: "Product Expired",
          message: `Your product ${info.name} has expired`,
          userId: info?.userId,
        });

        //@ts-ignore
        await disableProductVisisbility(info.id);
        //@ts-ignore
        await mailService.sendNotification(info.email, "Product Expired", expiredProductTemplate(info));
        
        notificationEmitter.emit("expired", notification);
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  });
};
