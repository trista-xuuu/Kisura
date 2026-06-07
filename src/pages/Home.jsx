import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';
import allProducts from '../data/products.json';

const Home = () => {
  const topProducts = allProducts.slice(0, 5);

  return (
    <>
      <HeroSlider />
      


      {/* Split Block: Brand Message + Image */}
      <div className="grid-2">
         <div className="text-block-padding" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p className="en-caption" style={{ color: 'var(--color-g80)', marginBottom: '16px' }}>ABOUT KISURA</p>
            <h2 className="tc-h2" style={{ color: 'var(--color-g100)', marginBottom: '20px' }}>用理性的純鈦，溫柔承載你感性的視界故事</h2>
            <p className="tc-body" style={{ color: 'var(--color-g80)', marginBottom: '28px' }}>
              KISURA 專注於極輕、抗敏的純鈦工藝。我們不盲目追求快時尚，而是依據當代工作者的生活型態進行框型微調與迭代。
            </p>
            <div>
              <Link to="/story" className="btn-outline">探索品牌故事</Link>
            </div>
         </div>
         <div className="proportional-img-mobile" style={{ height: 'calc(100vh - 74px)', minHeight: '400px', backgroundImage: 'url(/index/index_13.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
      </div>

      {/* Split Block: AI Recommendation (Left Image, Right Text) */}
      <div className="grid-2 grid-reverse-mobile">
         <div className="proportional-img-mobile" style={{ height: 'calc(100vh - 74px)', minHeight: '400px', backgroundImage: 'url(/index_9.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
         <div className="text-block-padding" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p className="en-caption" style={{ color: 'var(--color-g80)', marginBottom: '16px' }}>AI RECOMMENDATION</p>
            <h2 className="tc-h2" style={{ color: 'var(--color-g100)', marginBottom: '20px' }}>不知道哪副眼鏡最適合我？</h2>
            <p className="tc-body" style={{ color: 'var(--color-g80)', marginBottom: '28px' }}>
              透過 AI 臉部解析技術，為你精準辨識臉型與膚色，從眾多款式中一鍵挑選最能修飾你臉部線條的專屬鏡框。
            </p>
            <div>
              <Link to="/recommend" className="btn-outline">體驗 AI 專屬推薦</Link>
            </div>
         </div>
      </div>

      {/* New Products Slider */}
      <div style={{ padding: 'var(--spacing-section-y) var(--padding-x) 0 var(--padding-x)', backgroundColor: 'var(--color-primary-white)' }}>
        <div className="explore-header-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '20px' }}>
          <h2 className="tc-h2" style={{ color: 'var(--color-g100)', margin: 0 }}>探索全新產品</h2>
        </div>
        
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={8}
          slidesPerView={'auto'}
          centeredSlides={true}
          className="product-swiper"
          breakpoints={{
            768: { slidesPerView: 3, centeredSlides: false }
          }}
          style={{ paddingBottom: '20px' }}
        >
          {topProducts.map((prod, idx) => (
            <SwiperSlide key={idx}>
              <ProductCard product={prod} />
            </SwiperSlide>
          ))}
        </Swiper>
        <style>{`
          .swiper-button-next, .swiper-button-prev { color: var(--color-g100); }
        `}</style>
      </div>

      {/* Editorial Grid: Collections */}
      <div id="products" style={{ padding: 'var(--spacing-section-y) var(--padding-x)', backgroundColor: 'var(--color-primary-white)' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="tc-h2" style={{ color: 'var(--color-g100)', marginBottom: '20px' }}>探索系列</h2>
          <p className="tc-body" style={{ color: 'var(--color-g80)' }}>100% 純鈦，非合金，材質純度可驗證</p>
        </div>
        
        <div className="grid-1-mobile" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2px', backgroundColor: 'var(--color-g20)', border: '1px solid var(--color-g20)' }}>
           {Array.from(new Set(allProducts.map(p => p.cat))).map(catName => {
             let img = '';
             if (catName === '經典系列') {
               img = '/index/index_7.png';
             } else if (catName === '羽毛鈦系列') {
               img = '/index/index_5.png';
             } else if (catName === '工藝系列') {
               img = '/index/index_4.png';
             } else {
               const prod = allProducts.find(p => p.cat === catName);
               img = prod ? prod.colors[0].img : '';
             }
             return { name: catName, img: img, link: `/products?category=${catName}` };
           }).map((cat, idx) => (
             <Link to={cat.link} key={idx} style={{ backgroundColor: 'var(--color-primary-white)', display: 'block', position: 'relative', overflow: 'hidden' }}
               onMouseEnter={e => {
                 const img = e.currentTarget.querySelector('img');
                 const overlay = e.currentTarget.querySelector('.overlay');
                 if(img) img.style.transform = 'scale(1.03)';
                 if(overlay) overlay.style.backgroundColor = 'rgba(0,0,0,0.15)';
               }}
               onMouseLeave={e => {
                 const img = e.currentTarget.querySelector('img');
                 const overlay = e.currentTarget.querySelector('.overlay');
                 if(img) img.style.transform = 'scale(1)';
                 if(overlay) overlay.style.backgroundColor = 'rgba(0,0,0,0.25)';
               }}
             >
               <div style={{ position: 'relative', paddingTop: '120%' }}>
                  <img src={cat.img} alt={cat.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1s ease' }} />
                  <div className="overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.25)', pointerEvents: 'none', transition: 'background-color 1s ease' }}></div>
               </div>
               <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                 <h3 className="tc-h2" style={{ color: '#FFFFFF', letterSpacing: '0.1em' }}>{cat.name}</h3>
               </div>
             </Link>
           ))}
        </div>

      </div>

      {/* Full Width Image Banner for Stores */}
      <div style={{ position: 'relative', height: '80vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
         <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'url(/context/Context_4.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
         <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.15)' }}></div>
         <div style={{ position: 'relative', zIndex: 1, padding: '80px 60px', textAlign: 'center', maxWidth: '600px' }}>
            <h2 className="tc-h2" style={{ color: '#FFFFFF', marginBottom: '20px' }}>找到最近的商店</h2>
            <Link to="/stores" className="btn-primary" style={{ backgroundColor: '#FFFFFF', color: 'var(--color-g100)', display: 'inline-block' }}>經銷通路</Link>
         </div>
      </div>
    </>
  );
};

export default Home;
