import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import allProducts from '../data/products.json';

import ProductCard from '../components/ProductCard';

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
    <div style={{ backgroundColor: 'var(--color-g10)', paddingBottom: '120px', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '80px var(--padding-x)', textAlign: 'center', backgroundColor: 'var(--color-g10)' }}>
        <p className="en-caption" style={{ color: 'var(--color-g80)', marginBottom: '16px', letterSpacing: '0.2em' }}>COLLECTIONS</p>
        <h1 className="tc-h1" style={{ color: 'var(--color-g100)', marginBottom: '16px' }}>探索系列</h1>
      </div>

      {/* Tabs */}
      <div className="gap-mobile-16" style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '40px 0', borderBottom: '1px solid var(--color-g20)', flexWrap: 'wrap', backgroundColor: 'var(--color-primary-white)' }}>
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
      <div style={{ padding: '0 var(--padding-x)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '40px' }}>
         {filteredProducts.map(p => (
           <ProductCard key={p.id} product={p} />
         ))}
      </div>
    </div>
  );
};

export default ProductList;

