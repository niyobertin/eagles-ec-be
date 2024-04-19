import request from "supertest";
import { beforeAll, afterAll, jest, test } from "@jest/globals";
import app from "../src/utils/server";
import User from "../src/sequelize/models/user";
import * as userServices from "../src/services/user.service";
import sequelize, { connect } from "../src/config/dbConnection";
import {env}  from "../src/utils/env";

describe("Testing user Routes", () => {
  beforeAll(async () => {
    try {
      await connect();
    } catch (error) {
      sequelize.close();
    }
  }, 20000);

  test("should return all users in db --> given '/api/v1/users'", async () => {
    const spy = jest.spyOn(User, "findAll");
    const spy2 = jest.spyOn(userServices, "getAllUsers");
    const response = await request(app).get("/api/v1/users");
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  }, 20000);

  test("Should return status 200 to indicate that user logged in ",async() =>{
    const loggedInUser ={
      email:env.email,
      password:env.test_password,
    };
    const spyonOne = jest.spyOn(User,"findOne").mockResolvedValueOnce({
      //@ts-ignore
      email:env.email,
      password:env.hashed_password,
    });
    const  response = await request(app).post("/api/v1/users/login")
    .send(loggedInUser)
    expect(response.status).toBe(200);
    spyonOne.mockRestore();
  })
  test("Should return status 401 to indicate Unauthorized user",async() =>{
    const loggedInUser ={
      email:env.email,
      password:env.test_incorrect_password,
    };
    const spyonOne = jest.spyOn(User,"findOne").mockResolvedValueOnce({
      //@ts-ignore
      email:env.email,
      password:env.hashed_password,
    });
    const  response = await request(app).post("/api/v1/users/login")
    .send(loggedInUser)
    expect(response.status).toBe(401);
    spyonOne.mockRestore();
  });
});
