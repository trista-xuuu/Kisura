import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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

  // Get 3 related stories from the same category
  const relatedStories = allStories
    .filter(s => s.category === story.category && s.id !== story.id)
    .slice(0, 3);

  return (
    <div style={{ backgroundColor: 'var(--color-primary-white)' }}>
      {/* Editorial Split Header */}
      <div className="grid-2">
         <div style={{ width: '100%', aspectRatio: '3/2', backgroundImage: `url(${story.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
         <div style={{ padding: '10vw var(--padding-x)', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'var(--color-g10)' }}>
            <p className="tc-body" style={{ color: 'var(--color-accent-earth)', marginBottom: '24px', letterSpacing: '0.1em' }}>
              {story.category} / {story.name}
            </p>
            <h1 className="tc-h1" style={{ color: 'var(--color-g100)', marginBottom: '40px', lineHeight: 1.4 }}>
              {story.title}
            </h1>
         </div>
      </div>

      {/* Article Content */}
      <div className="container" style={{ padding: '120px var(--padding-x)', maxWidth: '800px', margin: '0 auto' }}>
        
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
                  <p className="tc-h2" style={{ color: 'var(--color-g100)', lineHeight: 1.5, margin: 0 }}>
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
                  borderRadius: '20px',
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
        {story.category === '職人故事' && recommendedProduct && (
          <div style={{ marginTop: '100px', padding: '60px', backgroundColor: 'var(--color-g10)', borderRadius: '8px', textAlign: 'center' }}>
            <p className="en-caption" style={{ color: 'var(--color-g60)', marginBottom: '24px' }}>RECOMMENDED EYEWEAR</p>
            <h3 className="tc-h2" style={{ color: 'var(--color-g100)', marginBottom: '16px' }}>{recommendedProduct.cat} - {recommendedProduct.name}</h3>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
              <img src={recommendedProduct.colors[0].img} alt={recommendedProduct.name} style={{ width: '100%', maxWidth: '300px', objectFit: 'contain' }} />
            </div>
            <Link to={`/product/${recommendedProduct.id}`} className="btn-primary" style={{ padding: '12px 40px' }}>
              探索此鏡框細節
            </Link>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '80px', paddingBottom: '80px' }}>
          <Link to="/stories" className="btn-outline">返回列表</Link>
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
                <Link to={`/stories/${related.id}`} key={related.id} style={{ display: 'block', backgroundColor: 'var(--color-primary-white)', padding: '24px', textDecoration: 'none' }}>
                  <div style={{ height: '200px', backgroundImage: `url(${related.img})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: '24px' }}></div>
                  <p className="tc-body" style={{ color: 'var(--color-accent-earth)', marginBottom: '12px', fontSize: '14px', letterSpacing: '0.1em' }}>
                    {related.category}
                  </p>
                  <h4 className="tc-h3" style={{ color: 'var(--color-g100)', marginBottom: '16px' }}>{related.title}</h4>
                  <p className="tc-body" style={{ color: 'var(--color-g60)', fontSize: '14px' }}>{related.name}</p>
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
