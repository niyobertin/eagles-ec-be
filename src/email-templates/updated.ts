export const updateProductTemplate = (username: string, name: string) => {
  return `
          <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Verification</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
    <div style="width: 80%; max-width: 400px; margin:auto; padding: 30px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
      <h1 style="color: #333333; font-size: 24px; margin-bottom: 20px;">Product Updated ✅</h1>
      <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Dear ${username}, Your product ${name} succfuly updated</p>
      
    
      <div style="display: flex; justify-content: center; margin:auto;">
        <p style="font-style: italic; color: #999999;">Happy Trading😎.</p>
      </div>
    </div>
  </body>
  </html>
        `;
};
