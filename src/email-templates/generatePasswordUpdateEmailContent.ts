/**
 * Generates the content for the password update confirmation email with inline CSS.
 * @param userName The name of the user.
 * @returns The HTML content of the email.
 */
const generatePasswordUpdateEmailContent = (userName: string): string => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Updated Confirmation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333;
          }
          p {
            color: #666;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Password Updated Confirmation</h1>
          <p>Dear ${userName},</p>
          <p>Your password has been successfully updated. If you did not initiate this action, please contact support immediately.</p>
          <p>Thank you.</p>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    return htmlContent;
  };
  
  export { generatePasswordUpdateEmailContent };
  