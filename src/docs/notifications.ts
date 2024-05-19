
export const getAllNotifications = {
  tags: ["Notifications"],
  security: [{ bearerAuth: [] }],
  summary: "Get user notifications",

  responses: {
    200: {
      description: "success",
    },
    401: {
      description: "Unauthorized",
    },
    500: {
      description: "Internal Server Error",
    },
  },
};
export const readNotification = {
  tags: ["Notifications"],
  security: [{ bearerAuth: [] }],
  summary: "Read(mark notification as Readed) notification",
  parameters: [
    {
      in: "path",
      name: "id",
      description: "Notification id",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],

  responses: {
    200: {
      description: "success",
    },
    401: {
      description: "Unauthorized",
    },
    404: {
      description: "Notification not found",
    },
    500: {
      description: "Internal Server Error",
    },
  },
};