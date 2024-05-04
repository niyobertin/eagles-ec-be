export const verifyOtpTemplate = (link: string,token:number) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Verification</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
    <div style="width: 80%; max-width: 400px; margin:auto; padding: 30px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
      <h1 style="color: #333333; font-size: 24px; margin-bottom: 20px;">Verify that It's you</h1>
      <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">We noticed a login attempt to your Eagle E-commerce account. If this was you, please verify your new device using the following one-time verification code</p>
      
     
      <div style="margin-bottom: 20px;">
        <p style="padding: 8px; font-size: 16px; font-weight: bold; background-color: blue; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease; display: inline-block; max-width: 200px; color: white;">${token}</p>
      </div>
      
      <p>OR</p>
  
      
      <div style="margin-bottom: 20px;">
        <a href="${link}" style="padding: 12px 24px; text-decoration: none; font-size: 16px; font-weight: bold; background-color: yellow; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease; display: inline-block; max-width: 100%;">Click here to verify</a>
      </div>
      
      <p style="color: #999999; font-size: 14px; margin-bottom: 20px;">This verification code is valid for 10 minutes.</p>
      <p style="color: #999999; font-size: 14px; margin-bottom: 20px;">If you don't recognize this login attempt, someone may be trying to access your account. We recommend you change your password immediately.</p>
      
      <div style="display: flex; justify-content: center; margin:auto;">
        <p style="font-style: italic; color: #999999;">Your account is safe 😎.</p>
      </div>
    </div>
  </body>
  </html>
  

`;
};
