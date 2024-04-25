import express from "express";
import { serve, setup } from "swagger-ui-express";
import { env } from "../utils/env";
import { createUsers, getUsers, loginAsUser, userSchema, loginSchema } from "./users";

const docRouter = express.Router();

const options = {
  openapi: "3.0.1",
  info: {
    title: "Eagles E-commerce API",
    version: "1.0.0",
    description: "Documentation for Eagles E-commerce Backend",
  },

  servers: [
    {
      url: `http://localhost:${env.port}`,
      description: "Development server",
    },
    {
      url: "https://eagles-ec-be-development.onrender.com/",
      description: "Production server",
    },
  ],

  basePath: "/",

  tags: [
    {
      name: "Users",
      description: "Endpoints related to users",
    },
  ],

  paths: {
    "/api/v1/users": {
      get: getUsers,
    },
    "/api/v1/users/register": {
      post: createUsers,
    },
    "/api/v1/users/login": {
      post: loginAsUser,
    },
  },

  components: {
    schemas: {
      User: userSchema,
      Login: loginSchema,
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        in: "header",
        name: "Authorization",
      },
    },
  },
};

docRouter.use("/", serve, setup(options));

export default docRouter;
