import nodemailer from 'nodemailer';

// Global singleton store — dono routes (send-otp + reset-password) share karte hain
if (!global._anelloOtpStore) {
  global._anelloOtpStore = new Map();
}
const otpStore = global._anelloOtpStore;

export async function POST(request) {
  try {
    const { email, website } = await request.json();

    if (website) {
      return Response.json({ ok: false, error: 'Invalid request' }, { status: 400 });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ ok: false, error: 'Valid email required' }, { status: 400 });
    }

    // Check kar lo ke Gmail credentials .env mein hain
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return Response.json({ ok: false, error: 'Email service not configured' }, { status: 500 });
    }

    // 6-digit OTP generate karo
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 min

    // Store karo
    otpStore.set(email.toLowerCase(), { otp, expiresAt });

    // Gmail SMTP transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Beautiful HTML email
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="margin:0;padding:0;background:#f8f6f2;font-family:'Helvetica Neue',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f6f2;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(26,18,8,0.08);">
                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(135deg,#8b6508,#b8860b,#d4a017);padding:32px 40px;text-align:center;">
                    <div style="font-size:32px;margin-bottom:8px;">💍</div>
                    <div style="color:#fff;font-size:22px;font-weight:700;letter-spacing:2px;">ANELLO</div>
                    <div style="color:rgba(255,255,255,0.75);font-size:12px;letter-spacing:1px;margin-top:4px;">Fine Rings for Every Occasion</div>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:40px;">
                    <p style="color:#1a1208;font-size:18px;font-weight:600;margin:0 0 8px;">Password Reset Request</p>
                    <p style="color:#7a6a4a;font-size:14px;line-height:1.7;margin:0 0 28px;">
                      We received a request to reset your Anello account password. Use the OTP below to proceed. This code is valid for <strong>10 minutes</strong>.
                    </p>
                    <!-- OTP Box -->
                    <div style="background:#fffcf0;border:1.5px dashed #b8860b;border-radius:12px;padding:24px;text-align:center;margin-bottom:28px;">
                      <div style="color:#7a6a4a;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;">Your OTP Code</div>
                      <div style="color:#8b6508;font-size:40px;font-weight:800;letter-spacing:10px;">${otp}</div>
                    </div>
                    <p style="color:#7a6a4a;font-size:13px;line-height:1.6;margin:0;">
                      If you didn't request this, please ignore this email. Your account is safe.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background:#f8f6f2;padding:20px 40px;text-align:center;border-top:1px solid rgba(184,134,11,0.12);">
                    <p style="color:#7a6a4a;font-size:12px;margin:0;">© 2025 Anello Fine Rings · BIS Hallmarked</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Anello Fine Rings" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: '🔐 Your Anello Password Reset OTP',
      html,
    });

    return Response.json({ ok: true, message: 'OTP sent successfully' });

  } catch (err) {
    console.error('[send-otp] Error:', err);
    return Response.json({ ok: false, error: 'Failed to send OTP. Check email credentials.' }, { status: 500 });
  }
}

// OTP verify karne ka export (doosra route use karega)
export { otpStore };
