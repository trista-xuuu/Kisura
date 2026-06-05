import React from 'react';
import { useParams, Link } from 'react-router-dom';

const NewsDetail = () => {
  const { id } = useParams();

  const relatedNews = [
    { id: 2, date: '2026.04.15', title: '職人共感企劃：尋找專注的目光', category: '優惠活動', img: '/model/Gemini_Generated_Image_3fqmay3fqmay3fqm.png' },
    { id: 3, date: '2026.03.10', title: '台北松菸快閃體驗店限時開幕', category: '最新公告', img: '/context/Gemini_Generated_Image_dd4vemdd4vemdd4v.png' }
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-primary-white)' }}>
      
      {/* Article Header */}
      <div className="container" style={{ paddingTop: '100px', paddingBottom: '60px', maxWidth: '1000px', textAlign: 'center' }}>
        <p className="en-caption" style={{ color: 'var(--color-accent-earth)', marginBottom: '24px' }}>最新公告</p>
        <h1 className="tc-h1" style={{ marginBottom: '24px', color: 'var(--color-g100)' }}>全新「羽毛鈦 Signature」系列上市</h1>
        <p className="mono" style={{ color: 'var(--color-g60)' }}>2026.05.20</p>
      </div>

      {/* Hero Image */}
      <div style={{ width: '100%', height: '70vh', backgroundImage: 'url(/context/Gemini_Generated_Image_a66b23a66b23a66b.png)', backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: '80px' }}></div>

      {/* Editor Content Area (Rich Text) */}
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '120px' }}>
        <p className="tc-body" style={{ color: 'var(--color-g80)', marginBottom: '32px', fontSize: '16px' }}>
          清晨的光線在細緻的金屬鏡腳表面留下一道冷冽而優雅的光澤。全新上市的羽毛鈦眼鏡，將復古的琥珀色板料與 100% 純鈦金屬完美融合。
        </p>
        
        <h2 className="tc-h2" style={{ color: 'var(--color-g100)', marginTop: '48px', marginBottom: '24px' }}>實打實的規格升級</h2>
        <p className="tc-body" style={{ color: 'var(--color-g80)', marginBottom: '40px', fontSize: '16px' }}>
          做為 KISURA 2026 年度的重點系列，Signature 羽毛鈦在結構上做了許多看不到但感受得到的升級。包含了重新設計的無螺絲鉸鏈，以及針對亞洲人臉型進行 3D 掃描後微調的鏡框弧度。這一切，只為成就您眼前的清晰。
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', backgroundColor: 'var(--color-g20)', marginBottom: '60px' }}>
           <img src="/product/Gemini_Generated_Image_cnm2a9cnm2a9cnm2.png" style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
           <img src="/product/Gemini_Generated_Image_fl9q6vfl9q6vfl9q.png" style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
        </div>

        <p className="tc-body" style={{ color: 'var(--color-g80)', marginBottom: '80px', fontSize: '16px' }}>
          目前全系列已於全台合作通路上架。歡迎前往實體店面預約試戴，親自感受這份專屬於您的頂級輕盈。
        </p>

        <div style={{ textAlign: 'center' }}>
          <Link to="/news" className="btn-outline">返回列表</Link>
        </div>
      </div>

      {/* Related News */}
      <div style={{ backgroundColor: 'var(--color-g10)', padding: '100px var(--padding-x)' }}>
         <h2 className="tc-h2" style={{ color: 'var(--color-g100)', marginBottom: '40px', textAlign: 'center' }}>你可能也會喜歡</h2>
         <div className="container" style={{ maxWidth: '1000px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
              {relatedNews.map(item => (
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
                  <h3 className="tc-h3" style={{ color: 'var(--color-g100)' }}>{item.title}</h3>
                </Link>
              ))}
            </div>
         </div>
      </div>

    </div>
  );
};

export default NewsDetail;
