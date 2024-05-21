export const reviewSchema = {
    type: 'object',
    property: {
        productId: {
            type: 'number'
        },
        reviewId: {
            type: 'string'
        },
        rating: {
            type: 'number'
        },
        feedback: {
            type: 'string'
        }
    }
}

export const getReviewProduct = {
    tags: ["Review"],
    summary: "Get all reviews on a single product",
    parameters: [
        {
          name: "pid",
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

export const createReviewProduct = {
    tags:["Review"],
    security: [{ bearerAuth: [] }],
    summary: "create a review on the product",
    parameters: [
        {
          name: "pid",
          in: "path",
          required: true,
          description: "Product Id",
          schema: {
            type: "number",
          },
        },
      ],
    requestBody: {
        require: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        rating: {
                            type: 'number'
                        },
                        feedback: {
                            type: "string"
                        }
                    }
                }
            }
        }
    },
    responses: {
        201: {
            description: "created"
        },
        405: {
            description: "can't create review twice."
        },
        500: {
            description: "Internal server error."
        }
    }
}

export const updateReviewProduct = {
    tags: ["Review"],
    security: [{ bearerAuth: [] }],
    summary: "update a review on the product",
    parameters: [
    {
      name: "pid",
      in: "path",
      required: true,
      description: "Product Id",
      schema: {
        type: "number",
      },
    },
  ],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "number"
              } , 
              rating: {
                type: 'number'
              },
              feedback: {
                type: "string"
              }
            },
            required: ["rating", "feedback"]
          }
        }
      }
    },
    responses: {
      201: {
        description: "Upgrade successfully",
      },
      404: {
        description: "Review not found",
      },
      500: {
        description: "Internal server error.",
      },
    },
  };

  export const deleteReview = {
    tags: ["Review"],
    security: [{bearerAuth: []}],
    summary: "User can delete a reveiw",
    parameters: [
        {
            name: "pid",
            in: "path",
            required: true,
            description: "product Id",
            schema: {
                type: "number"
            },
           
        }
    ],
    requestBody: {
        required: true,
        content: {
         "application/json": {
                schema: {
                    properties: {
                        id: {
                            type: "number"
                        }
                    }
                }
            }
        }
    },
    responses: {
        200: {
            description: "Successfully deleted",
        },
        404: { 
            description: "Review not found"
        },
        500: {
            description: "Internal server error"
        }
    }
  }
  