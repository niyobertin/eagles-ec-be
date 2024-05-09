
export const productSchema = {
    properties:{
        type: "object",
        name:{
            type: "string",
        },
        stockQuantity:{
            type: "number" 
        },
        price:{
            type: "float"
        },
        discount:{
            type: "float"  
        },
        categoryID:{
            type: "string" 
        },
        expiryDate:{
            type: "date"
        }
    } 
}

export const getProducts = {
    tags: ["Products"],
    security: [{ bearerAuth: [] }],
    summary: "Get all products",
    responses: {
      200: {
        description: "OK"
      },
    },
  }

  export const getSingleProducts ={
    tags: ["Products"],
    security: [{ bearerAuth: [] }],
    summary: "Get single product",
    parameters: [
        {
            in: "path",
            name: "id",
            description: "ID of the product",
            required: true,
            schema: {
                type: "string"
            }
        }
    ],
    responses: {
      200: {
        description: "OK"
      },
    }
  }

  export const addProducts = {
    tags: ["Products"],
    security: [{ bearerAuth: [] }],
    summary: "Add new product",
    requestBody: {
      required: true,
      content: {
        "multipart/form-data": {
            schema: {
                type: "object",
                properties: {
                    name: { type: "string",
                    example: ""
                     },
                    images: {
                        type: "array",
                        items: { type: "string", format: "binary" }
                    },
                    stockQuantity: { type: "number",
                    example: ""
                     },
                    price: { type: "float" ,
                    example: ""
                    },
                    discount: { type: "float",
                    example: ""
                     },
                    categoryID: { type: "string",
                    example: ""
                     },
                    expiryDate: { type: "date",
                    example: ""
                     }
                }
            }
         }
        }
    },
    responses: {
        201: {
            description: "Created"
        },
        400: {
            description: "Bad request"
        }
    }
  }

  export const updateProducts = {
    tags: ["Products"],
    security: [{ bearerAuth: [] }],
    summary: " update product",
    parameters: [
        {
            in: "path",
            name: "id",
            description: "ID of the product to update",
            required: true,
            schema: {
                type: "string"
            }
        }
    ],
    requestBody: {
        required: false,
        content: {
          "multipart/form-data": {
              schema: {
                  type: "object",
                  properties: {
                      name: { type: "string",
                      example: ""
                       },
                      images: {
                          type: "array",
                          items: { type: "string", format: "binary" }
                      },
                      stockQuantity: { type: "number",
                      example: ""
                       },
                      price: { type: "float" ,
                      example: ""
                      },
                      discount: { type: "float",
                      example: ""
                       },
                      categoryID: { type: "string",
                      example: ""
                       },
                      expiryDate: { type: "date",
                      example: ""
                       }
                  }
              }
           }
          }
      },
    responses: {
        201: {
            description: "Updated"
        },
        400: {
            description: "Bad request"
        }
    }
  }
  export const deleteProducts ={
    tags: ["Products"],
    security: [{ bearerAuth: [] }],
    summary: "Delete product",
    parameters: [
        {
            in: "path",
            name: "id",
            description: "ID of the category to delete",
            required: true,
            schema: {
                type: "string"
            }
        }
    ],
    responses: {
      200: {
        description: "Deleted"
      },
    }
  }

  export const searchProduct = {
    tags: ['Products'],
    security: [{bearerAuth: []}],
    summary: 'Search products',
    parameters: [
      {
        name: 'name',
        in: 'query',
        description: 'Search for products by name',
       
        schema: {
          type: 'string',
        },
      },
      {
        name: 'minPrice',
        in: 'query',
        description: 'Minimum price of product',
        schema: {
          type: 'number',
        },
      },
      {
        name: 'maxPrice',
        in: 'query',
        description: 'Maximum price of product',
        schema: {
          type: 'number',
        },
      },
      {
        name: 'category',
        in: 'query',
        description: 'Search for products by category',
        schema: {
          type: 'string',
        },
      },
      {
        name: 'expirationDate',
        in: 'query',
        description: 'Search expired products',
        schema: {
          type: 'date'
        }
      }
    ],
    responses: {
      '200': {
        description: 'Successful response',
        },
      },
      '404': {
        description: 'No products found',
      },
    }
  