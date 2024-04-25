import request from "supertest";
import { beforeAll, afterAll, jest, test } from "@jest/globals";
import app from "../src/utils/server";
import User from "../src/sequelize/models/users";
import * as userServices from "../src/services/user.service";
import sequelize, { connect } from "../src/config/dbConnection";

const userData: any = {
	name: "yvanna",
	username: "testuser",
	email: "test1@gmail.com",
	password: "test1234",
};

const loginData: any = {
	email: "test1@gmail.com",
	password: "test1234",
};
describe("Testing a user Routes", () => {
	beforeAll(async () => {
		try {
			await connect();
			await User.destroy({ truncate: true });
		} catch (error) {
			sequelize.close();
		}
	}, 40000);

	afterAll(async () => {
		await User.destroy({ truncate: true });
		await sequelize.close();
	});
	describe("Testing user authentication", () => {
		test("should return 201 and create a new user when registering successfully", async () => {
			const response = await request(app)
				.post("/api/v1/users/register")
				.send(userData);
			expect(response.status).toBe(201);
		}, 40000);

		test("should return 409 when registering with an existing email", async () => {
			User.create(userData);
			const response = await request(app)
				.post("/api/v1/users/register")
				.send(userData);
			expect(response.status).toBe(409);
		}, 40000);

		test("should return 400 when registering with an invalid credential", async () => {
			const userData = {
				email: "test@mail.com",
				name: "",
				username: "existinguser",
			};
			const response = await request(app)
				.post("/api/v1/users/register")
				.send(userData);

			expect(response.status).toBe(400);
		}, 40000);
	});
});

test("should return all users in db --> given '/api/v1/users'", async () => {
	const spy = jest.spyOn(User, "findAll");
	const spy2 = jest.spyOn(userServices, "getAllUsers");
	const response = await request(app).get("/api/v1/users");
	expect(spy).toHaveBeenCalled();
	expect(spy2).toHaveBeenCalled();
}, 40000);
test("Should return status 401 to indicate Unauthorized user", async () => {
	const loggedInUser = {
		email: userData.email,
		password: "test",
	};
	const spyonOne = jest.spyOn(User, "findOne").mockResolvedValueOnce({
		//@ts-ignore
		email: userData.email,
		password: loginData.password,
	});
	const response = await request(app)
		.post("/api/v1/users/login")
		.send(loggedInUser);
	expect(response.body.status).toBe(401);
	spyonOne.mockRestore();
});
