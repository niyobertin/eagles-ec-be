import { CartAttributes } from "./sequelize/models/Cart";
import { IRole } from "./sequelize/models/roles";
export interface IUser {
  id?: number;
  name: string;
  username: string;
  email: string;
  password: string;
  roleId?: number;
  userRole?:IRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum SUBJECTS {
  REQUEST_2FA = "Request for 2FA",
  VERIFY_LOGIN = "Verify that It's you",
  DISABLE_2FA = "Disable 2-Factor Authentication",
  PAYMENT_CONFIRMATION = "Payment Confirmation"
}

export enum STATUS {
  PENDING = "Pending",
  SUCCESS = "Success",
  FAILED = "Failed",
}

export interface ProductType{
  id?:number,
  name:string,
  images:string[],
  stockQuantity:number,
  price:number,
  expiryDate:Date,
  discount:number,
  categoryID:number,
  userId:number,
  createdAt:Date,
  updatedAt:Date 
}

export interface CategoryType{
  id?:number,
  name:string,
  description:string,
  image:string,
  createdAt:Date,
  updatedAt:Date
  }

  export interface SearchQuery {
    name?: string;
    minPrice?: number;
    maxPrice?: number;
    category?: string;
    expirationDate?: Date;
  }


  export interface IInfo {
    id: number | undefined;
    name: string;
    userId: number;
    email: undefined;
    username: undefined;
  }
  export interface CartRequest extends Request {
    cart: CartAttributes;
  }
  export interface ReviewType  {
   userId : string;
   productId : number;
   reviewId: number;
   rating : number;
   feedback: string;
  }