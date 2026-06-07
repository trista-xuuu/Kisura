import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import allStories from '../data/stories.json';
import allProducts from '../data/products.json';

const StoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const story = allStories.find(s => s.id === parseInt(id, 10));

  useEffect(() => {
    if (!story) {
      navigate('/stories');
    }
  }, [story, navigate]);

  if (!story) return null;

  const recommendedProduct = story.recommendedProductId 
    ? allProducts.find(p => p.id === story.recommendedProductId)
    : null;

  let recommendedColor = recommendedProduct?.colors?.[0];
  if (recommendedProduct && story.recommendedProductColor) {
    const matchedColor = recommendedProduct.colors.find(c => c.name === story.recommendedProductColor);
    if (matchedColor) {
      recommendedColor = matchedColor;
    }
  }

  // Get 3 related stories from the same category
  const relatedStories = allStories
    .filter(s => s.category === story.category && s.id !== story.id)
    .slice(0, 3);

  return (
    <div style={{ backgroundColor: 'var(--color-primary-white)', position: 'relative' }}>

      {/* Editorial Split Header */}
      <div className="grid-2" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
         <div className="story-hero-img" style={{ flex: '1 1 50%', minWidth: '300px', backgroundImage: `url(${story.img})`, backgroundSize: 'cover', backgroundPosition: 'center', aspectRatio: '4/3' }}></div>
         <div className="mobile-order-first" style={{ flex: '1 1 50%', minWidth: '300px', padding: 'max(80px, 10vw) var(--padding-x)', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'var(--color-g10)', position: 'relative' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
              <button onClick={() => navigate('/stories?category=' + encodeURIComponent(story.category))} style={{ position: 'absolute', top: '24px', right: 'var(--padding-x)', zIndex: 10, display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 0', fontSize: '14px', color: 'var(--color-g80)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                <ArrowLeft size={16} /> 返回列表
              </button>
              <p className="tc-body" style={{ color: 'var(--color-g80)', marginBottom: '16px', letterSpacing: '0.1em' }}>{story.category}</p>
              <h1 className="tc-h1" style={{ color: 'var(--color-g100)', marginBottom: '20px', lineHeight: 1.4 }}>
                {story.title}
              </h1>
            </div>
         </div>
      </div>

      {/* Article Content */}
      <div className="container" style={{ padding: 'var(--spacing-section-y) var(--padding-x)', maxWidth: '800px', margin: '0 auto' }}>
        
        {story.paragraphs.map((p, idx) => {
          // Put the quote in the middle (e.g. after the first paragraph)
          if (idx === 1 && story.quote) {
            return (
              <React.Fragment key={idx}>
                <blockquote style={{ 
                  borderLeft: '4px solid var(--color-accent-earth)', 
                  paddingLeft: '32px', 
                  margin: '40px 0',
                }}>
                  <p className="tc-h2" style={{ color: 'var(--color-g80)', lineHeight: 1.5, margin: 0 }}>
                    「{story.quote}」
                  </p>
                </blockquote>
                <p className="tc-body" style={{ color: 'var(--color-g80)', marginBottom: '32px', fontSize: '16px' }}>
                  {p}
                </p>
              </React.Fragment>
            );
          }
          return (
            <p key={idx} className="tc-body" style={{ color: 'var(--color-g80)', marginBottom: '32px', fontSize: '16px' }}>
              {p}
            </p>
          );
        })}

        {/* Hashtags */}
        {story.hashtags && story.hashtags.length > 0 && (
          <div style={{ marginTop: '40px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {story.hashtags.map(tag => (
              <Link 
                key={tag} 
                to={`/stories?tag=${encodeURIComponent(tag)}`}
                style={{
                  backgroundColor: 'var(--color-g10)',
                  color: 'var(--color-g80)',
                  padding: '8px 16px',
                  fontSize: '14px',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = 'var(--color-g20)'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'var(--color-g10)'}
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Product Recommendation Block */}
        {story.category === '職人故事' && recommendedProduct && recommendedColor && (
          <div style={{ marginTop: 'var(--spacing-section-y)', padding: '60px', backgroundColor: 'var(--color-g10)', textAlign: 'center', borderRadius: '8px' }}>
            <p className="tc-body" style={{ color: 'var(--color-g80)', marginBottom: '24px', letterSpacing: '0.1em' }}>相關產品</p>
            <h4 className="tc-h4" style={{ color: 'var(--color-g100)', marginBottom: '16px' }}>{recommendedProduct.cat} - {recommendedProduct.name} ({recommendedColor.name})</h4>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
              <img src={recommendedColor.img} alt={`${recommendedProduct.name} ${recommendedColor.name}`} style={{ width: '100%', maxWidth: '300px', objectFit: 'contain' }} />
            </div>
            <Link to={`/product/${recommendedProduct.id}?color=${recommendedColor.name}`} className="btn-primary" style={{ padding: '12px 40px' }}>
              探索此鏡框細節
            </Link>
          </div>
        )}

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <Link to={`/stories?category=${encodeURIComponent(story.category)}`} className="btn-outline">返回列表</Link>
        </div>
      </div>

      {/* You Might Also Like */}
      {relatedStories.length > 0 && (
        <div style={{ backgroundColor: 'var(--color-g10)', padding: '80px 0 40px 0' }}>
          <h3 className="tc-h2" style={{ color: 'var(--color-g100)', marginBottom: '20px', textAlign: 'center' }}>
            你可能喜歡
          </h3>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--padding-x)' }}>
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
              {relatedStories.map(related => (
                <SwiperSlide key={related.id}>
                  <Link to={`/stories/${related.id}`} className="story-card" style={{ display: 'block', backgroundColor: 'var(--color-primary-white)' }}>
                    <div className="img-container">
                      <div className="img-bg" style={{ backgroundImage: `url(${related.img})` }}></div>
                    </div>
                    <p className="tc-body" style={{ color: 'var(--color-g80)', marginBottom: '12px', fontSize: '14px', letterSpacing: '0.1em' }}>
                      {related.category}
                    </p>
                    <h4 className="tc-h5" style={{ color: 'var(--color-g100)', marginBottom: '16px' }}>{related.title}</h4>
                    <p className="tc-body" style={{ 
                      color: 'var(--color-g80)', 
                      fontSize: '14px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      margin: 0
                    }}>
                      {related.paragraphs && related.paragraphs[0]}
                    </p>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
            <style>{`
              .swiper-button-next, .swiper-button-prev { color: var(--color-g100); }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryDetail;
