export const wishSchema = {
    type: 'object',
    properties: {
        productId: {
            type: 'number'
        },
        userId: {
            type: 'number'
        }
    }
}

export const AddToWishes = {
    tags: ["Wishes"],
    security: [{ bearerAuth: [] }],
    summary: "Add a product to the wishlist",
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
        201: {
            description: "Created",
        },
        404: { description: "Not Found"
        },
        
    },
}

export const getWishes = {
    tags: ["Wishes"],
    security: [{ bearerAuth: [] }],
    summary: "Get all wished products",
    responses: {
        200: {
            description: "success",
        },
        500: {
            description: "Internal Server Error"
        }
    },
}

export const getWishesByProduct = {
    tags: ["Wishes"],
    security: [{ bearerAuth: [] }],
    summary: "Get all wishes on a single products",
    parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Product Id",
          schema: {
            type: "number",
          },
        },
      ],
    responses: {
        200: {
            description: "success",
        },
        403: {
            description: "Forbidden"
        },
        404: {
            description: "Not found"
        }
    },
}

export const deleteWish = {
    tags: ["Wishes"],
    security: [{ bearerAuth: [] }],
    summary: "Remove a product from your wishlist",
    parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Product Id",
          schema: {
            type: "number",
          },
        },
      ],
    responses: {
        200: {
            description: "success",
        },
        404: {
            description: "Not Found"
        }
    },
}