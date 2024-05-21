import request from "supertest";
import path from "path";
import fs from "fs";
import { beforeAll, afterAll, jest, test } from "@jest/globals";
import app from "../src/utils/server";
import Product from "../src/sequelize/models/products";
import Category from "../src/sequelize/models/categories";
import sequelize, { connect } from "../src/config/dbConnection";
import User from "../src/sequelize/models/users";
import bcrypt from "bcryptjs";
import { Role } from "../src/sequelize/models/roles";
import redisClient from "../src/config/redis";
import { response } from "express";
import { placeOrder } from "../src/services/payment.service";
import Cart from "../src/sequelize/models/Cart";
import CartItem from "../src/sequelize/models/CartItem";
import OrderItem from "../src/sequelize/models/orderItems";

const userData: any = {
  name: "yvanna",
  username: "testuser",
  email: "test1@gmail.com",
  role:"seller",
  password: "test1234",
};

const dummySeller = {
    name: "dummy1234",
    username: "username1234",
    email: "soleilcyber00@gmail.com",
    password: "1234567890",
  };

const product:any = {
    name: "pens",
    images: ["image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg"],
    stockQuantity: 8,
    price: 5000,
    discount: 3.5,
    categoryID: 1,
  };

  const dummyBuyer = {
    name: "test user",
    username: "testUser",
    email: "soleil@soleil0w.com",
    password: "soleil00",    
  }

const searchProduct: any = {
  name: "iphone",
  minPrice: 0,
  maxPrice: 0,
  category: "Electronic device",
};

describe("Testing product Routes", () => {
    beforeAll(async () => {
      try {
        await connect();
        const testAdmin = {
            name: "admin123",
            username: "admin123",
            email: "admin1@example.com",
            password: await bcrypt.hash("password", 10),
            roleId: 3
          }
       
          await Role.destroy({ where: {}});
          const resetId = await sequelize.query('ALTER SEQUENCE "Roles_id_seq" RESTART WITH 1');
          
          await Role.bulkCreate([
            { name: "buyer" },
            { name: "seller" },
            { name: "admin" },
          ])
         
          await User.create(testAdmin);
      
          const dummy = await request(app).post("/api/v1/users/register").send(dummySeller);
        await Product.destroy({});
        await Category.destroy({truncate:true});
      } catch (error) {
        console.log("error for products testing ", error)
      }
    }, 40000);
  
    afterAll(async () => {
      await Product.destroy({where:{}});
      await Cart.destroy({where: {}})
      await sequelize.close();
      await redisClient.quit()
    });
    test("should return 201 and create a new user when registering successfully", async () => {
      const response = await request(app)
        .post("/api/v1/users/register")
        .send(userData);
      expect(response.status).toBe(201);
    }, 20000);

    test('should return 201 and register a dummy buyer user', async () => {
      const response = await request(app)
        .post("/api/v1/users/register")
        .send(dummyBuyer);
        expect(response.status).toBe(201);
    })
    let buyerToken: any;

    test("should login an buyer", async () =>{
      const response = await request(app).post("/api/v1/users/login").send({
        email: "soleil@soleil0w.com",
        password: "soleil00"
    })
    buyerToken = response.body.token;
  });

    let token:any, adminToken:any;
    test('It should return status 401 for unthorized',async() =>{
        const response = await request(app)
        .post('/api/v1/products')
        .send(product)
        expect(response.status).toBe(401);
    },2000);

    test("should login an Admin", async () =>{
        const response = await request(app).post("/api/v1/users/login").send({
          email: "admin1@example.com",
            password: "password"
      })
      adminToken = response.body.token;
    });

    test("should update dummyseller's role to seller", async () => {
        const logDummySeller = await request(app).post("/api/v1/users/login").send({
          email: dummySeller.email,
          password: dummySeller.password,
        });
        expect(logDummySeller.status).toBe(200);
        token = logDummySeller.body.token;
        const dummySellerId = logDummySeller.body.userInfo.id;
    
        const response = await request(app)
          .patch(`/api/v1/users/${dummySellerId}/role`)
          .send({
            roleId: 2,
          })
          .set("Authorization", "Bearer " + adminToken);
        expect(response.status).toBe(200);
        
      });

    
  test('It should return status 201 for a created category', async () => {
  const imagePath = path.resolve(__dirname, '1680673137259.jpg');
  const imageBuffer = fs.readFileSync(imagePath);
  const response = await request(app)
  .post('/api/v1/categories')
  .attach('image', imageBuffer, { filename: '1680673137259.jpg' })
  .field('name', 'Foodss6')
  .field('description', 'Developisng6 good healthy')
  .set("Authorization", "Bearer " + token);
  expect(response.status).toBe(201);
},20000);
let id:any;
test("should return all querries in db --> given '/api/v1/categories'", async () => {
  const spy = jest.spyOn(Category, "findAll");
  const response = await request(app).get("/api/v1/categories")
  .set("Authorization", "Bearer " + token);
  expect(spy).toHaveBeenCalled();
  id = response.body.categories[0].id;
}, 20000);

test('It should return status 200 for a getting single category',async() =>{
  const response = await request(app)
  .get(`/api/v1/categories/${id}`)
  .set("Authorization", "Bearer " + token);
  expect(response.status).toBe(200);
},20000);

test('It should return status 201 for updated category',async() =>{
    const imagePath = path.resolve(__dirname, '1680673137259.jpg');
    const imageBuffer = fs.readFileSync(imagePath);
    const response = await request(app)
    .patch(`/api/v1/categories/${id}`)
    .attach('image', imageBuffer, { filename: '1680673137259.jpg' })
    .field('name', 'Foods')
    .field('description', 'Developing good healthy')
    .set("Authorization", "Bearer " + token);
    expect(response.status).toBe(201);
  },20000);

const imagePaths = [
  path.resolve(__dirname,  '1680673137259.jpg'),
  path.resolve(__dirname, '1680673137259.jpg'),
  path.resolve(__dirname, '1680673137259.jpg'),
  path.resolve(__dirname, '1680673137259.jpg')
];
    test('It should return status 409 forbidden',async() =>{
    const images = imagePaths.map(imagePath => fs.readFileSync(imagePath));
      const response = await request(app)
      .post('/api/v1/products')
        .field("name", "pens")
        .attach("images",images[0],{filename:"1680673137259.jpg"})
        .attach("images",images[1],{filename:"1680673137259.jpg"})
        .attach("images",images[2],{filename:"1680673137259.jpg"})
        .attach("images",images[3],{filename:"1680673137259.jpg"})
        .field('stockQuantity', 8)
        .field('price', 5000)
        .field('discount', 3.5)
        .field('categoryID', 0)
        .field('expiryDate', '2026/07/11')
        .set("Authorization", "Bearer " + token);
      expect(response.status).toBe(409);
  },20000);
  
  test('It should return status 201 for Created products',async() =>{
    const images = imagePaths.map(imagePath => fs.readFileSync(imagePath));
    const response = await request(app)
    .post('/api/v1/products')
    .field("name", "pens")
    .attach("images",images[0],{filename:"1680673137259.jpg"})
    .attach("images",images[1],{filename:"1680673137259.jpg"})
    .attach("images",images[2],{filename:"1680673137259.jpg"})
    .attach("images",images[3],{filename:"1680673137259.jpg"})
    .field('stockQuantity', 8)
    .field('price', 5000)
    .field('discount', 3.5)
    .field('categoryID', `${id}`)
    .field('expiryDate', '2026/07/11')
    .set("Authorization", "Bearer " + token);
    expect(response.status).toBe(201);
},40000);
let productId:any;
test("should return all products in db --> given '/api/v1/products'", async () => {
  const spy = jest.spyOn(Product, "findAll");
  const response = await request(app).get("/api/v1/products")
  .set("Authorization", "Bearer " + token);
  productId = response.body.products[0].id;
  expect(spy).toHaveBeenCalled();
}, 20000);

  test('It should return status 200 for single Product',async() =>{
    const response = await request(app)
    .get(`/api/v1/products/${productId}`)
    .set("Authorization", "Bearer " + token);
    expect(response.status).toBe(200);
  },20000);

  test('It should return status 201 for Update products',async() =>{
    const images = imagePaths.map(imagePath => fs.readFileSync(imagePath));
    const response = await request(app)
    .patch(`/api/v1/products/${productId}`)
    .field("name", "pens")
    .attach("images",images[0],{filename:"1680673137259.jpg"})
    .attach("images",images[1],{filename:"1680673137259.jpg"})
    .attach("images",images[2],{filename:"1680673137259.jpg"})
    .attach("images",images[3],{filename:"1680673137259.jpg"})
    .field('stockQuantity', 8)
    .field('price', 5000)
    .field('discount', 3.5)
    .field('categoryID', `${id}`)
    .field('expiryDate', '2026/07/11')
    .set("Authorization", "Bearer " + token);
    expect(response.status).toBe(201);
},40000);

test('It should add a product to the user wishes', async () => {
  const response = await request(app)
  .post('/api/v1/wishes')
  .send({ productId })
  .set("Authorization", "Bearer " + buyerToken);
  expect(response.status).toBe(201)
}, 20000);

test('It should return a list of user wishes', async () => {
  const response = await request(app)
  .get('/api/v1/wishes')
  .set("Authorization", "Bearer " + buyerToken);
  expect(response.status).toBe(200)
});

test('It should retrieve wishes on a single product', async () => {
  const response = await request(app)
  .get(`/api/v1/products/${productId}/wishes`)
  .set("Authorization", "Bearer " + token);
  expect(response.status).toBe(200)
})

test('It should remove a product from user wishlist', async () => {
  const response = await request(app)
  .delete(`/api/v1/products/${productId}/wishes`)
  .set("Authorization", "Bearer " + buyerToken);
  expect(response.status).toBe(200)
})
let reviewId:any;
let cart:any;
test("Buyer should be able to add an item to the cart", async () => {
  const response = await request(app)
    .post("/api/v1/carts")
    .send({
      productId,
      quantity: 1,
    })
    .set("Authorization", `Bearer ${buyerToken}`);
  await request(app)
    .post("/api/v1/carts")
    .send({
      productId,
      quantity: 1,
    })
    .set("Authorization", `Bearer ${buyerToken}`);
  expect(response.status).toBe(201);
});

test("should return user cart if he has one", async () => {
  const response = await request(app).get("/api/v1/carts").set("Authorization", `Bearer ${buyerToken}`);
  expect(response.status).toBe(200);
  cart = response.body
});


test("it should create an order", async() => {
  const response = await placeOrder(cart)
  expect(response?.status).toBe("pending")
})

test("Buyer should be able to remove an item from the cart", async () => {
  const response = await request(app)
    .put("/api/v1/carts")
    .send({
      productId: productId,
    })
    .set("Authorization", "Bearer " + buyerToken);
  expect(response.status).toBe(200);
}); 

test("it should return 201 when review created on products", async() => {
  const response = await request(app)
  .post(`/api/v1/products/${productId}/reviews`)
  .send({
    rating: 4,
    feedback: "product is amazing"
  })
  .set("Authorization", "Bearer " + buyerToken)
  expect(response.status).toBe(201)
})

test("should return 403 and  not allow to reveiw a product twice", async () => {
  const response = await request(app)
  .post(`/api/v1/products/${productId}/reviews`)
  .send({
    rating: 3,
    feedback: "awesome products ever seen."
  })
  .set("Authorization", "Bearer " + buyerToken)
  expect(response.status).toBe(403)
  expect(response.body).toEqual({
    status: 403,
    message: "Not allowed to review a product twice."
  })
})

test("it should 404 error wrong path", async() => {
  const response = await request(app)
  .post(`/api/v1/products/review`)
  .send({
    rating: 3,
    feedback: "awesome products ever seen."
  })
  expect(response.status).toBe(404)
},40000)

test("should return 200 when all products reveiws fetched", async () => {
  const response = await request(app)
  .get(`/api/v1/products/${productId}/reviews`)
  expect(response.status).toBe(200)
  reviewId = response.body.reviewProduct[0].id
},40000)

test("should return 201 when update existing review on product", async () => {
  const response = await request(app)
  .patch(`/api/v1/products/${productId}/reviews`)
  .send({
    id: reviewId,
    rating: 3,
    feedback: "awesome products ever seen..."
  })
  .set("Authorization", "Bearer " + buyerToken)
  expect(response.status).toBe(201)
},40000)

test("it should return 200 when delete a review of the product", async () => {
  const response = await request(app)
  .delete(`/api/v1/products/${productId}/reviews`)
  .send({
    id: reviewId
  })
  .set("Authorization", "Bearer " + buyerToken)
 expect(response.body.message).toBe("You successfully deleted the review.")
},40000)

test("it should return 404 when delete a invalid id of review of the product", async () => {
  const response = await request(app)
  .delete(`/api/v1/products/${productId}/reviews`)
  .send({
    id: 900
  })
  .set("Authorization", "Bearer " + buyerToken)
 expect(response.status).toBe(404)
},40000)

test("when product not found", async() => {
  const response = await request(app)
  .get("/api/v1/products/123/reviews")
expect(response.status).toBe(200)
expect(response.body).toEqual({
  status: 200,
  message: "No review yet, Be first to review. "
})
})

test("Return 500 for handle error", async () => {
  const response = await request(app)
  .get("/api/v1/products/review")
  expect(response.status).toBe(500)
})
  test('It should return status 200 for removed Product',async() =>{
    await OrderItem.destroy({where: {productId}})
    const response = await request(app)
    .delete(`/api/v1/products/${productId}`)
    .set("Authorization", "Bearer " + token);
    expect(response.status).toBe(200);
  },20000);

  test('It should return status 404 Not found',async() =>{
    const response = await request(app)
    .get('/api/v1/products/1999')
    .set("Authorization", "Bearer " + token);
    expect(response.status).toBe(404);
},20000);

test('It should return status 200 for removed category',async() =>{
  const response = await request(app)
  .delete(`/api/v1/categories/${id}`)
  .set("Authorization", "Bearer " + token);
  expect(response.status).toBe(200);
 }, 20000);
 
  test("it should return status 200 when searching product", async () => {
    const response = await request(app)
      .get("/api/v1/products/search")
      .set("Authorization", "Bearer " + token);
    expect(response.status).toBe(200);
  });
  test("return status 200 when none seller role search products", async () => {
    const response = await request(app).get("/api/v1/products/search").send(searchProduct);
    expect(response.status).toBe(200);
  });
  test("it should return status product is not available when searching product", async () => {
    const response = await request(app)
      .get("/api/v1/products/search")
      .send(searchProduct)
      .set("Authorization", "Bearer " + token);
    expect(response.status).toBe(200);
  });

  it("changing product availability without login", async ()=>{
    const response = await request(app)
      .patch(`/api/v1/products/${productId}/status`)
      expect(response.body.status).toBe('Unauthorized');
      expect(response.body.message).toBe('You are not logged in. Please login to continue.');    
  })
  it("changing product availability of product which does not exist", async ()=>{
    const response = await request(app)
      .patch(`/api/v1/products/${91}/status`)
      .set("Authorization", "Bearer " + token);
      expect(response.body.message).toBe('Product not found')      
  })
  
});
