import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import storesData from '../data/stores.json';
import allProducts from '../data/products.json';

const Stores = () => {
  const location = useLocation();
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedModel, setSelectedModel] = useState('ALL');

  const cities = ['ALL', ...new Set(storesData.map(s => s.region))];
  const allModels = allProducts.map(p => ({ id: p.id, name: p.name }));

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const modelParam = params.get('model');
    if (modelParam) {
      setSelectedModel(modelParam);
    }
  }, [location.search]);

  const filteredStores = storesData.filter(store => {
    const cityMatch = selectedCity === 'ALL' || store.region === selectedCity;
    const modelMatch = selectedModel === 'ALL' || store.models.includes(selectedModel);
    return cityMatch && modelMatch;
  });

  // 根據 ID 取得商品名稱來顯示
  const getModelName = (modelId) => {
    const prod = allProducts.find(p => p.id === modelId);
    return prod ? prod.name : modelId;
  };

  return (
    <div style={{ backgroundColor: 'var(--color-primary-white)', minHeight: '100vh', paddingBottom: '120px' }}>
      <div style={{ padding: '100px var(--padding-x)', textAlign: 'center', backgroundColor: 'var(--color-secondary-cream)' }}>
        <h1 className="tc-h1" style={{ color: 'var(--color-g100)', marginBottom: '16px' }}>合作通路</h1>
        <p className="tc-body" style={{ color: 'var(--color-g80)', maxWidth: '600px', margin: '0 auto' }}>
          全台寶島眼鏡皆為 KISURA 官方授權經銷據點，<br/>提供最專業的驗光服務與純鈦鏡框體驗。
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--padding-x)' }}>
        
        {/* Filter Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', padding: '40px 0', borderBottom: '1px solid var(--color-g20)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="tc-body" style={{ color: 'var(--color-g60)' }}>尋找地區：</span>
            <select 
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid var(--color-g40)', fontFamily: 'var(--font-tc-body)', color: 'var(--color-g100)', outline: 'none' }}
            >
              {cities.map(city => (
                <option key={city} value={city}>{city === 'ALL' ? '全台所有地區' : city}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="tc-body" style={{ color: 'var(--color-g60)' }}>指定款式：</span>
            <select 
              value={selectedModel} 
              onChange={(e) => setSelectedModel(e.target.value)}
              style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid var(--color-g40)', fontFamily: 'var(--font-tc-body)', color: 'var(--color-accent-earth)', outline: 'none', fontWeight: 500 }}
            >
              <option value="ALL">不限款式</option>
              {allModels.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div style={{ padding: '24px 0' }}>
          <p className="tc-caption" style={{ color: 'var(--color-g60)' }}>
            共找到 {filteredStores.length} 間符合條件的門市
          </p>
        </div>

        {/* Store Grid */}
        {filteredStores.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
            {filteredStores.map(store => (
              <div key={store.id} style={{ border: '1px solid var(--color-g20)', borderRadius: '8px', padding: '32px', backgroundColor: 'var(--color-g10)' }}>
                <p className="en-caption" style={{ color: 'var(--color-accent-earth)', marginBottom: '8px' }}>{store.region}</p>
                <h3 className="tc-h3" style={{ color: 'var(--color-g100)', marginBottom: '16px' }}>{store.name}</h3>
                
                <ul className="tc-body" style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', color: 'var(--color-g80)' }}>
                  <li style={{ marginBottom: '8px' }}>📍 {store.address}</li>
                  <li style={{ marginBottom: '8px' }}>📞 {store.phone}</li>
                  <li style={{ marginBottom: '8px' }}>🕒 {store.hours}</li>
                </ul>

                <div style={{ marginBottom: '24px' }}>
                  <p className="tc-caption" style={{ color: 'var(--color-g60)', marginBottom: '8px' }}>店內販售款式：</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {store.models.map(modelId => (
                      <Link 
                        to={`/product/${modelId}`}
                        key={modelId} 
                        style={{ 
                          fontSize: '12px', padding: '4px 8px', 
                          backgroundColor: 'var(--color-primary-white)', 
                          border: '1px solid var(--color-g30)', 
                          borderRadius: '4px', color: 'var(--color-g80)',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.backgroundColor = 'var(--color-g100)';
                          e.currentTarget.style.color = 'var(--color-primary-white)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor = 'var(--color-primary-white)';
                          e.currentTarget.style.color = 'var(--color-g80)';
                        }}
                      >
                        {getModelName(modelId)}
                      </Link>
                    ))}
                  </div>
                </div>

                <a href={store.mapLink} target="_blank" rel="noreferrer" className="btn-primary" style={{ width: '100%', padding: '12px', boxSizing: 'border-box' }}>
                  Google 導航
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '80px 0', textAlign: 'center' }}>
            <p className="tc-body" style={{ color: 'var(--color-g60)' }}>抱歉，目前找不到符合您條件的門市，請嘗試放寬搜尋條件。</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Stores;
