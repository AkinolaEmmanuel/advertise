export function welcomeEmail(brandName: string) {
  return {
    subject: `Welcome to Advertise, ${brandName}!`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#000;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#0a0a0a;border:1px solid #1f1f1f;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:32px 32px 24px;">
              <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#fff;">Advertise</h1>
              <div style="width:40px;height:2px;background:#fff;margin-bottom:24px;"></div>
              <h2 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#fff;">Welcome, ${brandName}!</h2>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#737373;">
                Your billboard is ready. Here's how to get started:
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #1f1f1f;">
                    <span style="color:#fff;font-weight:600;font-size:14px;">1.</span>
                    <span style="color:#a3a3a3;font-size:14px;margin-left:8px;">Upload your products with photos and prices</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #1f1f1f;">
                    <span style="color:#fff;font-weight:600;font-size:14px;">2.</span>
                    <span style="color:#a3a3a3;font-size:14px;margin-left:8px;">Set up your WhatsApp number for orders</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;">
                    <span style="color:#fff;font-weight:600;font-size:14px;">3.</span>
                    <span style="color:#a3a3a3;font-size:14px;margin-left:8px;">Share your billboard link everywhere</span>
                  </td>
                </tr>
              </table>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://advertise.app"}/dashboard"
                style="display:inline-block;padding:12px 28px;background:#fff;color:#000;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">
                Go to Dashboard
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #1f1f1f;">
              <p style="margin:0;font-size:12px;color:#525252;">
                You're receiving this because you signed up for Advertise. Your 30-day free trial has started.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
}

export function passwordResetEmail(resetUrl: string) {
  return {
    subject: "Reset your Advertise password",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#000;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#0a0a0a;border:1px solid #1f1f1f;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:32px 32px 24px;">
              <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#fff;">Advertise</h1>
              <div style="width:40px;height:2px;background:#fff;margin-bottom:24px;"></div>
              <h2 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#fff;">Reset your password</h2>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#737373;">
                We received a request to reset your password. Click the button below to choose a new one. This link expires in 1 hour.
              </p>
              <a href="${resetUrl}"
                style="display:inline-block;padding:12px 28px;background:#fff;color:#000;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">
                Reset Password
              </a>
              <p style="margin:24px 0 0;font-size:13px;line-height:1.5;color:#525252;">
                If you didn't request this, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #1f1f1f;">
              <p style="margin:0;font-size:12px;color:#525252;">
                This link will expire in 1 hour for security.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
}

export function orderNotificationEmail(
  brandName: string,
  customerItems: { name: string; quantity: number; price: string }[],
  total: string
) {
  const itemRows = customerItems
    .map(
      (item) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #1f1f1f;color:#a3a3a3;font-size:14px;">${item.name} × ${item.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #1f1f1f;color:#fff;font-size:14px;text-align:right;">${item.price}</td>
    </tr>`
    )
    .join("");

  return {
    subject: `New order on ${brandName}!`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#000;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#0a0a0a;border:1px solid #1f1f1f;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:32px 32px 24px;">
              <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#fff;">Advertise</h1>
              <div style="width:40px;height:2px;background:#fff;margin-bottom:24px;"></div>
              <h2 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#fff;">New Order 🎉</h2>
              <p style="margin:0 0 20px;font-size:15px;color:#737373;">You have a new order on <strong style="color:#fff;">${brandName}</strong></p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                ${itemRows}
                <tr>
                  <td style="padding:12px 0;color:#fff;font-size:15px;font-weight:700;">Total</td>
                  <td style="padding:12px 0;color:#fff;font-size:15px;font-weight:700;text-align:right;">${total}</td>
                </tr>
              </table>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://advertise.app"}/dashboard"
                style="display:inline-block;padding:12px 28px;background:#fff;color:#000;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">
                View Dashboard
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
}
