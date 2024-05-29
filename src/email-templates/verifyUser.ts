// emailTemplates/verifyUser.ts
const verifyUserEmailTemplate = (username:string,verificationLink:string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
        }
        .header img {
          max-width: 100px;
        }
        .content {
          font-size: 16px;
          line-height: 1.5;
        }
        .btn {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #007bff;
          color: #ffffff;
          text-decoration: none;
          border-radius: 4px;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #666666;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://yourcompanylogo.com/logo.png" alt="Company Logo">
        </div>
        <div class="content">
          <h1>Welcome, ${username}!</h1>
          <p>Thank you for registering with us. Please verify your email address to complete your registration.</p>
          <p>Click the button below to verify your email address:</p>
          <a href="${verificationLink}" class="btn">Verify Email</a>
          <p>If the button above does not work, copy and paste the following link into your browser:</p>
          <p><a href="${verificationLink}">${verificationLink}</a></p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Your Company Name. All rights reserved.</p>
          <p>If you did not register for this account, please ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  
};

export default verifyUserEmailTemplate;


export const generateEmailVerificationEmail = (Username:string)=> {
  return `
Dear ${Username},
<br />

Thank you for verifying your email address. You are now able to start using our system. 
<br />

If you have any questions, feel free to reach out to our support team.
<br />

Best regards,
<br />
ATLP-eccommerce
  `;
}