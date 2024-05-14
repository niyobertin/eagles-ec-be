

export const viewCartDoc = {
  tags: ["Carts"],
  security: [{ bearerAuth: [] }],
  summary: "View cart",
  responses: {
    200: {
      description: "OK"
    },
    401: {
      description: "Un authorized",
    },
    500: {
      description: "Internal Server Error",
    },
  },
};

export const clearAllProductFromCartDoc = {
  tags: ["Carts"],
  security: [{ bearerAuth: [] }],
  summary: "Clear all products from cart",

  responses: {
    200: {
      description: "success",
    },
    401: {
      description: "Unauthorized",
    },
    404: {
      description: "Not Found",
    },
    500: {
      description: "Internal Server Error",
    },
  },
};

export const addItemToCartDoc = {
  tags: ["Carts"],
  security: [{ bearerAuth: [] }],
  summary: "Add product to Cart",
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            productId: {
              type: "number",
            },
            quantity: {
              type: "number",
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "success",
    },
    400: {
      description: "Bad request",
    },
    401: {
      description: "Unauthorized",
    },
    403: {
      description: "Forbidden",
    },
    500: {
      description: "Internal Server Error",
    },
  },
};

export const removeProductFromCartDoc = {
  tags: ["Carts"],
  security: [{ bearerAuth: [] }],
  summary: "Remove a product from Cart",
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            productId: {
              type: "number",
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "success",
    },
    401: {
      description: "Unauthorized",
    },
    404: {
      description: "Not Found",
    },
    500: {
      description: "Internal Server Error",
    },
  },
};

export const updateProductQuantityDoc = {
  tags: ["Carts"],
  security: [{ bearerAuth: [] }],
  summary: "Update Product Quantity in Cart",
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            productId: {
              type: "number",
            },
            quantity: {
              type: "number",
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "success",
    },
    401: {
      description: "Unauthorized",
    },
    404: {
      description: "Not Found",
    },
    500: {
      description: "Internal Server Error",
    },
  },
};
