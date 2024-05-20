export const payment = {
	tags: ["Payments"],
	security: [{ bearerAuth: [] }],
	summary: "Payment using stripe",
	responses: {
        200: {
            description: "Success"
          },
        400: {
            description: "Bad request"
        },
        401: {
            description: "Unauthorized"
        },
        500: {
            description: "Internal server error"
        }
    }
};