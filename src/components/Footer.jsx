import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, InstagramLogo, FacebookLogo } from '@phosphor-icons/react';
import allProducts from '../data/products.json';

const Footer = () => {
  const categories = Array.from(new Set(allProducts.map(p => p.cat)));

  return (
    <footer style={{ 
      backgroundColor: 'var(--color-g10)', 
      padding: '64px var(--padding-x) 28px',
      color: 'var(--color-g100)'
    }}>
      <div className="container" style={{ padding: 0 }}>
        <div className="flex-col-mobile gap-mobile-24" style={{ display: 'flex', flexWrap: 'wrap', gap: '60px', marginBottom: '20px' }}>
          {/* Column 1: Logo & Vision */}
          <div style={{ marginRight: 'auto', minWidth: '200px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <img src="/logo/logo_1.svg" alt="KISURA" style={{ height: '45px', display: 'block', marginBottom: '36px' }} />
            <p className="tc-body" style={{ color: 'var(--color-g80)', marginBottom: '24px' }}>
              堅持的信念，給與堅持的人，完成堅持的事。
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: 'auto' }}>
              <a href="#" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-g80)' }} aria-label="Instagram">
                <InstagramLogo size={24} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-g80)' }} aria-label="Facebook">
                <FacebookLogo size={24} />
              </a>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div className="hide-mobile" style={{ minWidth: '120px', marginBottom: '60px' }}>
            <h4 className="en-caption" style={{ margin: '0 0 24px 0', color: 'var(--color-g100)' }}>SHOP</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li><Link to="/explore" className="tc-body" style={{ color: 'var(--color-g80)' }}>探索產品</Link></li>
              <li><Link to="/explore?gender=men" className="tc-body" style={{ color: 'var(--color-g80)' }}>男士框</Link></li>
              <li><Link to="/explore?gender=women" className="tc-body" style={{ color: 'var(--color-g80)' }}>女士框</Link></li>
            </ul>
          </div>

          {/* Column 3: Explore */}
          <div className="hide-mobile" style={{ minWidth: '120px', marginBottom: '60px' }}>
            <h4 className="en-caption" style={{ margin: '0 0 24px 0', color: 'var(--color-g100)' }}>EXPLORE</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li><Link to="/products" className="tc-body" style={{ color: 'var(--color-g80)' }}>探索系列</Link></li>
              <li><Link to="/stories" className="tc-body" style={{ color: 'var(--color-g80)' }}>探索故事</Link></li>
              <li><Link to="/stores" className="tc-body" style={{ color: 'var(--color-g80)' }}>合作通路</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex-col-mobile align-start-mobile" style={{ 
          borderTop: '1px solid var(--color-g30)', 
          paddingTop: '28px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center' 
        }}>
          <p className="tc-caption" style={{ color: 'var(--color-g80)' }}>
            NOTHING IN THE WAY. EVERYTHING IN YOU.
          </p>
          <p className="tc-caption" style={{ color: 'var(--color-g80)' }}>
            © 2026 KISURA EYEWEAR.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
