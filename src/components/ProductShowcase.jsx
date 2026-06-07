import React from 'react';
import { Link } from 'react-router-dom';

const ProductShowcase = () => {
  const products = [
    {
      id: 1,
      name: '羽毛鈦 Signature 系列',
      desc: '復古琥珀色板料與 100% 純鈦金屬完美融合，達成完美的配戴平衡。',
      img: '/product/Gemini_Generated_Image_5qibzy5qibzy5qib.png'
    },
    {
      id: 2,
      name: '極簡 Geometric 系列',
      desc: '以極簡線條勾勒出幾何框型，展現現代知識型工作者的俐落感。',
      img: '/product/Gemini_Generated_Image_cnm2a9cnm2a9cnm2.png'
    },
    {
      id: 3,
      name: '經典 Classic 鈦',
      desc: '百搭框型，去蕪存菁的設計，是陪伴您每一場無聲戰役的最佳戰友。',
      img: '/product/Gemini_Generated_Image_fl9q6vfl9q6vfl9q.png'
    }
  ];

  return (
    <section id="products" style={{ backgroundColor: 'var(--color-secondary-cream)', padding: '120px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 className="tc-h2" style={{ color: 'var(--color-g100)', marginBottom: '20px' }}>純鈦系列</h2>
          <p className="tc-body" style={{ color: 'var(--color-g80)' }}>所有產品均採用 100% 純鈦，非合金，材質純度可驗證。</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          {products.map(p => (
            <Link to={`/product/${p.id}`} key={p.id} style={{ 
              display: 'block',
              backgroundColor: 'var(--color-primary-white)', 
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
            }}
            >
              <div style={{ width: '100%', height: '300px', overflow: 'hidden' }}>
                <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
              <div style={{ padding: '32px' }}>
                <h3 className="tc-h5" style={{ marginBottom: '12px', color: 'var(--color-g100)' }}>{p.name}</h3>
                <p className="tc-body" style={{ color: 'var(--color-g80)' }}>{p.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
