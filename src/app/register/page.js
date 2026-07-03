'use client';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', website: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Please fill in all fields'); return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters'); return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match'); return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const res = await register(form.name, form.email, form.password, { website: form.website });
    setLoading(false);
    if (res.ok) router.push('/');
    else setError(res.error);
  };

  const strength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#10b981'];

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />
      </div>

      <div className="auth-container">
        <Link href="/" className="auth-logo-link">
          <Image src="/logo.png" alt="Anello" width={180} height={70} className="auth-logo" priority />
        </Link>

        <div className="auth-card">
          <div className="auth-card-header">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join Anello for exclusive offers & updates</p>
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
              <label htmlFor="name" className="auth-label">Full Name</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input
                  id="name" name="name" type="text"
                  className="auth-input" placeholder="Your full name"
                  value={form.name} onChange={handle} autoComplete="name"
                />
              </div>
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
              <label htmlFor="password" className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  id="password" name="password" type={showPass ? 'text' : 'password'}
                  className="auth-input" placeholder="Min. 6 characters"
                  value={form.password} onChange={handle} autoComplete="new-password"
                />
                <button type="button" className="auth-eye" onClick={() => setShowPass(p => !p)} tabIndex={-1}>
                  {showPass
                    ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {form.password.length > 0 && (
                <div className="auth-strength">
                  <div className="auth-strength-bars">
                    {[1,2,3].map(i => (
                      <div key={i} className="auth-strength-bar" style={{ background: i <= strength ? strengthColor[strength] : '#e5e7eb' }} />
                    ))}
                  </div>
                  <span style={{ color: strengthColor[strength], fontSize: '0.75rem', fontWeight: 600 }}>{strengthLabel[strength]}</span>
                </div>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="confirm" className="auth-label">Confirm Password</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                <input
                  id="confirm" name="confirm" type={showPass ? 'text' : 'password'}
                  className="auth-input" placeholder="Re-enter password"
                  value={form.confirm} onChange={handle} autoComplete="new-password"
                  style={{ borderColor: form.confirm && form.confirm !== form.password ? '#ef4444' : '' }}
                />
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading} id="register-btn">
              {loading
                ? <span className="auth-spinner" />
                : <>Create Account <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>
              }
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link href="/login" className="auth-switch-link">Sign In</Link>
          </p>
        </div>

        <p className="auth-back">
          <Link href="/" className="auth-back-link">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Store
          </Link>
        </p>
      </div>
    </div>
  );
}
