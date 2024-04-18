import request from 'supertest'; 
import { beforeAll, afterAll, beforeEach, afterEach, test } from '@jest/globals'; 
import app from '../src/utils/server'; 
import User from '../src/sequelize/models/users';
import sequelize, { connect } from '../src/config/dbConnection';


describe('Testing User route', () => { 
    beforeAll(async () => { 
        try { await 
    connect(); 
} 
catch (error) { sequelize.close(); } }, 20000);

afterAll(async () => { 
    await sequelize.close(); }); 
    beforeEach(async () => { 
    await User.destroy({ truncate: true }); 
}); 

test('should return 201 and create a new user when registering successfully', async () => { 
    const userData = { 
 name: 'yvanna', 
 username: 'testuser', 
 email: 'test1@gmail.com', 
 password: 'test1234', 
}; 
const response = await request(app) 
.post('/api/v1/users') 
.send(userData); 
expect(response.status).toBe(201); }, 20000); 

test('should return 409 when registering with an existing email', async () => { await User.create({ 
    name: 'yvanna', 
    username: 'testuser', 
    email: 'test1@gmail.com', 
    password: 'test1234', 
 }); 

    const userData = { 
        name: 'yvanna', 
        username: 'testuser', 
        email: 'test1@gmail.com', 
        password: 'test1234', 
 }; 
    
    const response = await request(app) 
    .post('/api/v1/users') 
    .send(userData); 
    expect(response.status).toBe(409); }, 20000); 

test('should return 500 when registering with an invalid credential', async () => { 
    const userData = { 
    email: 'test@mail.com', name: "", username: 'existinguser', }; 
    const response = await request(app) 
    .post('/api/v1/users')
     .send(userData); 
     
     expect(response.status).toBe(500); }, 20000); });