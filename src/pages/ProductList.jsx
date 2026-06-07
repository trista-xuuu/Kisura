import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import allProducts from '../data/products.json';

import ProductCard from '../components/ProductCard';

const ProductList = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('ALL');

  const tabs = [...new Set(allProducts.map(p => p.cat))];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category && tabs.includes(category)) {
      setActiveTab(category);
    } else {
      setActiveTab(tabs[0]); // Default to first actual category
    }
  }, [location.search]);

  const collectionContent = {
    '經典系列': [
      {
        id: 1,
        layout: 'left-image',
        title: '雋永設計，傳承經典',
        desc: '以簡約線條與溫潤色澤，展現不盲從潮流的自信品味。每一處細節都經過精心打磨，呈現歲月洗禮後的沈穩與優雅。',
        img: '/banner/crafts_2.png'
      }
    ],
    '羽毛鈦系列': [
      {
        id: 1,
        layout: 'left-image',
        title: '近乎無形的輕盈',
        desc: '採用航太級純鈦金屬打造，大幅減輕鼻樑與耳朵的負擔。配戴一整天也感覺不到重量，讓每一次凝視都成為極致的享受。',
        img: '/banner/feather_2.png'
      }
    ],
    '工藝系列': [
      {
        id: 1,
        layout: 'left-image',
        title: '精密製程，雕琢俐落細節',
        desc: '工藝系列結合高精度加工與先進雷射切割技術，突破傳統材質極限。以科學化的嚴謹態度處理每一個結構，演繹出現代科技與美學完美交融的絕佳質感。',
        img: '/banner/classic_2.png'
      }
    ]
  };

  const collectionBanners = {
    '經典系列': '/banner/crafts_1.png',
    '羽毛鈦系列': '/banner/feather_4.png',
    '工藝系列': '/banner/classic_1.png'
  };

  const filteredProducts = allProducts.filter(p => p.cat === activeTab);

  return (
    <div style={{ backgroundColor: 'var(--color-primary-white)', paddingBottom: '80px' }}>
      
      {/* Full Width Hero */}
      <div style={{ 
        width: '100%', 
        height: 'calc(100dvh - 70px)', 
        backgroundImage: `url(${collectionBanners[activeTab] || collectionBanners['經典系列']})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.15)' }}></div>
        <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#FFFFFF', textAlign: 'center' }}>
           <p className="en-caption fade-in-up" style={{ color: '#FFFFFF', marginBottom: '16px', letterSpacing: '0.2em' }}>COLLECTIONS</p>
           <h1 className="tc-h1 fade-in-up" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{activeTab ? `探索${activeTab}` : '探索系列'}</h1>
        </div>
      </div>

      {/* Editor Description Block */}
      <div style={{ backgroundColor: 'var(--color-primary-white)' }}>
        {collectionContent[activeTab] ? (
          <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
            {collectionContent[activeTab].map((section) => (
              <div 
                key={section.id} 
                className="flex-col-reverse-mobile"
                style={{ 
                  display: 'flex', 
                  flexDirection: section.layout === 'right-image' ? 'row-reverse' : 'row',
                  alignItems: 'center',
                }}
              >
                <div style={{ flex: '1 1 50%', aspectRatio: '4/3', width: '100%' }}>
                  <img 
                    src={section.img} 
                    alt={section.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                  />
                </div>
                <div style={{ flex: '1 1 50%', padding: '40px 8%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h2 className="tc-h2" style={{ color: 'var(--color-g100)', marginBottom: '24px' }}>{section.title}</h2>
                  <p className="tc-body" style={{ color: 'var(--color-g80)', lineHeight: '1.8' }}>{section.desc}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px var(--padding-x)', textAlign: 'center' }}>
            <p className="tc-body" style={{ color: 'var(--color-g80)', lineHeight: '1.8' }}>
              探索 KISURA 精選系列，為您的每一天找到最完美的視野。
            </p>
          </div>
        )}
      </div>

      {/* Related Products Subtitle */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%', padding: '60px var(--padding-x) 32px var(--padding-x)', textAlign: 'center' }}>
        <h2 className="tc-h3" style={{ color: 'var(--color-g100)' }}>相關產品</h2>
      </div>

      {/* Product Grid */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%', padding: '0 var(--padding-x)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '8px' }}>
         {filteredProducts.map(p => (
           <ProductCard key={p.id} product={p} />
         ))}
      </div>
    </div>
  );
};

export default ProductList;

