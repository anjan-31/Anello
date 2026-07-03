'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="logo-img-link">
          <Image src="/logo.png" alt="Anello" width={160} height={60} className="logo-img" priority />
        </Link>
        <div className="nav-actions">
          <button className="nav-btn theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
            {isDarkMode ? (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" /></svg>
            ) : (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            )}
            <span>{isDarkMode ? 'Light' : 'Dark'}</span>
          </button>
          <Link href="/" className="nav-btn">Home</Link>
          <Link href="/collections" className="nav-btn">Collections</Link>
          <Link href="/videos" className="nav-btn">Videos</Link>
        </div>
      </div>
    </nav>
  );
}
