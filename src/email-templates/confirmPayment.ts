export const confirmPayment = (user: any, order: any) => {
    let orderItemsRows = '';
    //@ts-ignore
    order.items.forEach(item => {
        orderItemsRows += `
        <tr>
          <td>${item.product.name}</td>
          <td>${item.quantity}</td>
          <td>RWF ${item.product.price}</td>
          <td>RWF ${item.quantity * item.product.price}</td>
        </tr>
      `;
    });

    return `<!DOCTYPE html>
    <html>
    <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f0f0f0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #333;
      }
      p {
        color: #555;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f0f0f0;
      }
    </style>
    </head>
    <body>
      <div class="container">
        <h1>Payment and Order Confirmation</h1>
        <p>Dear ${user.username},</p>
        <p>We are pleased to confirm that we have successfully received your payment. Thank you for shopping with us.</p>
        <p>Here is a summary of your order:</p>
        <ul>
          <li><strong>Order Number:</strong> ${order.id}</li>
          <li><strong>Order Date:</strong> ${order.createdAt}</li>
          <li><strong>Estimated Delivery Date:</strong> ${order.deliveryDate}</li>
        </ul>
        <p><strong>Order Details:</strong></p>
        <table>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total Price</th>
          </tr>
          ${orderItemsRows}
        </table>
        <p>Our team is diligently processing your order and will prepare it for shipment. Please note that the estimated delivery date is ${order.deliveryDate}.</p>
        <p>If you have any questions or require further assistance, please do not hesitate to contact our customer service team by replying to this email.</p>
        <p>Thank you for choosing us. We look forward to serving you.</p>
        <p>Best regards,<br>Eagles ec</p>
      </div>
    </body>
    </html>`;
};
