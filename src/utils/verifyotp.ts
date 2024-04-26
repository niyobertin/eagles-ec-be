export const verifyOtpTemplate = (url: string) => {
  return `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Verification</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
          <div style="width: 80%; max-width: 400px;margin:auto; padding: 30px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
            <h1 style="color: #333333; font-size: 24px; margin-bottom: 20px;">Verify that It's you</h1>
            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Someone is trying to log in to your account. vrify that it's by clicking verification link below:</p>
            <div style="display: flex; justify-content: center;width:100%">
      <a href='${url}' style="padding: 12px 24px; text-decoration: none; font-size: 16px; font-weight: bold; color: black; background-color: yellow; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease;margin:auto">Verify </a>
    </div>
            <p style="color: #999999; font-size: 14px; margin-bottom: 20px;">This verification link is valid for 5 minutes, use it to verify that it's you. If you did not initiate this action, please ignore this message.</p>
            <div style="display: flex; justify-content: center; margin:auto;width:100%">
              
            <p style="font-style: italic; color: #999999;">Your account is safe 😎.</p>
          </div>
        </body>
        </html>
`;
};
