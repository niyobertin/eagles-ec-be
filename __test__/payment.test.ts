import request from "supertest";
import { beforeAll, afterAll, test } from "@jest/globals";
import app from "../src/utils/server";
import Product from "../src/sequelize/models/products";
import Category from "../src/sequelize/models/categories";
import sequelize, { connect } from "../src/config/dbConnection";
import User from "../src/sequelize/models/users";
import bcrypt from "bcryptjs";
import { Role } from "../src/sequelize/models/roles";
import { dummy } from "./prod";
import * as userServive from "../src/services/user.service"

let buyerToken: any;
let adminToken: any;
let sellerToken: any;


jest.mock("../src/services/mail.service", () => ({
  sendEmailService: jest.fn(),
  sendNotification: jest.fn(),
}));


describe("test stripe api payment", () => {
  beforeAll(async () => {
    try {
      await connect();

      const testAdmin = {
        name: "admin123",
        username: "admin123",
        isVerified:true,
        email: "admin1@example.com",
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
    } catch (error: any) { }
  }, 40000);

  afterAll(async () => {
    await Role.destroy({ where: {}, truncate: true, cascade: true });
    await Product.destroy({ where: {}, truncate: true, cascade: true });
    await Category.destroy({ where: {}, truncate: true, cascade: true });
    await sequelize.close();
  });

  test("should authorize users", async () => {
    const response = await request(app).post("/api/v1/users/login").send({
      email: "buyer1@example.com",
      password: "password",
    });
    buyerToken = response.body.token

    const adminResponse = await request(app).post("/api/v1/users/login").send({
      email: "admin1@example.com",
      password: "password",
    });
    adminToken = adminResponse.body.token;

    const sellerResponse = await request(app).post("/api/v1/users/login").send({
      email: "seller123@example.com",
      password: "password",
    });

    const seller = await userServive.getUserByEmail("seller123@example.com");
    sellerToken = sellerResponse.body.token;

    let sellerId = seller?.id;

    await request(app)
      .patch(`/api/v1/users/${sellerId}/role`)
      .send({
        roleId: 2,
      })
      .set("Authorization", "Bearer " + adminToken);

    expect(response.status).toBe(200);
    expect(adminResponse.status).toBe(200);
    expect(sellerResponse.status).toBe(200);
  })


  it("should return 400 when a user try to checkout with no cart", async () => {
    const response = await request(app).post("/api/v1/payment/checkout")
      .set("Authorization", `Bearer ${buyerToken}`)

    expect(response.status).toBe(400);
  });

  test("should return 201 when an item is added to the cart", async () => {
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

  test("should create a checkout session", async () => {
    const response = await request(app).post("/api/v1/payment/checkout")
      .set("Authorization", `Bearer ${buyerToken}`);
    expect(response.body.message).toBe("payment session created!");
  })

  test("should return 403 when user is not a buyer", async () => {
    const response = await request(app).post("/api/v1/payment/checkout")
      .set("Authorization", `Bearer ${sellerToken}`);
      expect(response.status).toBe(403);
  })

  test('should handle failure callback', async () => {
    const response = await request(app)
      .get('/api/v1/payment/canceled')
      .send();
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Your payment has failed!" });
  });

})