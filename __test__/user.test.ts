import request from "supertest";
import { beforeAll, afterAll, jest, test } from "@jest/globals";
import app from "../src/utils/server";
import { testDbConnection, testSequelize } from "../src/config/testDbConfig";
import User from "../src/sequelize/models/users";
import * as userServices from "../src/services/user.service";

describe("Testing user Routes", () => {
  beforeAll(async () => {
    try {
      await testDbConnection();
    } catch (error) {
      testSequelize.close();
    }
  }, 20000);

  test("should return all users in db --> given '/api/v1/users'", async () => {
    const spy = jest.spyOn(User, "findAll");
    const spy2 = jest.spyOn(userServices, "getAllUsers");
    const response = await request(app).get("/api/v1/users");
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
  }, 20000);
});
