import React from 'react';

const BrandStory = () => {
  return (
    <div style={{ backgroundColor: 'var(--color-primary-white)', paddingBottom: 'var(--spacing-section-y)' }}>
      
      {/* Full Width Hero */}
      <div style={{ width: '100%', height: 'calc(100dvh - 70px)', backgroundImage: 'url(/brand_story/brand_1.png)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.15)' }}></div>
        <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#FFFFFF', textAlign: 'center' }}>
           <p className="en-caption fade-in-up" style={{ color: '#FFFFFF', marginBottom: '16px', letterSpacing: '0.2em' }}>BRAND STORY</p>
           <h1 className="tc-h1 fade-in-up" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>心無旁騖，只做自己</h1>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: 'var(--spacing-section-y)', paddingBottom: 'var(--spacing-section-y)', textAlign: 'center' }}>
        <p className="en-caption" style={{ color: 'var(--color-g80)', marginBottom: '16px' }}>OUR PHILOSOPHY</p>
        <h2 className="tc-h2" style={{ color: 'var(--color-g100)', marginBottom: '20px', lineHeight: '1.6' }}>
          成為每一位堅持的人，最信任的選擇
        </h2>
        <p className="tc-body" style={{ color: 'var(--color-g80)', fontSize: '16px', lineHeight: '2' }}>
          1996 年，當台灣充斥著厚重的合金鏡框時，KISURA 便投入了當時工藝門檻極高的「純鈦」領域。三十年來，我們沒有喧嘩的廣告，卻成為許多眼鏡行與驗光師的推薦首選。
        </p>
      </div>

      {/* Grid Images */}
      <div className="grid-1-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', backgroundColor: 'var(--color-g20)', marginBottom: 'var(--spacing-section-y)' }}>
         <img src="/brand_story/brand_3.png" className="h-auto-mobile" style={{ width: '100%', height: '60vh', objectFit: 'cover' }} />
         <img src="/brand_story/brand_2.png" className="h-auto-mobile" style={{ width: '100%', height: '60vh', objectFit: 'cover' }} />
      </div>

      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
         <h2 className="tc-h2" style={{ color: 'var(--color-g100)', marginBottom: '20px' }}>堅持的信念，給予堅持的人，完成堅持的事</h2>
         <p className="tc-body" style={{ color: 'var(--color-g80)', fontSize: '16px', lineHeight: '2' }}>
           KISURA 專注於極輕、抗敏的純鈦工藝。我們不盲目追求快時尚，而是依據當代工作者的生活型態進行框型微調與迭代。
           <br /><br />
           我們看重的是實打實的規格與舒適。省去昂貴的行銷包裝，將所有資源砸在與德日同級的精準製程上，為的是讓 KISURA 成為專業陪伴角色，支持每位職人走過每個需要堅持的艱辛時刻。
         </p>
      </div>

    </div>
  );
};

export default BrandStory;
