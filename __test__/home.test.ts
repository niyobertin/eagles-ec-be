import request from "supertest";
import { beforeAll, afterAll, jest, test } from "@jest/globals";
import app from "../src/utils/server";
import sequelize, { connect } from "../src/config/dbConnection";

describe("Testing Home route", () => {
  beforeAll(async () => {
    try {
      await connect();
    } catch (error) {
      sequelize.close();
    }
  }, 40000);

  test("servr should return status code of 200 --> given'/'", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
  }, 40000);
});
