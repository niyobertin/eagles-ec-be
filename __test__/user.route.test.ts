import request from 'supertest';
import { beforeAll, afterAll, beforeEach, afterEach, test } from '@jest/globals';
import app from '../src/utils/server';
import { testDbConnection, testSequelize } from '../src/config/testDbConfig';
import UserTest from '../src/sequelize/models/usersTests'; 

describe('Testing User route', () => {
  beforeAll(async () => {
    try {
      await testDbConnection();
    } catch (error) {
      testSequelize.close();
    }
  }, 20000);

  afterAll(async () => {
    await testSequelize.close();
  });

  beforeEach(async () => {
    await UserTest.destroy({ truncate: true });
  });

  test('should return 201 when registering with an new user', async () => {
    const userData = {
      name: 'John Doe',
      username: 'johndoe',
      email: 'testing@gmail.com',
      password: 'password123',
    };
  
    const response = await request(app)
      .post('/api/v1/users/register')
      .send(userData);
  
    expect(response.status).toBe(201);
  }, 20000);

  test('should return 400 when registering with an existing email', async () => {
    await UserTest.create({
      name: "testing",
      username: "yvan",
      email : "ivan@gmail.com",
      password : "1234567"
    });
  
    const userData = {
      name: "testing",
      username: "yvan",
      email : "ivan@gmail.com",
      password : "1234567"
    };
  
    const response = await request(app)
      .post('/api/v1/users/register')
      .send(userData);
  
    expect(response.status).toBe(400);
  }, 20000);

 

  test('should return 500 when registering with an invalid credential', async () => {
    const userData = {
      email: 'test@mail.com',
      name: '',
      username: 'existinguser',
    };
  
    const response = await request(app)
      .post('/api/v1/users/register')
      .send(userData);
  
    expect(response.status).toBe(500);
  }, 20000);
});