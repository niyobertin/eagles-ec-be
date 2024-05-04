export const activationTemplate = (msg:any, action:any) => {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account status</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
    <div style="width: 80%; max-width: 400px; margin:auto; padding: 30px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
      <h1 style="color: #333333; font-size: 24px; margin-bottom: 20px;">Account status is ${action}</h1>
  
    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">${
        action === 'disabled'? "Your account is disabled due to rules violation":
        "your account is reactivated following recent deactivation now you can use our system"
    }</p>
  
    <p></>
      <div style="display: flex; justify-content: center;width:100%">
        <p style="padding: 12px 24px; font-size: 16px; font-weight: bold; color: white; background-color: blue; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease;margin:auto;">${msg}</p>
      </div>
      </div>
    </div>
  </body>
  </html>`;
  };
  