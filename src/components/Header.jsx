import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkle, List, X, MapPin, CaretDown, CaretUp } from '@phosphor-icons/react';
import allProducts from '../data/products.json';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileMenus, setOpenMobileMenus] = useState({ explore: false, products: false, stories: false });
  const location = useLocation();

  const toggleMobileMenu = (menu) => setOpenMobileMenus(prev => ({ ...prev, [menu]: !prev[menu] }));

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
    setOpenMobileMenus({ explore: false, products: false, stories: false });
  }, [location.pathname, location.search]);

  const headerStyle = {
    position: 'fixed',
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
        <div style={{ height: '70px', padding: '0 var(--padding-x)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>


          {/* Desktop Left Nav */}
          <div className="hide-mobile" style={{ flex: 1, display: 'flex', gap: '32px', alignItems: 'center' }}>
            <Link to="/story" className="tc-body" style={{ color: 'var(--color-g100)' }}>品牌故事</Link>
            <div className="nav-dropdown-wrapper">
               <Link to="/explore" className="tc-body" style={{ color: 'var(--color-g100)', display: 'flex', alignItems: 'center' }}>
                 探索產品
                 <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '6px' }}>
                   <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </Link>
               <div className="nav-dropdown">
                  <Link to="/explore?gender=all">所有框型</Link>
                  <Link to="/explore?gender=men">男士框</Link>
                  <Link to="/explore?gender=women">女士框</Link>
                  <Link to="/explore?gender=unisex">中性框</Link>
               </div>
            </div>
            <div className="nav-dropdown-wrapper">
               <Link to="/products" className="tc-body" style={{ color: 'var(--color-g100)', display: 'flex', alignItems: 'center' }}>
                 探索系列
                 <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '6px' }}>
                   <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </Link>
               <div className="nav-dropdown">
                  {categories.map(cat => (
                     <Link key={cat} to={`/products?category=${cat}`}>{cat}</Link>
                  ))}
               </div>
            </div>
            <div className="nav-dropdown-wrapper">
               <Link to="/stories" className="tc-body" style={{ color: 'var(--color-g100)', display: 'flex', alignItems: 'center' }}>
                 探索故事
                 <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '6px' }}>
                   <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </Link>
               <div className="nav-dropdown">
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
          <div className="hide-mobile" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '24px', alignItems: 'center' }}>
            <Link to="/recommend" className="tc-body" style={{ color: 'var(--color-g100)', display: 'flex', alignItems: 'center', gap: '4px' }}><Sparkle size={16} /> AI 推薦</Link>
            <Link to="/stores" className="tc-body" style={{ color: 'var(--color-g100)', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={16} /> 合作通路</Link>
          </div>
          
          {/* Mobile Right (Hamburger) */}
          <div className="show-mobile-flex" style={{ display: 'none', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', padding: 0, color: 'var(--color-g100)' }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <List size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className="show-mobile"
        style={{ 
          display: 'none',
          position: 'fixed', top: '70px', left: 0, width: '100%', height: 'calc(100dvh - 70px)',
          backgroundColor: 'var(--color-primary-white)', zIndex: 999,
          transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
          overflowY: 'auto', padding: '40px var(--padding-x)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Link to="/story" className="tc-h4" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--color-g100)', padding: '24px 0', borderBottom: '1px solid var(--color-g20)' }}>品牌故事</Link>
          <div style={{ borderBottom: '1px solid var(--color-g20)' }}>
            <div onClick={() => toggleMobileMenu('explore')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '24px 0' }}>
              <h3 className="tc-h4" style={{ color: 'var(--color-g100)', margin: 0 }}>探索產品</h3>
              {openMobileMenus.explore ? <CaretUp size={20} color="var(--color-g100)" /> : <CaretDown size={20} color="var(--color-g100)" />}
            </div>
            {openMobileMenus.explore && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 16px 24px 16px' }}>
                <Link to="/explore?gender=all" onClick={() => setIsMobileMenuOpen(false)} className="tc-body" style={{ color: 'var(--color-g80)' }}>所有框型</Link>
                <Link to="/explore?gender=men" onClick={() => setIsMobileMenuOpen(false)} className="tc-body" style={{ color: 'var(--color-g80)' }}>男士框</Link>
                <Link to="/explore?gender=women" onClick={() => setIsMobileMenuOpen(false)} className="tc-body" style={{ color: 'var(--color-g80)' }}>女士框</Link>
                <Link to="/explore?gender=unisex" onClick={() => setIsMobileMenuOpen(false)} className="tc-body" style={{ color: 'var(--color-g80)' }}>中性框</Link>
              </div>
            )}
          </div>
          <div style={{ borderBottom: '1px solid var(--color-g20)' }}>
            <div onClick={() => toggleMobileMenu('products')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '24px 0' }}>
              <h3 className="tc-h4" style={{ color: 'var(--color-g100)', margin: 0 }}>探索系列</h3>
              {openMobileMenus.products ? <CaretUp size={20} color="var(--color-g100)" /> : <CaretDown size={20} color="var(--color-g100)" />}
            </div>
            {openMobileMenus.products && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 16px 24px 16px' }}>
                {categories.map(cat => (
                   <Link key={cat} to={`/products?category=${cat}`} onClick={() => setIsMobileMenuOpen(false)} className="tc-body" style={{ color: 'var(--color-g80)' }}>{cat}</Link>
                ))}
              </div>
            )}
          </div>
          <div style={{ borderBottom: '1px solid var(--color-g20)' }}>
            <div onClick={() => toggleMobileMenu('stories')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '24px 0' }}>
              <h3 className="tc-h4" style={{ color: 'var(--color-g100)', margin: 0 }}>探索故事</h3>
              {openMobileMenus.stories ? <CaretUp size={20} color="var(--color-g100)" /> : <CaretDown size={20} color="var(--color-g100)" />}
            </div>
            {openMobileMenus.stories && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 16px 24px 16px' }}>
                <Link to="/stories?category=職人故事" onClick={() => setIsMobileMenuOpen(false)} className="tc-body" style={{ color: 'var(--color-g80)' }}>職人故事</Link>
                <Link to="/stories?category=眼鏡知識" onClick={() => setIsMobileMenuOpen(false)} className="tc-body" style={{ color: 'var(--color-g80)' }}>眼鏡知識</Link>
              </div>
            )}
          </div>
          <Link to="/stores" onClick={() => setIsMobileMenuOpen(false)} className="tc-h4" style={{ color: 'var(--color-g100)', borderBottom: '1px solid var(--color-g20)', padding: '24px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={24} /> 合作通路</Link>
          <Link to="/recommend" onClick={() => setIsMobileMenuOpen(false)} className="tc-h4" style={{ color: 'var(--color-g100)', padding: '24px 0', borderBottom: '1px solid transparent', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkle size={24} /> AI 推薦
          </Link>
        </div>
      </div>
      <div style={{ height: '70px', width: '100%' }} />
    </>
  );
};

export default Header;
