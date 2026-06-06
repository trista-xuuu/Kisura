import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import storesData from '../data/stores.json';
import allProducts from '../data/products.json';
import { MapPin, X, Phone, Clock } from '@phosphor-icons/react';

const Stores = () => {
  const location = useLocation();
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedModel, setSelectedModel] = useState('ALL');
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [nearbyOnly, setNearbyOnly] = useState(false);

  const cities = ['ALL', ...new Set(storesData.map(s => s.region))];
  const allModels = allProducts.map(p => ({ id: p.id, name: p.name }));

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const modelParam = params.get('model');
    if (modelParam) {
      setSelectedModel(modelParam);
    }
  }, [location.search]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleFindNearby = () => {
    if (nearbyOnly) {
      setNearbyOnly(false);
      setUserLocation(null);
      return;
    }
    
    if (!navigator.geolocation) {
      alert('您的瀏覽器不支援地理位置功能');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setNearbyOnly(true);
        setSelectedCity('ALL'); // 切換到附近時重置縣市
        setIsLocating(false);
      },
      (error) => {
        alert('無法取得位置，請確認已允許定位權限');
        setIsLocating(false);
      }
    );
  };

  const processedStores = storesData.map(store => {
    if (userLocation && store.lat && store.lng) {
      const distance = calculateDistance(userLocation.lat, userLocation.lng, store.lat, store.lng);
      return { ...store, distance };
    }
    return store;
  });

  let filteredStores = processedStores.filter(store => {
    const cityMatch = selectedCity === 'ALL' || store.region === selectedCity;
    const modelMatch = selectedModel === 'ALL' || store.models.includes(selectedModel);
    
    if (nearbyOnly) {
      return store.distance <= 1.5 && modelMatch;
    }
    
    return cityMatch && modelMatch;
  });

  if (nearbyOnly) {
    filteredStores.sort((a, b) => a.distance - b.distance);
  }

  // 根據 ID 取得商品名稱來顯示
  const getModelName = (modelId) => {
    const prod = allProducts.find(p => p.id === modelId);
    return prod ? prod.name : modelId;
  };

  return (
    <div style={{ backgroundColor: 'var(--color-primary-white)', minHeight: '100vh', paddingBottom: '120px' }}>
      <div style={{ padding: '80px var(--padding-x)', textAlign: 'center', backgroundColor: 'var(--color-g10)' }}>
        <p className="en-caption" style={{ color: 'var(--color-g80)', marginBottom: '16px', letterSpacing: '0.2em' }}>WHERE TO BUY</p>
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
              style={{ 
                padding: '8px 32px 8px 16px', 
                border: '1px solid var(--color-g40)', 
                fontFamily: 'var(--font-tc-body)', 
                color: 'var(--color-g100)', 
                outline: 'none',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23333333%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center'
              }}
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
              style={{ 
                padding: '8px 32px 8px 16px', 
                border: '1px solid var(--color-g40)', 
                fontFamily: 'var(--font-tc-body)', 
                color: 'var(--color-g100)', 
                outline: 'none',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23333333%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center'
              }}
            >
              <option value="ALL">不限款式</option>
              {allModels.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
            <button 
              onClick={handleFindNearby}
              disabled={isLocating}
              className={nearbyOnly ? "btn-primary" : "btn-outline"}
              style={{ padding: '8px 16px', fontSize: '14px', opacity: isLocating ? 0.7 : 1, transition: 'all 0.3s ease' }}
            >
              {isLocating ? <><MapPin size={16} /> 定位中...</> : nearbyOnly ? <><X size={16} /> 關閉附近尋找</> : <><MapPin size={16} /> 離我最近的店家 (1.5km)</>}
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div style={{ padding: '24px 0' }}>
          <p className="tc-caption" style={{ color: 'var(--color-g80)' }}>
            共找到 {filteredStores.length} 間符合條件的門市
          </p>
        </div>

        {/* Store Grid */}
        {filteredStores.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
            {filteredStores.map(store => (
              <div key={store.id} style={{ border: '1px solid var(--color-g20)', padding: '32px', backgroundColor: 'var(--color-g10)' }}>
                <p className="en-caption" style={{ color: 'var(--color-g80)', marginBottom: '8px' }}>{store.region}</p>
                <h3 className="tc-h5" style={{ color: 'var(--color-g100)', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {store.name}
                  {store.distance !== undefined && (
                    <span style={{ fontSize: '14px', color: 'var(--color-accent-earth)', fontWeight: 'normal' }}>
                      距離 {store.distance.toFixed(1)} km
                    </span>
                  )}
                </h3>
                
                <ul className="tc-body" style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', color: 'var(--color-g80)' }}>
                  <li style={{ marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}><MapPin size={20} style={{ flexShrink: 0, marginTop: '2px' }} /> <span>{store.address}</span></li>
                  <li style={{ marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}><Phone size={20} style={{ flexShrink: 0, marginTop: '2px' }} /> <span>{store.phone}</span></li>
                  <li style={{ marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}><Clock size={20} style={{ flexShrink: 0, marginTop: '2px' }} /> <span>{store.hours}</span></li>
                </ul>

                <div style={{ marginBottom: '24px' }}>
                  <p className="tc-caption" style={{ color: 'var(--color-g80)', marginBottom: '8px' }}>店內販售款式：</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {store.models.map(modelId => (
                      <Link 
                        to={`/product/${modelId}`}
                        key={modelId} 
                        style={{ 
                          fontSize: '12px', padding: '4px 8px', 
                          backgroundColor: 'var(--color-primary-white)', 
                          border: '1px solid var(--color-g30)', 
                          color: 'var(--color-g80)',
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
            <p className="tc-body" style={{ color: 'var(--color-g80)' }}>抱歉，目前找不到符合您條件的門市，請嘗試放寬搜尋條件。</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Stores;
