import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import allStories from '../data/stories.json';
import { X } from '@phosphor-icons/react';

const StoryList = () => {
  const [activeTab, setActiveTab] = useState('職人故事');
  const location = useLocation();
  const navigate = useNavigate();
  
  const searchParams = new URLSearchParams(location.search);
  const activeTag = searchParams.get('tag');
  const activeCategory = searchParams.get('category');



  useEffect(() => {
    if (activeCategory) {
      setActiveTab(activeCategory);
    } else {
      setActiveTab('職人故事');
    }
  }, [activeCategory]);

  const tabs = ['職人故事', '眼鏡知識'];

  // When a tag is active, we might want to reset the tab or let it be. 
  // Let's filter by both tab and tag.
  let filteredStories = allStories.filter(s => s.category === activeTab);
  
  if (activeTag) {
    filteredStories = filteredStories.filter(s => s.hashtags && s.hashtags.includes(activeTag));
  }

  return (
    <div style={{ backgroundColor: 'var(--color-g10)', paddingBottom: '80px' }}>
      <div style={{ padding: '80px var(--padding-x)', textAlign: 'center', backgroundColor: 'var(--color-g10)' }}>
        <p className="en-caption" style={{ color: 'var(--color-g80)', marginBottom: '16px', letterSpacing: '0.2em' }}>OUR STORIES</p>
        <h1 className="tc-h1" style={{ color: 'var(--color-g100)', marginBottom: '20px' }}>探索故事</h1>
      </div>

      {/* Filter Tabs */}
      <div className="gap-mobile-16 category-bar" style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '24px 0', borderBottom: '1px solid var(--color-g20)', flexWrap: 'wrap', backgroundColor: 'var(--color-primary-white)', marginBottom: '16px' }}>
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
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

      {/* Active Tag Indicator */}
      {activeTag && (
        <div className="container" style={{ padding: '0 var(--padding-x)', marginBottom: '40px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: 'var(--color-g10)', padding: '8px 16px', borderRadius: '8px' }}>
            <span className="tc-body" style={{ color: 'var(--color-g80)', marginRight: '12px' }}>目前正在瀏覽標籤：<strong style={{ color: 'var(--color-accent-earth)' }}>{activeTag}</strong></span>
            <button 
              onClick={() => navigate('/stories')}
              style={{ marginLeft: '16px', fontSize: '14px', color: 'var(--color-g60)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <X size={14} /> 清除
            </button>
          </div>
        </div>
      )}

      {/* Story Grid */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%', padding: '0 var(--padding-x)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '8px' }}>
          {filteredStories.map(story => (
            <Link to={`/stories/${story.id}`} key={story.id} className="story-card">
              <div className="img-container">
                <div className="img-bg" style={{ backgroundImage: `url(${story.img})` }}></div>
              </div>
              <p className="tc-body" style={{ color: 'var(--color-g80)', marginBottom: '12px', fontSize: '14px', letterSpacing: '0.1em' }}>
                {story.category}
              </p>
              <h4 className="tc-h5" style={{ color: 'var(--color-g100)', marginBottom: '16px' }}>{story.title}</h4>
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
                {story.paragraphs && story.paragraphs[0]}
              </p>
            </Link>
          ))}
        </div>
      </div>
      
      {filteredStories.length === 0 && (
          <p className="tc-body" style={{ textAlign: 'center', color: 'var(--color-g80)', marginTop: '40px' }}>此分類目前沒有文章。</p>
      )}
    </div>
  );
};

export default StoryList;
