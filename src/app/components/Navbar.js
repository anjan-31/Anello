'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="logo-img-link">
          <Image src="/logo.png" alt="Anello" width={160} height={60} className="logo-img" priority />
        </Link>
        <div className="nav-actions">
          <Link href="/" className="nav-btn">Home</Link>
          <Link href="/collections" className="nav-btn">Collections</Link>
          <Link href="/videos" className="nav-btn">Videos</Link>
        </div>
      </div>
    </nav>
  );
}
