import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkle } from '@phosphor-icons/react';

const ProductCard = ({ product, defaultColor, aiReason }) => {
  const displayImg = defaultColor ? defaultColor.img : (product.colors && product.colors.length > 0 ? product.colors[0].img : '');
  const displayName = defaultColor ? `${product.name} (${defaultColor.name})` : product.name;

  return (
    <div style={{ backgroundColor: 'var(--color-primary-white)', display: 'block', borderRadius: '8px', overflow: 'hidden' }}>
      <Link to={`/product/${product.id}`} style={{ display: 'block' }}>
        <div style={{ position: 'relative', overflow: 'hidden', paddingTop: '100%', backgroundColor: 'var(--color-primary-white)' }}>
            <img src={displayImg} alt={displayName} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', padding: '24px', transition: 'transform 1s ease' }} 
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
        </div>
      </Link>
      <div style={{ padding: '24px', textAlign: 'center' }}>
        {aiReason && <p className="en-caption" style={{ color: 'var(--color-g80)', marginBottom: '16px' }}>{product.cat}</p>}
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 className={aiReason ? "tc-h4" : "tc-h5"} style={{ color: 'var(--color-g100)', marginBottom: product.colors ? '16px' : '0' }}>{displayName}</h3>
        </Link>
        {product.colors && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            {product.colors.map(color => (
              <div
                key={color.id}
                style={{
                  width: '20px', height: '20px', borderRadius: '8px',
                  backgroundColor: color.hex,
                  border: '1px solid var(--color-g40)',
                  ...(defaultColor && defaultColor.id === color.id ? { outline: '1px solid var(--color-g80)', outlineOffset: '2px' } : {})
                }}
                aria-label={color.name}
                title={color.name}
              />
            ))}
          </div>
        )}
        {aiReason && (
          <div style={{ marginTop: '24px', padding: '20px 16px', backgroundColor: 'var(--color-g10)', borderLeft: '3px solid var(--color-accent-earth)', borderRadius: '0 8px 8px 0', textAlign: 'left' }}>
            <p className="tc-body" style={{ color: 'var(--color-g80)' }}>
              <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Sparkle size={18} weight="fill" color="var(--color-accent-earth)" /> AI 推薦理由：
              </strong>
              {aiReason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
