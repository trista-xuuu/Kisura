import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import allStories from '../data/stories.json';

const StoryList = () => {
  const [activeTab, setActiveTab] = useState('ALL');
  const location = useLocation();
  const navigate = useNavigate();
  
  const searchParams = new URLSearchParams(location.search);
  const activeTag = searchParams.get('tag');
  const activeCategory = searchParams.get('category');



  useEffect(() => {
    if (activeCategory) {
      setActiveTab(activeCategory);
    } else {
      setActiveTab('ALL');
    }
  }, [activeCategory]);

  const tabs = ['ALL', '職人故事', '眼鏡知識'];

  // When a tag is active, we might want to reset the tab or let it be. 
  // Let's filter by both tab and tag.
  let filteredStories = activeTab === 'ALL' ? allStories : allStories.filter(s => s.category === activeTab);
  
  if (activeTag) {
    filteredStories = filteredStories.filter(s => s.hashtags && s.hashtags.includes(activeTag));
  }

  return (
    <div style={{ backgroundColor: 'var(--color-primary-white)', paddingBottom: '120px' }}>
      <div style={{ padding: '80px var(--padding-x)', textAlign: 'center', backgroundColor: 'var(--color-g10)' }}>
        <h1 className="tc-h1" style={{ color: 'var(--color-g100)', marginBottom: '16px' }}>眼鏡故事</h1>
        <p className="en-h3" style={{ color: 'var(--color-g60)', letterSpacing: '0.1em' }}>EDITORIALS & INSIGHTS</p>
      </div>

      {/* Filter Tabs */}
      <div className="gap-mobile-16" style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '40px 0', borderBottom: '1px solid var(--color-g20)', flexWrap: 'wrap', marginBottom: '60px' }}>
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
          <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: 'var(--color-g10)', padding: '8px 16px', borderRadius: '20px' }}>
            <span className="tc-body" style={{ color: 'var(--color-g80)', marginRight: '12px' }}>目前正在瀏覽標籤：<strong style={{ color: 'var(--color-accent-earth)' }}>{activeTag}</strong></span>
            <button 
              onClick={() => navigate('/stories')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-g60)', fontSize: '14px', padding: '0' }}
            >
              ✕ 清除
            </button>
          </div>
        </div>
      )}

      {/* Story Grid */}
      <div className="container" style={{ padding: '0 var(--padding-x)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2px', backgroundColor: 'var(--color-g20)' }}>
          {filteredStories.map(story => (
            <Link to={`/stories/${story.id}`} key={story.id} style={{ display: 'block', textDecoration: 'none', backgroundColor: '#FFFFFF', padding: '24px' }}>
              <div style={{ height: '220px', backgroundImage: `url(${story.img})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: '24px' }}></div>
              <p className="tc-body" style={{ color: 'var(--color-accent-earth)', marginBottom: '12px', fontSize: '14px', letterSpacing: '0.1em' }}>
                {story.category}
              </p>
              <h4 className="tc-h3" style={{ color: 'var(--color-g100)', marginBottom: '16px' }}>{story.title}</h4>
              <p className="tc-body" style={{ color: 'var(--color-g60)', fontSize: '14px' }}>{story.name}</p>
            </Link>
          ))}
        </div>
      </div>
      
      {filteredStories.length === 0 && (
          <p className="tc-body" style={{ textAlign: 'center', color: 'var(--color-g60)', marginTop: '40px' }}>此分類目前沒有文章。</p>
      )}
    </div>
  );
};

export default StoryList;
