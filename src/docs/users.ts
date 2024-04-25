export const userSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    username: {
      type: "string",
    },
    email: {
      type: "string",
      format: "email",
    },
    password: {
      type: "string",
    },
  },
};

export const loginSchema = {
  properties: {
    email: {
      type: "string",
      format: "email",
    },
    password: {
      type: "string",
    },
  },
};

export const getUsers = {
  tags: ["Users"],
  summary: "Get all users",
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              $ref: "#/components/schemas/User",
            },
          },
        },
      },
    },
  },
};

export const createUsers = {
  tags: ["Users"],
  summary: "Register a new user",
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/User",
        },
      },
    },
  },
  responses: {
    201: {
      description: "Created",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/User",
          },
        },
      },
    },
    400: {
      description: "Bad request",
    },
  },
};

export const loginAsUser = {
  tags: ["Users"],
  summary: "Login as user",
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/Login",
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
    },
  },
};
