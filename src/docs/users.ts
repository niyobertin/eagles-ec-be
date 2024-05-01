import { response } from "express"
import { format } from "path"

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
    },
    password: {
      type: "string",
    },
}
}

export const loginSchema ={
  type: "object",
  properties :{
    email: {
      type: "string",
      format: "email",
    },
    password: {
      type: "string",
    },
  },
};

export const updatePasswordSchema = {
  type: "object",
  properties: {
    oldPassword: {
      type: "string",
    },
    newPassword: {
      type: "string",
    },
    confirmPassword: {
      type: "string",
    },
  },
};


export const profileSchema = {
  type: "object",
  properties :{
    profileImage:{
     type: "string",
     format: "binary"
    },
    fullName: {
      type: "string",
    },
    gender: {
      type: "string",
    },
    birthdate: {
      type: "string",
    },
    preferredLanguage: {
      type: "string",
    },
    preferredCurrency: {
      type: "string",
    },
    street: {
      type: "string",
    },
    city: {
      type: "string",
    },
    state: {
      type: "string",
    },
    postalCode: {
      type: "string",
    },
    country: {
      type: "string",
    },

  },
}

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
    password: {
      type: "string",
    },
  }

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
     }
    }
    }
  }
    
    export const  getProfileUser = {
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      summary: "Get a profile",
      responses: {
        200: {
          description: "OK",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Profile",
                },
              },
            },
          },
        },
      },
    }

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
    400: {
      description: "Bad request missing or extra filed",
    },
    404: {
      description: "Account not found",
    },
    409: {
      description: "Invalid credentials",
    },
    500: {
      description: "Internal server error",
    },
  },
};
    export const updateProfile = {
      tags: ["Users"],
      security: [{bearerAuth: []}],
      summary: "Update user profile",
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/Profile",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Updated",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Profile",
              },
            },
          },
        },
        400: {
          description: "Bad request",
        },
      },
    }
  

export const passwordUpdate = {
  tags: ["Users"],
  security: [{ bearerAuth: [] }],
  summary: "Update Password",
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/updatePassword",
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
    },
    400: {
      description: "Bad Request",
    },
  },
};
export const verifyOTPToken = {
  tags: ["Users"],
  summary: "verify OTP token for seller during login process",
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          properties: {
            token: {
              type: "number",
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Successfuly logged in ",
    },
    403: {
      description: "forbidden token expired",
    },
    404: {
      description: "Inavalid token or not found",
    },
  },
};
