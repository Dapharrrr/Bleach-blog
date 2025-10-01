'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} onClick={closeMobileMenu}>
          <h1>Bleach Blog</h1>
        </Link>

        <div className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`}>
          <Link 
            href="/" 
            className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}
            onClick={closeMobileMenu}
          >
            Accueil
          </Link>
          
          <Link 
            href="/articles" 
            className={`${styles.navLink} ${pathname.startsWith('/articles') ? styles.active : ''}`}
            onClick={closeMobileMenu}
          >
            Articles
          </Link>
        </div>

        {/* Menu mobile hamburger */}
        <div className={styles.mobileMenuButton}>
          <button 
            className={`${styles.hamburger} ${mobileMenuOpen ? styles.hamburgerOpen : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      
      {/* Overlay pour fermer le menu mobile */}
      {mobileMenuOpen && (
        <div className={styles.overlay} onClick={closeMobileMenu}></div>
      )}
    </nav>
  );
}