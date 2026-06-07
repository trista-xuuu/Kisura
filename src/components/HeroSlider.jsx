import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const HeroSlider = () => {
  const slides = [
    {
      image: '/index/index_14.png',
      title: '心無旁騖，只做自己',
      subtitle: 'NOTHING IN THE WAY',
      link: '/explore'
    },
    {
      image: '/index/index_2.png',
      title: '極致輕盈，專注當下',
      subtitle: 'PURE AND PRECISE',
      link: '/explore'
    },
    {
      image: '/index/index_1.png',
      title: '頂級純鈦的體感',
      subtitle: 'CRAFTED WITH INTENT',
      link: '/explore'
    }
  ];

  return (
    <div style={{ height: 'calc(100dvh - 70px)', minHeight: '400px', width: '100%' }}>
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        speed={1500}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        style={{ height: '100%', width: '100%' }}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx} style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              {/* 完整圖片不變淡 */}
              <img 
                src={slide.image} 
                alt={slide.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* 15% 黑色遮罩 */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.15)' }}></div>
              
              <div style={{ 
                position: 'absolute', 
                top: '50%',
                transform: 'translateY(-50%)',
                left: 'var(--padding-x)', 
                color: '#FFFFFF'
              }}>
                <p className="en-h5 fade-in-up" style={{ marginBottom: '16px', letterSpacing: '0.2em' }}>{slide.subtitle}</p>
                <h2 className="tc-h1 fade-in-up" style={{ animationDelay: '0.2s', marginBottom: '32px', color: '#FFF' }}>{slide.title}</h2>
                <div className="fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <Link to={slide.link} className="btn-primary" style={{ backgroundColor: '#FFFFFF', color: '#000000', padding: '16px 40px', textDecoration: 'none' }}>探索產品</Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <style>{`
        .swiper-pagination-bullet { background: var(--color-primary-white); opacity: 0.5; width: 10px; height: 10px; }
        .swiper-pagination-bullet-active { opacity: 1; transform: scale(1.2); }
      `}</style>
    </div>
  );
};

export default HeroSlider;
