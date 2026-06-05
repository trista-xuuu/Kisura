import React from 'react';

const BrandStory = () => {
  return (
    <div style={{ backgroundColor: 'var(--color-primary-white)', paddingBottom: '120px' }}>
      
      {/* Full Width Hero */}
      <div style={{ width: '100%', height: '80vh', backgroundImage: 'url(/context/Gemini_Generated_Image_a66b23a66b23a66b.png)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.15)' }}></div>
        <div style={{ position: 'absolute', bottom: '15%', left: '0', right: '0', textAlign: 'center', color: '#FFFFFF' }}>
           <h1 className="tc-h1 fade-in-up" style={{ fontSize: '48px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>心無旁騖，只做自己。</h1>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '120px', paddingBottom: '120px', textAlign: 'center' }}>
        <p className="en-caption" style={{ color: 'var(--color-accent-earth)', marginBottom: '32px' }}>OUR PHILOSOPHY</p>
        <h2 className="tc-h2" style={{ color: 'var(--color-g100)', marginBottom: '40px', lineHeight: '1.6' }}>
          我們看重的是實打實的規格與舒適，<br/>省去昂貴的行銷包裝，將所有資源砸在與德日同級的精準製程上。
        </h2>
        <p className="tc-body" style={{ color: 'var(--color-g80)', fontSize: '16px', lineHeight: '2' }}>
          KISURA 誕生於台灣。從 1996 年以來，我們在代工廠裡看著世界上無數名貴的鏡框誕生。我們知道好的眼鏡需要什麼：是那 12 克不到的純鈦、是精確到 0.1 毫米的鉸鏈、是能陪伴使用者度過無數個無聲戰役的安穩感。
        </p>
      </div>

      {/* Grid Images */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', backgroundColor: 'var(--color-g20)', marginBottom: '120px' }}>
         <img src="/context/Gemini_Generated_Image_dd4vemdd4vemdd4v.png" style={{ width: '100%', height: '60vh', objectFit: 'cover' }} />
         <img src="/context/Gemini_Generated_Image_qibgumqibgumqibg.png" style={{ width: '100%', height: '60vh', objectFit: 'cover' }} />
      </div>

      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
         <h2 className="tc-h2" style={{ color: 'var(--color-g100)', marginBottom: '32px' }}>純粹的材質，純粹的專注</h2>
         <p className="tc-body" style={{ color: 'var(--color-g80)', fontSize: '16px', lineHeight: '2' }}>
           我們相信，最頂級的工藝，是不會喧嘩的。它只會默默退到幕後，用極致的輕盈，支撐起最堅定的目光。我們將這種哲學實踐在每一副 KISURA 眼鏡上。
         </p>
      </div>

    </div>
  );
};

export default BrandStory;
