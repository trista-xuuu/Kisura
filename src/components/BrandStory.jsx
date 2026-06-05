import React from 'react';

const BrandStory = () => {
  return (
    <section id="story" className="container" style={{ padding: '160px var(--padding-x)' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
        <h2 className="en-h2" style={{ color: 'var(--color-accent-earth)', marginBottom: '16px' }}>Heart of Titanium</h2>
        <h3 className="en-h3" style={{ color: 'var(--color-g60)', marginBottom: '64px', letterSpacing: '4px' }}>PURE. PRECISE. PERMANENT.</h3>
        
        <p className="tc-body" style={{ color: 'var(--color-g90)', marginBottom: '32px', textAlign: 'left' }}>
          1996 年，當台灣充斥著厚重的合金鏡框時，KISURA 便投入了當時工藝門檻極高的「純鈦」領域。三十年來，我們沒有喧嘩的廣告，卻成為許多眼鏡行與驗光師的推薦首選。
        </p>
        <p className="tc-body" style={{ color: 'var(--color-g90)', marginBottom: '32px', textAlign: 'left' }}>
          在事業裡衝刺的你，每天睜開眼，就是超過 10 小時的無聲戰役。當你專注眼前的同時，也應該讓你的臉部壓力獲得解放。
        </p>
        <p className="tc-body" style={{ color: 'var(--color-g90)', textAlign: 'left' }}>
          KISURA 專注於極輕、抗敏的純鈦工藝。我們不盲目追求快時尚，而是依據當代工作者的生活型態進行框型微調與迭代。我們看重的是實打實的規格與舒適，省去昂貴的行銷包裝，將所有資源砸在與德日同級的精準製程上。
        </p>
      </div>
    </section>
  );
};

export default BrandStory;
