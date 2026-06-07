import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import allProducts from '../data/products.json';
import ProductCard from '../components/ProductCard';
import { X, Funnel } from '@phosphor-icons/react';
import { RoundIcon, SquareIcon, BostonIcon } from '../components/ShapeIcons';

const ExploreProducts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedShapes, setSelectedShapes] = useState([]);
  const [isShapeDropdownOpen, setIsShapeDropdownOpen] = useState(false);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isBarHidden, setIsBarHidden] = useState(false);
  const footerSentinelRef = useRef(null);

  const categories = ['ALL', ...new Set(allProducts.map(p => p.cat))];
  const shapes = ['ALL', '圓框', '方框', '波士頓框'];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const genderParam = params.get('gender');
    if (genderParam === 'men' || genderParam === 'women' || genderParam === 'unisex' || genderParam === 'all') {
      setSelectedGender(genderParam);
    } else {
      // Default to all and update URL silently if no valid parameter
      navigate('/explore?gender=all', { replace: true });
    }
  }, [location.search, navigate]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsBarHidden(entry.isIntersecting),
      { root: null, threshold: 0 }
    );
    if (footerSentinelRef.current) observer.observe(footerSentinelRef.current);
    return () => observer.disconnect();
  }, []);

  const filteredProducts = allProducts.filter(p => {
    const genderMatch = selectedGender === 'all' ? true : (p.gender && (Array.isArray(p.gender) ? p.gender.includes(selectedGender) : p.gender === selectedGender));
    const catMatch = selectedCategory === 'ALL' || p.cat === selectedCategory;
    const shapeMatch = selectedShapes.length === 0 || selectedShapes.includes(p.shape);
    return genderMatch && catMatch && shapeMatch;
  });

  const getShapeIcon = (shape, isActive) => {
    const color = isActive ? 'var(--color-g10)' : 'var(--color-g60)';
    const weight = isActive ? 'bold' : 'regular';
    switch (shape) {
      case '圓框': return <RoundIcon size={24} color={color} weight={weight} />;
      case '方框': return <SquareIcon size={24} color={color} weight={weight} />;
      case '波士頓框': return <BostonIcon size={24} color={color} weight={weight} />;
      default: return null;
    }
  };

  const toggleShape = (shape) => {
    if (shape === 'ALL') {
      setSelectedShapes([]);
      setIsShapeDropdownOpen(false);
    } else {
      if (selectedShapes.includes(shape)) {
        setSelectedShapes(selectedShapes.filter(s => s !== shape));
      } else {
        setSelectedShapes([...selectedShapes, shape]);
      }
    }
  };

  const renderFilters = () => (
    <div className="filter-controls" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', flex: '1', minWidth: 0 }}>
      
      {/* Category Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 200px', maxWidth: '300px' }}>
        <span className="tc-body" style={{ color: 'var(--color-g60)', flexShrink: 0 }}>系列：</span>
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ width: '100%', padding: '8px 16px', borderRadius: '4px', border: '1px solid var(--color-g30)', fontFamily: 'var(--font-tc-body)', color: 'var(--color-g100)', outline: 'none', fontSize: '15px', backgroundColor: 'var(--color-primary-white)', cursor: 'pointer', appearance: 'none', background: 'url("data:image/svg+xml;utf8,<svg fill=\'black\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/><path d=\'M0 0h24v24H0z\' fill=\'none\'/></svg>") no-repeat right 8px center', backgroundSize: '20px' }}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat === 'ALL' ? '所有系列' : cat}</option>
          ))}
        </select>
      </div>

      {/* Shape Multi-Select Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 200px', maxWidth: '300px' }}>
        <span className="tc-body" style={{ color: 'var(--color-g60)', flexShrink: 0 }}>框型：</span>
        <div style={{ position: 'relative', width: '100%' }}>
          <div 
            onClick={() => setIsShapeDropdownOpen(!isShapeDropdownOpen)}
            style={{ width: '100%', boxSizing: 'border-box', padding: '8px 16px', borderRadius: '4px', border: '1px solid var(--color-g30)', fontFamily: 'var(--font-tc-body)', color: 'var(--color-g100)', fontSize: '15px', backgroundColor: 'var(--color-primary-white)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {selectedShapes.length === 0 ? '不限款式' : selectedShapes.join(', ')}
            </span>
            <svg fill='var(--color-g100)' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg' style={{ flexShrink: 0 }}><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>
          </div>

          {isShapeDropdownOpen && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, boxSizing: 'border-box', backgroundColor: 'var(--color-primary-white)', border: '1px solid var(--color-g30)', borderRadius: '4px', marginTop: '4px', zIndex: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '8px 0', display: 'flex', flexDirection: 'column' }}>
              {shapes.map(shape => (
                <label key={shape} style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-g10)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <input 
                    type="checkbox" 
                    checked={shape === 'ALL' ? selectedShapes.length === 0 : selectedShapes.includes(shape)} 
                    onChange={() => toggleShape(shape)}
                    style={{ marginRight: '12px', width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0 }}
                  />
                  <span className="tc-body" style={{ color: 'var(--color-g100)' }}>{shape === 'ALL' ? '全部' : shape}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: 'var(--color-primary-white)', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ backgroundColor: 'var(--color-g10)', padding: '80px var(--padding-x)', textAlign: 'center' }}>
        <p className="en-caption" style={{ color: 'var(--color-g80)', marginBottom: '16px', letterSpacing: '0.2em' }}>EXPLORE</p>
        <h1 className="tc-h1" style={{ color: 'var(--color-g100)', marginBottom: '20px' }}>{selectedGender === 'all' ? '探索所有框型' : selectedGender === 'men' ? '探索男士框' : selectedGender === 'women' ? '探索女士框' : '探索中性框'}</h1>
        <p className="tc-body" style={{ color: 'var(--color-g80)', maxWidth: '600px', margin: '0 auto' }}>
          為您精選各系列鏡框，透過進階篩選找到最適合您臉型與風格的完美選擇。
        </p>
      </div>

      {/* Category Switching Tab Bar */}
      <div className="gap-mobile-16 category-bar" style={{ display: 'flex', justifyContent: 'center', gap: '24px', padding: '24px 0', borderBottom: '1px solid var(--color-g20)', flexWrap: 'wrap', backgroundColor: 'var(--color-primary-white)' }}>
          <button 
            onClick={() => navigate('/explore?gender=all')} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', color: selectedGender === 'all' ? 'var(--color-g100)' : 'var(--color-g60)', borderBottom: selectedGender === 'all' ? '2px solid var(--color-g100)' : '2px solid transparent', paddingBottom: '8px', transition: 'all 0.3s ease' }}
          >所有框型</button>
          <button 
            onClick={() => navigate('/explore?gender=men')} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', color: selectedGender === 'men' ? 'var(--color-g100)' : 'var(--color-g60)', borderBottom: selectedGender === 'men' ? '2px solid var(--color-g100)' : '2px solid transparent', paddingBottom: '8px', transition: 'all 0.3s ease' }}
          >男士框</button>
          <button 
            onClick={() => navigate('/explore?gender=women')} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', color: selectedGender === 'women' ? 'var(--color-g100)' : 'var(--color-g60)', borderBottom: selectedGender === 'women' ? '2px solid var(--color-g100)' : '2px solid transparent', paddingBottom: '8px', transition: 'all 0.3s ease' }}
          >女士框</button>
          <button 
            onClick={() => navigate('/explore?gender=unisex')} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', color: selectedGender === 'unisex' ? 'var(--color-g100)' : 'var(--color-g60)', borderBottom: selectedGender === 'unisex' ? '2px solid var(--color-g100)' : '2px solid transparent', paddingBottom: '8px', transition: 'all 0.3s ease' }}
          >中性框</button>
      </div>

      <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%', padding: '0 var(--padding-x)', paddingBottom: '120px' }}>
        
        {/* Desktop Filter Bar */}
        <div className="desktop-only" style={{ padding: '24px 0', display: 'flex', alignItems: 'center' }}>
          {renderFilters()}
        </div>

        {/* Results Info */}
        <div style={{ padding: '24px 0', display: 'flex', justifyContent: 'flex-start' }}>
          <p style={{ color: 'var(--color-g80)', fontSize: '12px', margin: 0, fontFamily: 'var(--font-tc-body)' }}>
            共找到 {filteredProducts.length} 款產品
          </p>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '8px' }}>
            {filteredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div style={{ padding: '80px 0', textAlign: 'center' }}>
            <p className="tc-body" style={{ color: 'var(--color-g80)' }}>抱歉，目前找不到符合您條件的款式，請嘗試放寬篩選條件。</p>
          </div>
        )}

      </div>

      {/* Mobile FAB and Filter Panel */}
      <button className={`mobile-fab-filter ${isBarHidden ? 'hidden' : ''}`} onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}>
        {isMobileFilterOpen ? <X size={24} /> : <Funnel size={24} />}
      </button>

      <div className={`mobile-filter-panel ${isMobileFilterOpen && !isBarHidden ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 500, color: 'var(--color-g100)' }}>快速篩選</h3>
          <button onClick={() => { setSelectedCategory('ALL'); setSelectedShapes([]); }} className="tc-caption" style={{ color: 'var(--color-g60)', textDecoration: 'underline' }}>重設</button>
        </div>
        {renderFilters()}
      </div>

      <div ref={footerSentinelRef} style={{ height: '1px', width: '100%' }} />
    </div>
  );
};

export default ExploreProducts;
