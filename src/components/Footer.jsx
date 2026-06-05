import React from 'react';
import { Link } from 'react-router-dom';
import allProducts from '../data/products.json';

const Footer = () => {
  const categories = Array.from(new Set(allProducts.map(p => p.cat)));

  return (
    <footer className="p-mobile" style={{ 
      backgroundColor: 'var(--color-g10)', 
      padding: '100px 5vw 40px',
      color: 'var(--color-g100)'
    }}>
      <div className="container" style={{ padding: 0 }}>
        <div className="grid-1-mobile gap-mobile-24" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '60px', marginBottom: '80px' }}>
          {/* Column 1: Logo & Vision */}
          <div>
            <img src="/logo/logo_1.svg" alt="KISURA" style={{ height: '30px', display: 'block', marginBottom: '24px' }} />
            <p className="tc-body" style={{ color: 'var(--color-g80)', marginBottom: '24px' }}>
              心無旁騖，只做自己。<br/>
              堅持的信念，給與堅持的人，完成堅持的事。
            </p>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h4 className="en-caption" style={{ marginBottom: '24px', color: 'var(--color-g100)' }}>SHOP</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li><Link to="/products?category=ALL" className="tc-body" style={{ color: 'var(--color-g80)' }}>所有系列</Link></li>
              {categories.map(cat => (
                <li key={cat}><Link to={`/products?category=${cat}`} className="tc-body" style={{ color: 'var(--color-g80)' }}>{cat}</Link></li>
              ))}
            </ul>
          </div>

          {/* Column 3: Explore */}
          <div>
            <h4 className="en-caption" style={{ marginBottom: '24px', color: 'var(--color-g100)' }}>EXPLORE</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li><Link to="/story" className="tc-body" style={{ color: 'var(--color-g80)' }}>品牌故事</Link></li>
              <li><Link to="/stories" className="tc-body" style={{ color: 'var(--color-g80)' }}>眼鏡故事</Link></li>
              <li><Link to="/stores" className="tc-body" style={{ color: 'var(--color-g80)' }}>合作通路</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="en-caption" style={{ marginBottom: '24px', color: 'var(--color-g100)' }}>NEWSLETTER</h4>
            <p className="tc-body" style={{ color: 'var(--color-g80)', marginBottom: '16px' }}>訂閱電子報，獲取最新純鈦工藝資訊與專屬活動。</p>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--color-g100)' }}>
              <input type="email" placeholder="您的電子信箱" style={{ 
                flex: 1, border: 'none', background: 'transparent', padding: '12px 0', 
                fontFamily: 'var(--font-tc-body)', outline: 'none', color: 'var(--color-g100)' 
              }} />
              <button style={{ padding: '0 16px', color: 'var(--color-g100)' }}>➔</button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex-col-mobile text-center-mobile" style={{ 
          borderTop: '1px solid var(--color-g30)', 
          paddingTop: '32px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center' 
        }}>
          <p className="en-label" style={{ color: 'var(--color-g60)' }}>
            NOTHING IN THE WAY. EVERYTHING IN YOU.
          </p>
          <p className="tc-caption" style={{ color: 'var(--color-g60)' }}>
            © 2026 KISURA EYEWEAR.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
