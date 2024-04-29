export const verifyOtpTemplate = (token: number) => {
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
 
  <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;"> We noticed a login attempt to your Eagle E-commerce account. If this was you, please verify your new device using the following one-time verification code</p>
  
  <p></>
    <div style="display: flex; justify-content: center;width:100%">
      <p style="padding: 12px 24px; font-size: 16px; font-weight: bold; color: white; background-color: blue; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease;margin:auto;">${token}</p>
    </div>
    <p style="color: #999999; font-size: 14px; margin-bottom: 20px;">This verification code is valid for 10 minutes. </p>
  <p style="color: #999999; font-size: 14px; margin-bottom: 20px;">If you don't recognize this login attempt, someone may be trying to access your account. We recommend you change your password immediately.</p>
    <div style="display: flex; justify-content: center; margin:auto;width:100%">
      <p style="font-style: italic; color: #999999;margin:auto">Your account is safe 😎.</p>
    </div>
  </div>
</body>
</html>

`;
};
