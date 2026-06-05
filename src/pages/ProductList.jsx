import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import allProducts from '../data/products.json';

const ProductCard = ({ product }) => {
  const defaultColor = product.colors ? product.colors[0] : null;
  const [activeColor, setActiveColor] = useState(defaultColor);

  const displayImg = activeColor ? activeColor.img : (product.colors && product.colors.length > 0 ? product.colors[0].img : '');

  return (
    <div style={{ backgroundColor: 'var(--color-primary-white)', display: 'block' }}>
      <Link to={`/product/${product.id}`} style={{ display: 'block' }}>
        <div style={{ position: 'relative', overflow: 'hidden', paddingTop: '100%', backgroundColor: '#fcf7ed' }}>
            <img src={displayImg} alt={product.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', padding: '24px', transition: 'transform 1s ease' }} 
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
        </div>
      </Link>
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 className="tc-h3" style={{ color: 'var(--color-g100)', marginBottom: product.colors ? '16px' : '0' }}>{product.name}</h3>
        </Link>
        {product.colors && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            {product.colors.map(color => (
              <button
                key={color.id}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveColor(color);
                }}
                style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  backgroundColor: color.hex,
                  border: activeColor && activeColor.id === color.id ? '2px solid var(--color-g100)' : '1px solid var(--color-g40)',
                  outline: activeColor && activeColor.id === color.id ? '2px solid var(--color-primary-white)' : 'none',
                  outlineOffset: '-3px',
                  cursor: 'pointer',
                  padding: 0
                }}
                aria-label={color.name}
                title={color.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProductList = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      setActiveTab(category);
    } else {
      setActiveTab('ALL');
    }
  }, [location.search]);

  const tabs = ['ALL', ...new Set(allProducts.map(p => p.cat))];

  const filteredProducts = activeTab === 'ALL' ? allProducts : allProducts.filter(p => p.cat === activeTab);

  return (
    <div style={{ backgroundColor: 'var(--color-primary-white)', paddingBottom: '120px' }}>
      <div style={{ padding: '80px var(--padding-x)', textAlign: 'center', backgroundColor: 'var(--color-g10)' }}>
        <h1 className="tc-h1" style={{ color: 'var(--color-g100)', marginBottom: '16px' }}>探索系列</h1>
        <p className="en-h3" style={{ color: 'var(--color-g60)', letterSpacing: '0.1em' }}>PRODUCTS</p>
      </div>

      {/* Tabs */}
      <div className="gap-mobile-16" style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '40px 0', borderBottom: '1px solid var(--color-g20)', flexWrap: 'wrap' }}>
         {tabs.map(tab => (
           <button 
             key={tab} 
             onClick={() => setActiveTab(tab)}
             style={{ 
               fontSize: '15px',
               color: activeTab === tab ? 'var(--color-g100)' : 'var(--color-g60)',
               borderBottom: activeTab === tab ? '2px solid var(--color-g100)' : '2px solid transparent',
               paddingBottom: '8px',
               transition: 'all 0.3s ease'
             }}
           >
             {tab}
           </button>
         ))}
      </div>

      {/* Product Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2px', backgroundColor: 'var(--color-g20)' }}>
         {filteredProducts.map(p => (
           <ProductCard key={p.id} product={p} />
         ))}
      </div>
    </div>
  );
};

export default ProductList;

