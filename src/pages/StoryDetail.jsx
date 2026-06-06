import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';
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
      <button onClick={() => navigate('/stories?category=' + encodeURIComponent(story.category))} style={{ position: 'absolute', top: '24px', right: 'var(--padding-x)', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '14px', color: 'var(--color-g80)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
        <ArrowLeft size={16} /> 返回列表
      </button>
      {/* Editorial Split Header */}
      <div className="grid-2">
         <div style={{ width: '100%', height: '100%', minHeight: '400px', backgroundImage: `url(${story.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
         <div style={{ padding: '10vw var(--padding-x)', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'var(--color-g10)' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <p className="tc-body" style={{ color: 'var(--color-g80)', marginBottom: '16px', letterSpacing: '0.1em' }}>{story.category}</p>
              <h1 className="tc-h1" style={{ color: 'var(--color-g100)', marginBottom: '40px', lineHeight: 1.4 }}>
                {story.title}
              </h1>
            </div>
         </div>
      </div>

      {/* Article Content */}
      <div className="container" style={{ padding: '100px var(--padding-x)', maxWidth: '800px', margin: '0 auto' }}>
        
        {story.paragraphs.map((p, idx) => {
          // Put the quote in the middle (e.g. after the first paragraph)
          if (idx === 1 && story.quote) {
            return (
              <React.Fragment key={idx}>
                <blockquote style={{ 
                  borderLeft: '4px solid var(--color-accent-earth)', 
                  paddingLeft: '32px', 
                  margin: '80px 0',
                }}>
                  <p className="tc-h2" style={{ color: 'var(--color-g80)', lineHeight: 1.5, margin: 0 }}>
                    「{story.quote}」
                  </p>
                </blockquote>
                <p className="tc-body" style={{ color: 'var(--color-g80)', marginBottom: '60px', fontSize: '16px' }}>
                  {p}
                </p>
              </React.Fragment>
            );
          }
          return (
            <p key={idx} className="tc-body" style={{ color: 'var(--color-g80)', marginBottom: '60px', fontSize: '16px' }}>
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
          <div style={{ marginTop: '100px', padding: '60px', backgroundColor: 'var(--color-g10)', textAlign: 'center' }}>
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

        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <Link to={`/stories?category=${encodeURIComponent(story.category)}`} className="btn-outline">返回列表</Link>
        </div>
      </div>

      {/* You Might Also Like */}
      {relatedStories.length > 0 && (
        <div style={{ backgroundColor: 'var(--color-g10)', padding: '100px var(--padding-x)' }}>
          <div className="container">
            <h3 className="tc-h2" style={{ color: 'var(--color-g100)', marginBottom: '40px', textAlign: 'center' }}>
              你可能喜歡
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2px', backgroundColor: 'var(--color-g20)' }}>
              {relatedStories.map(related => (
                <Link to={`/stories/${related.id}`} key={related.id} className="story-card">
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
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryDetail;
