// OTP verify + password reset karo
// In-memory store — send-otp route se share karna mushkil hai in Next.js
// isliye hum ek global store use karte hain

// Global singleton pattern for Next.js serverless
if (!global._anelloOtpStore) {
  global._anelloOtpStore = new Map();
}
const otpStore = global._anelloOtpStore;

export async function POST(request) {
  try {
    const { action, email, otp, newPassword, website } = await request.json();

    if (website) {
      return Response.json({ ok: false, error: 'Invalid request' }, { status: 400 });
    }

    const normalEmail = email?.toLowerCase();

    // === STEP 1: OTP Verify ===
    if (action === 'verify') {
      const record = otpStore.get(normalEmail);
      if (!record) {
        return Response.json({ ok: false, error: 'OTP not found or expired. Request a new one.' }, { status: 400 });
      }
      if (Date.now() > record.expiresAt) {
        otpStore.delete(normalEmail);
        return Response.json({ ok: false, error: 'OTP has expired. Please request a new one.' }, { status: 400 });
      }
      if (record.otp !== otp) {
        return Response.json({ ok: false, error: 'Incorrect OTP. Please try again.' }, { status: 400 });
      }
      // Mark as verified
      otpStore.set(normalEmail, { ...record, verified: true });
      return Response.json({ ok: true, message: 'OTP verified' });
    }

    // === STEP 2: Reset Password ===
    if (action === 'reset') {
      const record = otpStore.get(normalEmail);
      if (!record || !record.verified) {
        return Response.json({ ok: false, error: 'Please verify OTP first.' }, { status: 400 });
      }
      if (Date.now() > record.expiresAt) {
        otpStore.delete(normalEmail);
        return Response.json({ ok: false, error: 'Session expired. Please start again.' }, { status: 400 });
      }
      if (!newPassword || newPassword.length < 6) {
        return Response.json({ ok: false, error: 'Password must be at least 6 characters.' }, { status: 400 });
      }

      // Update in MongoDB
      try {
        const connectDB = (await import('@/lib/db')).default;
        const User = (await import('@/models/User')).default;
        await connectDB();
        const user = await User.findOneAndUpdate({ email: normalEmail }, { password: newPassword });
        if (!user) {
          return Response.json({ ok: false, error: 'User not found in database.' }, { status: 404 });
        }
      } catch (dbErr) {
        console.error('DB Reset Error:', dbErr);
        return Response.json({ ok: false, error: 'Database update failed.' }, { status: 500 });
      }

      otpStore.delete(normalEmail);
      return Response.json({ ok: true, message: 'Password reset successful' });
    }

    return Response.json({ ok: false, error: 'Invalid action' }, { status: 400 });

  } catch (err) {
    console.error('[reset-password] Error:', err);
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
