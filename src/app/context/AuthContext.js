'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('anello_user');
      if (stored) setUser(JSON.parse(stored));
    } catch (_) {}
    setLoading(false);
  }, []);

  const login = async (email, password, extra = {}) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, ...extra })
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.error };
      
      localStorage.setItem('anello_user', JSON.stringify(data));
      setUser(data);
      return { ok: true };
    } catch (_) {
      return { ok: false, error: 'Something went wrong' };
    }
  };

  const register = async (name, email, password, extra = {}) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, ...extra })
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.error };

      localStorage.setItem('anello_user', JSON.stringify(data));
      setUser(data);
      return { ok: true };
    } catch (_) {
      return { ok: false, error: 'Something went wrong' };
    }
  };

  const googleLogin = async (credential) => {
    try {
      // Decode JWT payload (standard for Google GSI)
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));

      const googleUser = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        image: payload.picture,
        avatar: payload.name.charAt(0)
      };

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleUser)
      });
      
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.error };

      localStorage.setItem('anello_user', JSON.stringify(data));
      setUser(data);
      return { ok: true };
    } catch (err) {
      console.error('Google login error:', err);
      return { ok: false, error: 'Google login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('anello_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
