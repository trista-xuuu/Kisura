import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const displayImg = product.colors && product.colors.length > 0 ? product.colors[0].img : '';

  return (
    <div style={{ backgroundColor: 'var(--color-primary-white)', display: 'block' }}>
      <Link to={`/product/${product.id}`} style={{ display: 'block' }}>
        <div style={{ position: 'relative', overflow: 'hidden', paddingTop: '100%', backgroundColor: 'var(--color-primary-white)' }}>
            <img src={displayImg} alt={product.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', padding: '24px', transition: 'transform 1s ease' }} 
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
        </div>
      </Link>
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 className="tc-h5" style={{ color: 'var(--color-g100)', marginBottom: product.colors ? '16px' : '0' }}>{product.name}</h3>
        </Link>
        {product.colors && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            {product.colors.map(color => (
              <div
                key={color.id}
                style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  backgroundColor: color.hex,
                  border: '1px solid var(--color-g40)'
                }}
                aria-label={color.name}
                title={color.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
