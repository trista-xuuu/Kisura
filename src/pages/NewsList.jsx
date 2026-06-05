import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NewsList = () => {
  const [activeTab, setActiveTab] = useState('ALL');

  const tabs = ['ALL', '優惠活動', '最新公告'];

  const allNews = [
    // 優惠活動 (8 items)
    { id: 1, date: '2026.04.15', title: '職人共感企劃：尋找專注的目光', category: '優惠活動', img: '/model/Gemini_Generated_Image_3fqmay3fqmay3fqm.png' },
    { id: 2, date: '2026.01.05', title: '春季限定：免費驗光與鏡框保養服務', category: '優惠活動', img: '/product/Gemini_Generated_Image_fl9q6vfl9q6vfl9q.png' },
    { id: 3, date: '2025.12.10', title: '年終感恩回饋：純鈦系列第二件 8 折', category: '優惠活動', img: '/context/Gemini_Generated_Image_a66b23a66b23a66b.png' },
    { id: 4, date: '2025.10.20', title: '秋季新品體驗會：預約即享專屬折扣', category: '優惠活動', img: '/product/Gemini_Generated_Image_cnm2a9cnm2a9cnm2.png' },
    { id: 5, date: '2025.08.08', title: '父親節特獻：為父親挑選完美的輕盈', category: '優惠活動', img: '/model/Gemini_Generated_Image_agavyjagavyjagav.png' },
    { id: 6, date: '2025.05.12', title: '母親節專屬：限量香檳金鏡框發售', category: '優惠活動', img: '/product/Gemini_Generated_Image_orjcv2orjcv2orjc.png' },
    { id: 7, date: '2025.02.14', title: '情人節雙人同行優惠專案', category: '優惠活動', img: '/context/Gemini_Generated_Image_dd4vemdd4vemdd4v.png' },
    { id: 8, date: '2025.01.01', title: '新年新視界：舊換新折抵活動', category: '優惠活動', img: '/context/Gemini_Generated_Image_qibgumqibgumqibg.png' },

    // 最新公告 (8 items)
    { id: 9, date: '2026.05.20', title: '全新「羽毛鈦 Signature」系列上市', category: '最新公告', img: '/context/Gemini_Generated_Image_a66b23a66b23a66b.png' },
    { id: 10, date: '2026.03.10', title: '台北松菸快閃體驗店限時開幕', category: '最新公告', img: '/context/Gemini_Generated_Image_dd4vemdd4vemdd4v.png' },
    { id: 11, date: '2026.02.01', title: '品牌視覺識別系統 (VIS) 全面更新', category: '最新公告', img: '/model/Gemini_Generated_Image_3fqmay3fqmay3fqm.png' },
    { id: 12, date: '2025.11.15', title: 'KISURA 中部體驗所正式營運', category: '最新公告', img: '/context/Gemini_Generated_Image_lj9431lj9431lj94.png' },
    { id: 13, date: '2025.09.30', title: '榮獲 2025 台灣卓越設計獎', category: '最新公告', img: '/context/Gemini_Generated_Image_hotc41hotc41hotc.png' },
    { id: 14, date: '2025.07.22', title: '純鈦製程技術再升級：無螺絲鉸鏈導入', category: '最新公告', img: '/product/Gemini_Generated_Image_fl9q6vfl9q6vfl9q.png' },
    { id: 15, date: '2025.04.18', title: '攜手德國蔡司：頂級鏡片合作計畫', category: '最新公告', img: '/context/Gemini_Generated_Image_a66b23a66b23a66b.png' },
    { id: 16, date: '2025.03.01', title: '官方網站 V4 全新改版上線', category: '最新公告', img: '/product/Gemini_Generated_Image_cnm2a9cnm2a9cnm2.png' }
  ];

  const filteredNews = activeTab === 'ALL' ? allNews : allNews.filter(n => n.category === activeTab);

  return (
    <div style={{ backgroundColor: 'var(--color-primary-white)', paddingBottom: '120px' }}>
      <div style={{ padding: '80px var(--padding-x)', textAlign: 'center', backgroundColor: 'var(--color-g10)' }}>
        <h1 className="tc-h1" style={{ color: 'var(--color-g100)', marginBottom: '16px' }}>最新消息</h1>
        <p className="en-h3" style={{ color: 'var(--color-g60)', letterSpacing: '0.1em' }}>JOURNAL & NEWS</p>
      </div>

      {/* Tabs */}
      <div className="gap-mobile-16" style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '40px 0', borderBottom: '1px solid var(--color-g20)', marginBottom: '60px', flexWrap: 'wrap' }}>
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

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px 40px' }}>
          {filteredNews.map(item => (
            <Link to={`/news/${item.id}`} key={item.id} style={{ display: 'block', group: 'true' }}>
              <div style={{ overflow: 'hidden', marginBottom: '24px' }}>
                 <img src={item.img} alt={item.title} style={{ width: '100%', height: '300px', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                 onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                 onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                 <p className="en-caption" style={{ color: 'var(--color-accent-earth)' }}>{item.category}</p>
                 <span className="mono" style={{ color: 'var(--color-g60)' }}>{item.date}</span>
              </div>
              <h2 className="tc-h3" style={{ color: 'var(--color-g100)' }}>{item.title}</h2>
            </Link>
          ))}
        </div>
        {filteredNews.length === 0 && (
          <p className="tc-body" style={{ textAlign: 'center', color: 'var(--color-g60)', marginTop: '40px' }}>此分類目前沒有最新消息。</p>
        )}
      </div>
    </div>
  );
};

export default NewsList;
