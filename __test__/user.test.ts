import request from "supertest";
import { beforeAll, beforeEach, afterEach, afterAll, test } from "@jest/globals";
import app from "../src/utils/server";
import User from "../src/sequelize/models/users";
import * as userServices from "../src/services/user.service";
import * as mailServices from "../src/services/mail.service";
import sequelize, { connect } from "../src/config/dbConnection";
// import * as twoFAService from "../src/utils/2fa";
import { profile } from "console";

const userData: any = {
  name: "yvanna5",
  username: "testuser5",
  email: "test15@gmail.com",
  password: "test12345",
};

const dummySeller = {
  name: "dummy1234",
  username: "username1234",
  email: "soleilcyber00@gmail.com",
  password: "1234567890",
  role: "seller",
};
const userTestData = {
  newPassword: "Test@123",
  confirmPassword: "Test@123",
  wrongPassword: "Test456",
};

const loginData: any = {
  email: "test1@gmail.com",
  password: "test1234",
};
 
const updateData:any = { 
  // @ts-ignore
  userId: userData.id,
  profileImage: "",
  fullName: "Patrick alex", 
  email: userData.email,
  gender: "", 
  birthdate: "", 
  preferredLanguage: "", 
  preferredCurrency: "", 
  street: "",
  city: "",
  state: "",
  postalCode:"",
  country: "Rwanda",
 }

describe("Testing user Routes", () => {
  beforeAll(async () => {
    try {
      await connect();
      await sequelize.query('TRUNCATE TABLE profiles, users CASCADE');
      const dummy = await request(app).post("/api/v1/users/register").send(dummySeller);
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  }, 40000);


  let token:any;
  describe("Testing user authentication", () => {
    test("should return 201 and create a new user when registering successfully", async () => {
      const response = await request(app)
        .post("/api/v1/users/register")
        .send(userData);
      expect(response.status).toBe(201);
    }, 20000);

    test("should return 409 when registering with an existing email", async () => {
      User.create(userData);
      const response = await request(app)
        .post("/api/v1/users/register")
        .send(userData);
      expect(response.status).toBe(409);
    }, 20000);

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
    }, 20000);

    test("should return token to log in", async () => {
      const response = await request(app)
      .post("/api/v1/users/login").send({
        email: userData.email,
        password: userData.password,
      });
      expect(response.status).toBe(200);
      token = response.body.token;
    });
    
    test('should return 200 and the user profile', async () => {
      const response = await request(app)
        .get('/api/v1/users/profile') 
        .set("Authorization", "Bearer " + token);
  
      expect(response.status).toBe(200);
   })

    test('should return 401 when user not logged in', async () => {
      const response = await request(app)
        .get('/api/v1/users/profile') 
        .set("Authorization", "Bearer " );
  
      expect(response.status).toBe(401);
   })
    test('should return 200 when user updated his profile', async () => {
      const response = await request(app)
        .get('/api/v1/users/profile') 
        .send(updateData)
        .set("Authorization", "Bearer " + token);
  
      expect(response.status).toBe(200);
   })

    test('should return 400 when user update empty profile', async () => {
      const response = await request(app)
        .patch('/api/v1/users/profile') 
        .send({})
        .set("Authorization", "Bearer " + token);
  
      expect(response.status).toBe(400);
   })
    test('should return 400 when user update email', async () => {
      const response = await request(app)
        .patch('/api/v1/users/profile') 
        .send({email: "nyvan@gmail.com"})
        .set("Authorization", "Bearer " + token);
  
      expect(response.status).toBe(400);
   })
   
  test("should return all users in db --> given '/api/v1/users'", async () => {
    const spy = jest.spyOn(User, "findAll");
    const spy2 = jest.spyOn(userServices, "getAllUsers");
    const response = await request(app).get("/api/v1/users");
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  }, 20000);

  test("Should return status 401 to indicate Unauthorized user", async () => {
    const loggedInUser = {
      email: userData.email,
      password: "test123456",
    };
    const spyonOne = jest.spyOn(User, "findOne").mockResolvedValueOnce({
      //@ts-ignore
      email: userData.email,
      password: loginData.password,
    });
    const response = await request(app).post("/api/v1/users/login").send(loggedInUser);
    expect(response.body.status).toBe(401);
    spyonOne.mockRestore();
  }, 20000);

  test("Should send otp verification code", async () => {
    const spy = jest.spyOn(mailServices, "sendEmailService");
    const response = await request(app).post("/api/v1/users/login").send({
      email: dummySeller.email,
      password: dummySeller.password,
    });

    expect(response.body.message).toBe("OTP verification code has been sent ,please use it to verify that it was you");
    // expect(spy).toHaveBeenCalled();
  }, 40000);

  test("should log a user in to retrieve a token", async () => {
    const response = await request(app).post("/api/v1/users/login").send({
      email: userData.email,
      password: userData.password,
    });
    expect(response.status).toBe(200);
    token = response.body.token;
  });

  test("should return 400 when adding an extra field while updating password", async () => {
    const response = await request(app)
      .put("/api/v1/users/passwordupdate")
      .send({
        oldPassword: userData.password,
        newPassword: userTestData.newPassword,
        confirmPassword: userTestData.confirmPassword,
        role: "seller",
      })
      .set("Authorization", "Bearer " + token);
    expect(response.status).toBe(400);
  });

  test("should return 401 when updating password without authorization", async () => {
    const response = await request(app).put("/api/v1/users/passwordupdate").send({
      oldPassword: userData.password,
      newPassword: userTestData.newPassword,
      confirmPassword: userTestData.confirmPassword,
    });
    expect(response.status).toBe(401);
  });

  test("should return 200 when password is updated", async () => {
    const response = await request(app)
      .put("/api/v1/users/passwordupdate")
      .send({
        oldPassword: userData.password,
        newPassword: userTestData.newPassword,
        confirmPassword: userTestData.confirmPassword,
      })
      .set("Authorization", "Bearer " + token);
    expect(response.status).toBe(200);
  });

  test("should return 400 when confirm password and new password doesn't match", async () => {
    const response = await request(app)
      .put("/api/v1/users/passwordupdate")
      .send({
        oldPassword: userData.password,
        newPassword: userTestData.newPassword,
        confirmPassword: userTestData.wrongPassword,
      })
      .set("Authorization", "Bearer " + token);
    expect(response.status).toBe(400);
  });

  test("should return 400 when old password is incorrect", async () => {
    const response = await request(app)
      .put("/api/v1/users/passwordupdate")
      .send({
        oldPassword: userTestData.wrongPassword,
        newPassword: userTestData.newPassword,
        confirmPassword: userTestData.wrongPassword,
      })
      .set("Authorization", "Bearer " + token);
    expect(response.status).toBe(400);
  });
});

describe("Testing user authentication", () => {
  test("should return 200 when password is updated", async () => {
    const response = await request(app)
      .get("/login")
      expect(response.status).toBe(200) 
      expect(response.text).toBe('<a href="/api/v1/users/auth/google"> Click to  Login </a>')
  });
  test("should return a redirect to Google OAuth when accessing /auth/google", async () => {
    const response = await request(app).get("/api/v1/users/auth/google");
    expect(response.status).toBe(302);
    expect(response.headers.location).toContain("https://accounts.google.com/o/oauth2");
  });

  test("should handle Google OAuth callback and redirect user appropriately", async () => {
    const callbackFnMock = jest.fn();
  
    const response = await request(app).get("/api/v1/users/auth/google/callback");
    expect(response.status).toBe(302); 
  });
  
})
afterAll(async () => {
  try {
    await sequelize.query('TRUNCATE TABLE profiles, users CASCADE');
  } catch (error) {
    console.error('Error truncating tables:', error);
  } finally {
    try {
      await sequelize.close();
    } catch (error) {
      console.error('Error closing the database connection:', error);
    }
  }
});

})  

