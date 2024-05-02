export const RoleSchema = {
    type: "object",
    properties:{
        name: {
            type: "string"
        }
    }
}

export const getRoles = {
    tags: ["Roles"],
    summary: "Get all roles",
    responses: {
        200: {
            description: "OK",
           
        },
    },

}

export const createRole = {
    tags: ["Roles"],
    security: [{ bearerAuth: [] }],
    summary: "Create a new role",
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                      },
                    },
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
                        $ref: "#/components/schemas/Role",
                    },
                },
            },
        },
    },
}

export const updateRole = {
    tags: ["Roles"],
    security: [{ bearerAuth: [] }],
    summary: "Update a role",
    parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Role ID",
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
                      name: {
                        type: "string",
                      },
                    },
                  },
            },
        },
    },
    responses: {
        200: {
            description: "OK",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/Role",
                    },
                },
            },
        },
        400:{
            description: "Bad request",
        },
        500:{
            description: "Internal Server Error",
        
        }
    },
}

export const deleteRole = {
    tags: ["Roles"],
    security: [{ bearerAuth: [] }],
    summary: "Delete a role",
    parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "User ID",
          schema: {
            type: "number",
          },
        },
      ],
    responses: {
        200: {
            description: "OK",
            content:{
                "application/json":{
                    schema:{
                        $ref: "#/components/schemas/Role",
                    }
                }
            }
        },
    },
}