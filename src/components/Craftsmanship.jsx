import React from 'react';

const Craftsmanship = () => {
  return (
    <section id="craft" className="container" style={{ padding: '160px var(--padding-x)' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        flexWrap: 'wrap',
        alignItems: 'center', 
        gap: '80px' 
      }}>
        <div style={{ flex: '1 1 400px' }}>
          <h2 className="tc-h2" style={{ color: 'var(--color-g100)', marginBottom: '20px' }}>職人共感，純粹的專注</h2>
          <p className="tc-body" style={{ color: 'var(--color-g80)', marginBottom: '24px' }}>
            在錯落的幾何模型與透視圖紙之間，靜靜構築著空間的秩序。光影沿著筆下的線條遊走，展現出結構與生活美學的精準平衡。
          </p>
          <p className="tc-body" style={{ color: 'var(--color-g80)' }}>
            這份在無聲中承載重量的安穩感，正契合了 KISURA 純鈦工藝的設計語彙：「以極致的輕盈，支撐起最堅定的目光。」我們致敬每一位務實解題的知識型工作者。
          </p>
        </div>
        <div style={{ flex: '1 1 400px', position: 'relative' }}>
          <div style={{ 
            position: 'absolute', 
            top: '-20px', 
            left: '-20px', 
            right: '20px', 
            bottom: '20px', 
            backgroundColor: 'var(--color-secondary-cream)', 
            zIndex: -1 
          }}></div>
          <img src="/context/Gemini_Generated_Image_a66b23a66b23a66b.webp" alt="職人意象" style={{ width: '100%', display: 'block', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }} />
        </div>
      </div>
    </section>
  );
};

export default Craftsmanship;
