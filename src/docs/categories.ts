export const categorySchema = {
    properties:{
        type: "object",
        name:{
            type: "string",
            example: ""
        },
        description:{
            type: "string",
            example: ""
        },
        image:{ type: "string", format: "binary" }
    } 
}

export const getCategories = {
    tags: ["Categories"],
    security: [{ bearerAuth: [] }],
    summary: "Get all Categories",
    responses: {
      200: {
        description: "OK"
      },
    },
  }

  export const getSingleCategory ={
    tags: ["Categories"],
    security: [{ bearerAuth: [] }],
    summary: "Get single category",
    parameters: [
        {
            in: "path",
            name: "id",
            description: "ID of the category",
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

  export const addCategories = {
    tags: ["Categories"],
    security: [{ bearerAuth: [] }],
    summary: "Add new category",
    requestBody: {
      required: true,
      content: {
        "multipart/form-data": {
            schema: {
                type: "object",
                properties: {
                    name: { type: "string" , example: ""},
                    description:{ type: "string" , example: ""},
                    image: { type: "string", format: "binary" }
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

  export const updateCategories = {
    tags: ["Categories"],
    security: [{ bearerAuth: [] }],
    summary: " update category",
    parameters: [
        {
            in: "path",
            name: "id",
            description: "ID of the category to update",
            required: true,
            schema: {
                type: "string"
            }
        }
    ],
    requestBody: {
      required: true,
      content: {
        "multipart/form-data": {
            schema: {
                type: "object",
                properties: {
                    name: { type: "string" , example: ""},
                    description:{ type: "string" , example: ""},
                    image:{ type: "string", format: "binary" }
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
  export const deleteCategories ={
    tags: ["Categories"],
    security: [{ bearerAuth: [] }],
    summary: "Delete product",
    parameters: [
        {
            in: "path",
            name: "id",
            description: "ID of the product to delete",
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
