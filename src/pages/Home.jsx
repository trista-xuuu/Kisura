import React from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import allProducts from '../data/products.json';

const Home = () => {
  return (
    <>
      <HeroSlider />
      
      {/* Category Links - OYOY style minimal text blocks */}
      <div style={{ backgroundColor: 'var(--color-secondary-cream)', padding: '60px var(--padding-x)' }}>
        <div className="container-fluid" style={{ display: 'flex', justifyContent: 'center', gap: '80px', flexWrap: 'wrap' }}>
           <Link to="/#products" className="en-h3" style={{ color: 'var(--color-g100)', letterSpacing: '0.1em' }}>SIGNATURE</Link>
           <Link to="/#products" className="en-h3" style={{ color: 'var(--color-g100)', letterSpacing: '0.1em' }}>CLASSIC</Link>
        </div>
      </div>

      {/* Split Block: Brand Message + Image */}
      <div className="grid-2">
         <div style={{ padding: '10vw var(--padding-x)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p className="en-caption" style={{ color: 'var(--color-accent-earth)', marginBottom: '24px' }}>ABOUT KISURA</p>
            <h2 className="tc-h2" style={{ color: 'var(--color-g100)', marginBottom: '32px' }}>純粹的材質，<br/>純粹的專注。</h2>
            <p className="tc-body" style={{ color: 'var(--color-g80)', marginBottom: '48px', maxWidth: '400px' }}>
              我們看重的是實打實的規格與舒適，省去昂貴的行銷包裝，將所有資源砸在與德日同級的精準製程上。這是一場沒有喧嘩的無聲戰役。
            </p>
            <div>
              <Link to="/stories" className="btn-outline">探索品牌故事</Link>
            </div>
         </div>
         <div style={{ height: '800px', backgroundImage: 'url(/model/Gemini_Generated_Image_ewldubewldubewld.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
      </div>

      {/* Editorial Grid: Collections */}
      <div id="products" style={{ padding: '120px var(--padding-x)', backgroundColor: 'var(--color-primary-white)' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 className="tc-h2" style={{ color: 'var(--color-g100)', marginBottom: '16px' }}>探索系列</h2>
          <p className="tc-body" style={{ color: 'var(--color-g60)' }}>100% 純鈦，非合金，材質純度可驗證</p>
        </div>
        
        <div className="grid-1-mobile" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2px', backgroundColor: 'var(--color-g20)', border: '1px solid var(--color-g20)' }}>
           {Array.from(new Set(allProducts.map(p => p.cat))).map(catName => {
             let img = '';
             if (catName === '經典系列') {
               img = '/product/Gemini_Generated_Image_5qibzy5qibzy5qib.png';
             } else if (catName === '羽毛鈦系列') {
               img = '/product/Gemini_Generated_Image_cnm2a9cnm2a9cnm2.png';
             } else {
               const prod = allProducts.find(p => p.cat === catName);
               img = prod ? prod.colors[0].img : '';
             }
             return { name: catName, img: img, link: `/products?category=${catName}` };
           }).map((cat, idx) => (
             <Link to={cat.link} key={idx} style={{ backgroundColor: 'var(--color-primary-white)', display: 'block', position: 'relative', overflow: 'hidden' }}>
               <div style={{ position: 'relative', paddingTop: '120%' }}>
                  <img src={cat.img} alt={cat.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1s ease' }} 
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                  {/* 15% 黑色遮罩 */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.15)', pointerEvents: 'none' }}></div>
               </div>
               <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                 <h3 className="tc-h2" style={{ color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.3)', letterSpacing: '0.1em', fontWeight: 500 }}>{cat.name}</h3>
               </div>
             </Link>
           ))}
        </div>
      </div>

      {/* Full Width Image Banner for Craftsmanship */}
      <div style={{ position: 'relative', height: '80vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
         <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'url(/context/Gemini_Generated_Image_a66b23a66b23a66b.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.9 }}></div>
         <div style={{ position: 'relative', zIndex: 1, backgroundColor: 'rgba(255,255,255,0.95)', padding: '80px 60px', textAlign: 'center', maxWidth: '600px' }}>
            <h2 className="tc-h2" style={{ color: 'var(--color-g100)', marginBottom: '24px' }}>職人共感，純粹的專注</h2>
            <p className="tc-body" style={{ color: 'var(--color-g80)', marginBottom: '40px' }}>
              這份在無聲中承載重量的安穩感，正契合了 KISURA 純鈦工藝的設計語彙：「以極致的輕盈，支撐起最堅定的目光。」
            </p>
            <Link to="/stories" className="btn-primary">閱讀故事</Link>
         </div>
      </div>
    </>
  );
};

export default Home;
