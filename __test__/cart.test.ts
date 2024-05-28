import request from "supertest";
import { beforeAll, afterAll, jest, test } from "@jest/globals";
import app from "../src/utils/server";
import Product from "../src/sequelize/models/products";
import Category from "../src/sequelize/models/categories";
import sequelize, { connect } from "../src/config/dbConnection";
import User from "../src/sequelize/models/users";
import bcrypt from "bcrypt";
import { Role } from "../src/sequelize/models/roles";
import { dummy } from "./prod";
import * as userServices from "../src/services/user.service"
import { number } from "joi";

jest.mock("../src/services/mail.service", () => ({
  sendEmailService: jest.fn(),
  sendNotification: jest.fn(),
}));

const queryInterface = sequelize.getQueryInterface();

let sellerToken: any;
let buyerToken: any;
let adminToken: any;
let sellerId: number;
let productId: number;
let categoryId: number;

describe("testing cart", () => {
  beforeAll(async () => {
    try {
      await connect();
      const testAdmin = {
        name: "admin123",
        username: "admin123",
        email: "admin1@example.com",
        isVerified:true,
        password: await bcrypt.hash("password", 10),
        roleId: 3,
      };

      const testBuyer = {
        name: "buyer123",
        username: "buyer123",
        isVerified:true,
        email: "buyer1@example.com",
        password: await bcrypt.hash("password", 10),
      };
      const testSeller = {
        name: "seller123",
        username: "seller123",
        isVerified:true,
        email: "seller123@example.com",
        password: await bcrypt.hash("password", 10),
      };

      await Product.destroy({ where: {}, truncate: true, cascade: true });
      await Role.destroy({ where: {}, truncate: true, cascade: true });
      const resetId = await sequelize.query('ALTER SEQUENCE "Roles_id_seq" RESTART WITH 1');
      await sequelize.query('ALTER SEQUENCE "users_id_seq" RESTART WITH 1');

      await Role.bulkCreate([{ name: "buyer" }, { name: "seller" }, { name: "admin" }]);
      //@ts-ignore
      const response = await Product.bulkCreate(dummy);

      await User.create(testAdmin);
      await User.create(testBuyer);
      await User.create(testSeller);
    } catch (error: any) {}
  }, 40000);

  afterAll(async () => {
    await Role.destroy({ where: {}, truncate: true, cascade: true });
    await Product.destroy({ where: {}, truncate: true, cascade: true });
    await Category.destroy({ where: {}, truncate: true, cascade: true });
    await sequelize.close();
  });

  test("should handle auth first", async () => {
    const res = await request(app).post("/api/v1/users/login").send({
      email: "admin1@example.com",
      password: "password",
    });
    adminToken = res.body.token;

    const res2 = await request(app).post("/api/v1/users/login").send({
      email: "buyer1@example.com",
      password: "password",
    });

    buyerToken = res2.body.token;
    const res3 = await request(app).post("/api/v1/users/login").send({
      email: "seller123@example.com",
      password: "password",
    });

    // console.log("response 3--->", res3);

    sellerToken = res3.body.token;
    const seller = await userServices.getUserByEmail("seller123@example.com");
     const sellerId = seller?.id;

    await request(app)
      .patch(`/api/v1/users/${sellerId}/role`)
      .send({
        roleId: 2,
      })
      .set("Authorization", "Bearer " + adminToken);

    expect(res.status).toBe(200);
    expect(res2.status).toBe(200);
    expect(res3.status).toBe(200);
  }, 20000);

  test("should create user cart if he doesn't have one", async () => {
    const response = await request(app).get("/api/v1/carts").set("Authorization", `Bearer ${buyerToken}`);
    expect(response.status).toBe(201);
  });

  test("should return user cart if he has one", async () => {
    const response = await request(app).get("/api/v1/carts").set("Authorization", `Bearer ${buyerToken}`);
    expect(response.status).toBe(200);
  });

  test("Buyer should be able to add an item to the cart", async () => {
    const response = await request(app)
      .post("/api/v1/carts")
      .send({
        productId: 2,
        quantity: 1,
      })
      .set("Authorization", `Bearer ${buyerToken}`);
    await request(app)
      .post("/api/v1/carts")
      .send({
        productId: 3,
        quantity: 1,
      })
      .set("Authorization", `Bearer ${buyerToken}`);
    expect(response.status).toBe(201);
  });

  test("Seller cannot add their own item to the cart", async () => {
    const response = await request(app)
      .post("/api/v1/carts")
      .send({
        productId: 2,
        quantity: 1,
      })
      .set("Authorization", "Bearer " + sellerToken);
    expect(response.status).toBe(403);
  });

  test("Buyer cannot add items with qty grt than actual product stock", async () => {
    const response = await request(app)
      .post("/api/v1/carts")
      .send({
        productId: 2,
        quantity: 500,
      })
      .set("Authorization", "Bearer " + buyerToken);
    expect(response.status).toBe(400);
  });

  test("Buyer should be able to update the quantity of items in the cart", async () => {
    const response = await request(app)
      .patch("/api/v1/carts")
      .send({
        productId: 2,
        quantity: 5,
      })
      .set("Authorization", "Bearer " + buyerToken);
    expect(response.status).toBe(200);
  });

  test("Buyer can't update product that is not is not in his cart", async () => {
    const response = await request(app)
      .patch("/api/v1/carts")
      .send({
        productId: 8,
        quantity: 2,
      })
      .set("Authorization", "Bearer " + buyerToken);
    expect(response.status).toBe(404);
  });

  test("Buyer should be able to remove an item from the cart", async () => {
    const response = await request(app)
      .put("/api/v1/carts")
      .send({
        productId: 2,
      })
      .set("Authorization", "Bearer " + buyerToken);
    expect(response.status).toBe(200);
  });

  test("should return 404 if buyer try to remove product that is not in his cart", async () => {
    const response = await request(app)
      .put("/api/v1/carts")
      .send({
        productId: 4,
      })
      .set("Authorization", "Bearer " + buyerToken);
    expect(response.status).toBe(404);
  });

  test("Buyer should be able to clear their entire cart", async () => {
    const response = await request(app)
      .delete("/api/v1/carts")
      .set("Authorization", "Bearer " + buyerToken);
    expect(response.status).toBe(200);
  });

  test("should return 404 if buyser try to clear cart that has no items inside", async () => {
    const response = await request(app)
      .delete("/api/v1/carts")
      .set("Authorization", "Bearer " + buyerToken);
    expect(response.status).toBe(404);
  });

  test("should return 401 is user is not logged in", async () => {
    const response = await request(app).get("/api/v1/carts");
    expect(response.status).toBe(401);
  });
});
