import nodemailer from 'nodemailer';

const getFixedUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('//')) return `https:${url}`;
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  if (cleanUrl.startsWith('image/upload') || cleanUrl.startsWith('ge/upload')) {
     const path = cleanUrl.replace('ge/upload', 'image/upload');
     return `https://res.cloudinary.com/dhc6iqrbh/${path}`;
  }
  return url;
};

export const sendOrderEmails = async (order) => {
  const { customerEmail, customerName, total, items, addressDetails } = order;
  const displayId = order.orderId || (order._id ? order._id.toString().slice(-8).toUpperCase() : '');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const addressString = addressDetails
    ? `${addressDetails.fullAddress}, ${addressDetails.city}, ${addressDetails.state} - ${addressDetails.pincode}`
    : order.address;

  const itemsHtml = items.map(item => {
    const imageUrl = item.image ? getFixedUrl(item.image) : '';
    const imgHtml = imageUrl 
      ? `<td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;"><img src="${imageUrl}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; display: block; margin: 0 auto;" /></td>`
      : `<td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center; font-size: 24px;">${item.emoji || '💍'}</td>`;
      
    return `
      <tr>
        ${imgHtml}
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; color: #333;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.qty}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${(item.price * item.qty).toLocaleString('en-IN')}</td>
      </tr>
    `;
  }).join('');

  const orderSummaryHtml = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
      <div style="background: #e91e8c; color: #fff; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Anello Fine Rings</h1>
      </div>
      <div style="padding: 20px;">
        <h2 style="color: #333; margin-top: 0;">Order Confirmation #${displayId}</h2>
        <p>Hello <strong>${customerName}</strong>,</p>
        <p>Thank you for your order! Here are your order details:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px;">
          <thead>
            <tr style="background: #f9f9f9;">
              <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: center; width: 60px;">Image</th>
              <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: left;">Item</th>
              <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: center;">Qty</th>
              <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <th colspan="3" style="padding: 10px; text-align: right;">Total Amount:</th>
              <th style="padding: 10px; text-align: right; color: #e91e8c; font-size: 18px;">₹${total.toLocaleString('en-IN')}</th>
            </tr>
          </tfoot>
        </table>

        <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">Shipping Details</h3>
        <p style="margin: 5px 0;"><strong>Name:</strong> ${addressDetails?.fullName || customerName}</p>
        <p style="margin: 5px 0;"><strong>Phone:</strong> ${order.phone}</p>
        <p style="margin: 5px 0;"><strong>Address:</strong> ${addressString}</p>
        <p style="margin: 5px 0;"><strong>Payment Method:</strong> Cash on Delivery (COD)</p>

        <p style="margin-top: 30px; font-size: 14px; color: #666;">We will notify you once your order is shipped.</p>
      </div>
    </div>
  `;

  const adminSummaryHtml = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <div style="background: #1a0a00; color: #fff; padding: 25px; text-align: center;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 1px;">Anello Fine Rings</h1>
        <p style="margin: 5px 0 0 0; font-size: 13px; color: #b8860b;">NEW ORDER ALERT: #${displayId}</p>
      </div>
      <div style="padding: 25px; background: #ffffff;">
        <h2 style="color: #1a0a00; margin-top: 0; font-size: 18px; border-bottom: 2px solid #eee; padding-bottom: 8px;">Order Details</h2>
        <p style="margin: 8px 0; font-size: 14px;"><strong>Customer Name:</strong> ${customerName}</p>
        <p style="margin: 8px 0; font-size: 14px;"><strong>Email:</strong> ${customerEmail}</p>
        <p style="margin: 8px 0; font-size: 14px;"><strong>Phone:</strong> ${order.phone}</p>
        <p style="margin: 8px 0; font-size: 14px;"><strong>Shipping Address:</strong> ${addressString}</p>
        <p style="margin: 8px 0; font-size: 14px;"><strong>Payment Method:</strong> Cash on Delivery (COD)</p>

        <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px; font-size: 15px; font-weight: 700; margin-top: 25px;">Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px;">
          <thead>
            <tr style="background: #fdfdfd;">
              <th style="padding: 10px; border-bottom: 2px solid #eee; text-align: center; width: 60px; font-size: 13px; color: #666;">Image</th>
              <th style="padding: 10px; border-bottom: 2px solid #eee; text-align: left; font-size: 13px; color: #666;">Item</th>
              <th style="padding: 10px; border-bottom: 2px solid #eee; font-size: 13px; color: #666; text-align: center;">Qty</th>
              <th style="padding: 10px; border-bottom: 2px solid #eee; text-align: right; font-size: 13px; color: #666;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <th colspan="3" style="padding: 15px 10px 10px 10px; text-align: right; font-size: 14px;">Total Value:</th>
              <th style="padding: 15px 10px 10px 10px; text-align: right; color: #b8860b; font-size: 18px; font-weight: 700;">₹${(total || 0).toLocaleString('en-IN')}</th>
            </tr>
          </tfoot>
        </table>

        <div style="margin-top: 25px; padding: 15px; background: #fffbeb; border-radius: 8px; border: 1px solid #fef3c7; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #b45309; font-weight: 700;">
            Please log in to the admin panel to process this order.
          </p>
        </div>
      </div>
    </div>
  `;

  try {
    // Send to Customer
    await transporter.sendMail({
      from: '"Anello Store" <' + process.env.GMAIL_USER + '>',
      to: customerEmail,
      subject: `Order Confirmation #${displayId} - Anello Fine Rings`,
      html: orderSummaryHtml,
    });

    // Send to Admin
    await transporter.sendMail({
      from: '"Anello Notifications" <' + process.env.GMAIL_USER + '>',
      to: `${process.env.GMAIL_USER}, anjankumarsingh710@gmail.com, hasmukhsolanki@hotmail.com, aanchalsolanki60@gmail.com`,
      subject: `New Order #${displayId} Received - ₹` + total.toLocaleString('en-IN'),
      html: adminSummaryHtml,
    });

    return true;
  } catch (error) {
    console.error('Error sending order emails:', error);
    return false;
  }
};

export const sendStatusUpdateEmail = async (order) => {
  const { customerEmail, customerName, total, status, items, addressDetails } = order;
  const displayId = order.orderId || (order._id ? order._id.toString().slice(-8).toUpperCase() : '');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const addressString = addressDetails
    ? `${addressDetails.fullAddress}, ${addressDetails.city}, ${addressDetails.state} - ${addressDetails.pincode}`
    : order.address;

  // Status-specific configuration
  let statusTitle = '';
  let statusMessage = '';
  let themeColor = '#b8860b'; // default gold
  let statusEmoji = '📦';

  if (status === 'processing') {
    statusTitle = 'Order is Processing';
    statusMessage = 'Your order has been received and is currently being processed by our team. We are preparing it for shipment.';
    themeColor = '#d97706'; // amber
    statusEmoji = '⏳';
  } else if (status === 'shipped') {
    statusTitle = 'Order Shipped!';
    statusMessage = 'Great news! Your order has been shipped and is on its way to you. Please keep your phone active for delivery updates.';
    themeColor = '#2563eb'; // blue
    statusEmoji = '🚚';
  } else if (status === 'delivered') {
    statusTitle = 'Order Delivered!';
    statusMessage = 'Your order has been successfully delivered. Thank you for shopping with Anello Fine Rings! We hope you love your purchase.';
    themeColor = '#059669'; // green
    statusEmoji = '🎉';
  } else if (status === 'cancelled') {
    statusTitle = 'Order Cancelled';
    statusMessage = 'Your order has been cancelled. If you did not request this cancellation or have any questions, please contact our support team.';
    themeColor = '#dc2626'; // red
    statusEmoji = '❌';
  } else {
    statusTitle = `Order Status: ${status}`;
    statusMessage = `Your order status has been updated to ${status}.`;
  }

  const itemsHtml = items.map(item => {
    const imageUrl = item.image ? getFixedUrl(item.image) : '';
    const imgHtml = imageUrl 
      ? `<td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;"><img src="${imageUrl}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; display: block; margin: 0 auto;" /></td>`
      : `<td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center; font-size: 24px;">${item.emoji || '💍'}</td>`;
      
    return `
      <tr>
        ${imgHtml}
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; color: #333;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.qty}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${(item.price * item.qty).toLocaleString('en-IN')}</td>
      </tr>
    `;
  }).join('');

  const statusUpdateHtml = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <div style="background: ${themeColor}; color: #fff; padding: 30px 20px; text-align: center;">
        <span style="font-size: 40px; margin-bottom: 10px; display: inline-block;">${statusEmoji}</span>
        <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px;">Anello Fine Rings</h1>
        <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Order Status Update</p>
      </div>
      <div style="padding: 30px 20px; background: #ffffff;">
        <h2 style="color: ${themeColor}; margin-top: 0; font-size: 20px; font-weight: 700;">${statusTitle}</h2>
        <p>Dear <strong>${customerName}</strong>,</p>
        <p style="line-height: 1.6; font-size: 15px;">${statusMessage}</p>
        
        <div style="margin: 25px 0; padding: 15px; background: #f9f9f9; border-radius: 8px; border-left: 4px solid ${themeColor};">
          <p style="margin: 5px 0; font-size: 14px;"><strong>Order ID:</strong> #${displayId}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Current Status:</strong> <span style="color: ${themeColor}; font-weight: 700; text-transform: uppercase;">${status}</span></p>
        </div>

        <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px; font-size: 16px; font-weight: 700; margin-top: 25px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px;">
          <thead>
            <tr style="background: #fdfdfd;">
              <th style="padding: 10px; border-bottom: 2px solid #eee; text-align: center; width: 60px; font-size: 13px; color: #666;">Image</th>
              <th style="padding: 10px; border-bottom: 2px solid #eee; text-align: left; font-size: 13px; color: #666;">Item</th>
              <th style="padding: 10px; border-bottom: 2px solid #eee; font-size: 13px; color: #666; text-align: center;">Qty</th>
              <th style="padding: 10px; border-bottom: 2px solid #eee; text-align: right; font-size: 13px; color: #666;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <th colspan="3" style="padding: 15px 10px 10px 10px; text-align: right; font-size: 14px;">Total Amount:</th>
              <th style="padding: 15px 10px 10px 10px; text-align: right; color: #b8860b; font-size: 18px; font-weight: 700;">₹${(total || 0).toLocaleString('en-IN')}</th>
            </tr>
          </tfoot>
        </table>

        <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px; font-size: 16px; font-weight: 700; margin-top: 25px;">Delivery Address</h3>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Name:</strong> ${addressDetails?.fullName || customerName}</p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Phone:</strong> ${order.phone}</p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Address:</strong> ${addressString}</p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Payment Method:</strong> Cash on Delivery (COD)</p>

        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 13px; color: #888; text-align: center;">
          Thank you for choosing Anello Fine Rings.
        </p>
      </div>
    </div>
  `;

  try {
    // Send to Customer
    await transporter.sendMail({
      from: '"Anello Store" <' + process.env.GMAIL_USER + '>',
      to: customerEmail,
      subject: `Order Status Updated: ${statusTitle} #${displayId} - Anello Fine Rings`,
      html: statusUpdateHtml,
    });

    // Send to Admin
    await transporter.sendMail({
      from: '"Anello Notifications" <' + process.env.GMAIL_USER + '>',
      to: `${process.env.GMAIL_USER}, anjankumarsingh710@gmail.com, hasmukhsolanki@hotmail.com, aanchalsolanki60@gmail.com`,
      subject: `[Admin Alert] Order #${displayId} Status Updated to ${status.toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Order Status Updated!</h2>
          <p>The status of Order <strong>#${displayId}</strong> has been changed to <strong>${status.toUpperCase()}</strong>.</p>
          <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
          <p><strong>Phone:</strong> ${order.phone}</p>
          <p><strong>Total Value:</strong> ₹${(total || 0).toLocaleString('en-IN')}</p>
          <p>This update notification email has been successfully sent to the customer.</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error('Error sending status update email:', error);
    return false;
  }
};
