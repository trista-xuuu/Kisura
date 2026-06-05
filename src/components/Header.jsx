import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import allProducts from '../data/products.json';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const headerStyle = {
    position: 'sticky',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'var(--color-primary-white)',
    borderBottom: scrolled ? '1px solid var(--color-g20)' : '1px solid transparent',
    transition: 'all 0.3s ease',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
  };

  const categories = Array.from(new Set(allProducts.map(p => p.cat)));

  return (
    <>
      <header style={headerStyle}>
        <div style={{ padding: '24px var(--padding-x)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          


          {/* Desktop Left Nav */}
          <div className="hide-mobile" style={{ flex: 1, display: 'flex', gap: '32px', alignItems: 'center' }}>
            <Link to="/story" className="tc-body" style={{ color: 'var(--color-g100)' }}>品牌故事</Link>
            <div className="nav-dropdown-wrapper">
               <Link to="/products" className="tc-body" style={{ color: 'var(--color-g100)', display: 'flex', alignItems: 'center' }}>
                 探索系列
                 <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '6px' }}>
                   <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </Link>
               <div className="nav-dropdown">
                  <Link to="/products?category=ALL">所有系列</Link>
                  {categories.map(cat => (
                     <Link key={cat} to={`/products?category=${cat}`}>{cat}</Link>
                  ))}
               </div>
            </div>
            <div className="nav-dropdown-wrapper">
               <Link to="/stories" className="tc-body" style={{ color: 'var(--color-g100)', display: 'flex', alignItems: 'center' }}>
                 眼鏡故事
                 <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '6px' }}>
                   <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </Link>
               <div className="nav-dropdown">
                  <Link to="/stories?category=ALL">所有故事</Link>
                  <Link to="/stories?category=職人故事">職人故事</Link>
                  <Link to="/stories?category=眼鏡知識">眼鏡知識</Link>
               </div>
            </div>
          </div>
          
          {/* Logo Center / Left on Mobile */}
          <div className="logo-container" style={{ flex: 1, display: 'flex' }}>
            <Link to="/">
              <img src="/logo/logo_1.svg" alt="KISURA EYEWEAR" style={{ height: '25.2px', display: 'block', transform: 'scale(1.05)', transformOrigin: 'left center' }} />
            </Link>
          </div>

          {/* Desktop Right Nav */}
          <div className="hide-mobile" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '32px', alignItems: 'center' }}>
            <Link to="/recommend" className="tc-body" style={{ color: 'var(--color-accent-earth)', fontWeight: 'bold' }}>✨ AI 專屬推薦</Link>
            <Link to="/stores" className="btn-outline" style={{ padding: '8px 24px', fontSize: '14px' }}>合作通路</Link>
          </div>
          
          {/* Mobile Right (Hamburger) */}
          <div className="show-mobile-flex" style={{ display: 'none', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', padding: 0, color: 'var(--color-g100)' }}
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className="show-mobile"
        style={{ 
          display: 'none',
          position: 'fixed', top: '74px', left: 0, width: '100%', height: 'calc(100vh - 74px)',
          backgroundColor: 'var(--color-primary-white)', zIndex: 999,
          transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
          overflowY: 'auto', padding: '40px var(--padding-x)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <Link to="/story" className="tc-h2" style={{ color: 'var(--color-g100)' }}>品牌故事</Link>
          <div style={{ borderTop: '1px solid var(--color-g20)', paddingTop: '24px' }}>
            <h3 className="tc-h2" style={{ color: 'var(--color-g100)', marginBottom: '16px' }}>探索系列</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '16px' }}>
              <Link to="/products?category=ALL" className="tc-body" style={{ color: 'var(--color-g80)' }}>所有系列</Link>
              {categories.map(cat => (
                 <Link key={cat} to={`/products?category=${cat}`} className="tc-body" style={{ color: 'var(--color-g80)' }}>{cat}</Link>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--color-g20)', paddingTop: '24px' }}>
            <h3 className="tc-h2" style={{ color: 'var(--color-g100)', marginBottom: '16px' }}>眼鏡故事</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '16px' }}>
              <Link to="/stories?category=ALL" className="tc-body" style={{ color: 'var(--color-g80)' }}>所有故事</Link>
              <Link to="/stories?category=職人故事" className="tc-body" style={{ color: 'var(--color-g80)' }}>職人故事</Link>
              <Link to="/stories?category=眼鏡知識" className="tc-body" style={{ color: 'var(--color-g80)' }}>眼鏡知識</Link>
            </div>
          </div>
          <Link to="/stores" className="tc-h2" style={{ color: 'var(--color-g100)', borderTop: '1px solid var(--color-g20)', paddingTop: '24px' }}>合作通路</Link>
          <div style={{ borderTop: '1px solid var(--color-g20)', paddingTop: '24px' }}>
            <Link to="/recommend" className="btn-primary" style={{ display: 'block', textAlign: 'center', backgroundColor: 'var(--color-accent-earth)' }}>
              ✨ 體驗 AI 專屬推薦
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
