'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// ── Forgot Password Modal ─────────────────────────────────────────────────────
function ForgotPasswordModal({ onClose }) {
  // step: 'email' | 'otp' | 'newpass' | 'done'
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [website, setWebsite] = useState('');

  // OTP input refs
  const otpRefs = Array.from({ length: 6 }, () => null);

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  // Step 1: Email submit → Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website }),
      });
      const data = await res.json();
      if (data.ok) {
        setStep('otp');
        startResendTimer();
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  // OTP input handling
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) next.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      e.preventDefault();
    }
  };

  // Step 2: OTP verify
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email, otp: otpValue }),
      });
      const data = await res.json();
      if (data.ok) {
        setStep('newpass');
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  // Step 3: New password set
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPass) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset', email, newPassword }),
      });
      const data = await res.json();
      if (data.ok) {
        // Password update handles by API in MongoDB
        setStep('done');
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  // Resend OTP
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError('');
    setLoading(true);
    setOtp(['', '', '', '', '', '']);
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.ok) {
        startResendTimer();
      } else {
        setError(data.error || 'Failed to resend OTP');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="fp-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="fp-modal">
        {/* Close Button */}
        <button className="fp-close" onClick={onClose}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Progress Steps */}
        {step !== 'done' && (
          <div className="fp-steps">
            {['email', 'otp', 'newpass'].map((s, i) => (
              <div key={s} className="fp-step-wrap">
                <div className={`fp-step-dot ${['email','otp','newpass'].indexOf(step) >= i ? 'active' : ''}`}>
                  {['email','otp','newpass'].indexOf(step) > i
                    ? <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    : i + 1
                  }
                </div>
                {i < 2 && <div className={`fp-step-line ${['email','otp','newpass'].indexOf(step) > i ? 'active' : ''}`} />}
              </div>
            ))}
          </div>
        )}

        {/* ── Step 1: Email ── */}
        {step === 'email' && (
          <>
            <div className="fp-icon">🔑</div>
            <h2 className="fp-title">Forgot Password?</h2>
            <p className="fp-desc">Enter your registered email and we&apos;ll send you a 6-digit OTP to reset your password.</p>
            {error && <div className="fp-error">{error}</div>}
            <form onSubmit={handleSendOtp} className="fp-form">
              {/* Honeypot field */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input
                  type="email" className="auth-input" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  autoFocus autoComplete="email" id="fp-email"
                />
              </div>
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? <span className="auth-spinner" /> : <>Send OTP <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></>}
              </button>
            </form>
          </>
        )}

        {/* ── Step 2: OTP ── */}
        {step === 'otp' && (
          <>
            <div className="fp-icon">📨</div>
            <h2 className="fp-title">Check Your Email</h2>
            <p className="fp-desc">We sent a 6-digit OTP to <strong style={{color:'var(--gold-dark)'}}>{email}</strong>. Enter it below.</p>
            {error && <div className="fp-error">{error}</div>}
            <form onSubmit={handleVerifyOtp} className="fp-form">
              <div className="fp-otp-grid">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className={`fp-otp-input ${digit ? 'filled' : ''}`}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    onPaste={handleOtpPaste}
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              <button type="submit" className="auth-submit" disabled={loading || otp.join('').length !== 6}>
                {loading ? <span className="auth-spinner" /> : 'Verify OTP →'}
              </button>
            </form>
            <div className="fp-resend">
              {resendTimer > 0
                ? <span>Resend OTP in <strong style={{color:'var(--gold)'}}>{resendTimer}s</strong></span>
                : <button className="fp-resend-btn" onClick={handleResend} disabled={loading}>Resend OTP</button>
              }
            </div>
          </>
        )}

        {/* ── Step 3: New Password ── */}
        {step === 'newpass' && (
          <>
            <div className="fp-icon">🔒</div>
            <h2 className="fp-title">Set New Password</h2>
            <p className="fp-desc">Choose a strong new password for your Anello account.</p>
            {error && <div className="fp-error">{error}</div>}
            <form onSubmit={handleResetPassword} className="fp-form">
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  type={showPass ? 'text' : 'password'}
                  className="auth-input" placeholder="New password (min 6 chars)"
                  value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  autoFocus id="fp-newpass"
                />
                <button type="button" className="auth-eye" onClick={() => setShowPass(p => !p)} tabIndex={-1}>
                  {showPass
                    ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <input
                  type={showPass ? 'text' : 'password'}
                  className="auth-input" placeholder="Confirm new password"
                  value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
                  id="fp-confirmpass"
                />
              </div>
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? <span className="auth-spinner" /> : 'Reset Password →'}
              </button>
            </form>
          </>
        )}

        {/* ── Step 4: Done ── */}
        {step === 'done' && (
          <div className="fp-done">
            <div className="fp-done-icon">✅</div>
            <h2 className="fp-title">Password Reset!</h2>
            <p className="fp-desc">Your password has been successfully updated. You can now sign in with your new password.</p>
            <button className="auth-submit" onClick={onClose} style={{marginTop:'0.5rem'}}>
              Back to Sign In →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Login Page ───────────────────────────────────────────────────────────
export default function LoginPage() {
  const { login, googleLogin } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', website: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6Ld-mock-site-key-here-xxxx';
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
      const badge = document.querySelector('.grecaptcha-badge');
      if (badge) badge.remove();
    };
  }, []);

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields'); return; }
    setLoading(true);

    let recaptchaToken = '';
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6Ld-mock-site-key-here-xxxx';
    if (window.grecaptcha) {
      try {
        recaptchaToken = await window.grecaptcha.execute(siteKey, { action: 'login' });
      } catch (err) {
        console.error('reCAPTCHA execution error:', err);
      }
    }

    await new Promise(r => setTimeout(r, 600));
    const res = await login(form.email, form.password, { website: form.website, recaptchaToken });
    setLoading(false);
    if (res.ok) router.push('/');
    else setError(res.error);
  };

  useEffect(() => {
    /* global google */
    if (typeof window !== 'undefined' && window.google) {
      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
        callback: async (response) => {
          setLoading(true);
          const res = await googleLogin(response.credential);
          setLoading(false);
          if (res.ok) router.push('/');
          else setError(res.error);
        }
      });
      google.accounts.id.renderButton(
        document.getElementById("google-login-btn"),
        { theme: "outline", size: "large", width: "100%", text: "continue_with", shape: "pill" }
      );
    }
  }, [googleLogin, router]);

  return (
    <div className="auth-page">
      {/* Background decoration */}
      <div className="auth-bg">
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />
      </div>

      <div className="auth-container">
        {/* Logo */}
        <Link href="/" className="auth-logo-link">
          <Image src="/logo.png" alt="Anello" width={180} height={70} className="auth-logo" priority />
        </Link>

        <div className="auth-card">
          <div className="auth-card-header">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your Anello account</p>
          </div>

          {error && (
            <div className="auth-error">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={submit} className="auth-form">
            {/* Honeypot field */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={handle}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <div className="auth-field">
              <label htmlFor="email" className="auth-label">Email Address</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input
                  id="email" name="email" type="email"
                  className="auth-input" placeholder="you@example.com"
                  value={form.email} onChange={handle} autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label htmlFor="password" className="auth-label">Password</label>
                <button
                  type="button"
                  className="auth-forgot"
                  onClick={() => setShowForgot(true)}
                  id="forgot-password-btn"
                >
                  Forgot password?
                </button>
              </div>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  id="password" name="password" type={showPass ? 'text' : 'password'}
                  className="auth-input" placeholder="Enter your password"
                  value={form.password} onChange={handle} autoComplete="current-password"
                />
                <button type="button" className="auth-eye" onClick={() => setShowPass(p => !p)} tabIndex={-1}>
                  {showPass
                    ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading} id="login-btn">
              {loading
                ? <span className="auth-spinner" />
                : <>Sign In <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>
              }
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>

          <div id="google-login-btn" style={{ width: '100%', marginBottom: '1.2rem' }}></div>

          <p className="auth-switch">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="auth-switch-link">Create Account</Link>
          </p>
        </div>

        <p className="auth-back">
          <Link href="/" className="auth-back-link">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Store
          </Link>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
    </div>
  );
}
