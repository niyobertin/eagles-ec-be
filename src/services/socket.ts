
import { ProductsAttributes } from "../sequelize/models/products"
import { UserAttributes } from "../sequelize/models/users"
import { io } from "../utils/server"
import * as mailService from "./mail.service"



export const notifySeller = async (seller:UserAttributes,subject:string,template:any,product:ProductsAttributes) => {
    try {
        // await mailService.sendNotification(seller.email, subject, template)

        io.emit("notification", {
            title: "Product Delted",
            message: `Your product ${product.name} was deleted successfully`,
            id: product.id,
            userId:seller.id
            
        })

        console.log("event emmited")
        
    } catch (error:any) {
        throw new Error(error.message)
    }
}
