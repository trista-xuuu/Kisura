import React from 'react';

const Hero = () => {
  return (
    <section style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: 'var(--color-g10)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'url(/model/Gemini_Generated_Image_3fqmay3fqmay3fqm.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
        opacity: 0.6
      }} />
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(252,247,237,0.8))'
      }} />
      
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }} className="fade-in-up">
        <h1 className="tc-h1" style={{ marginBottom: '24px', color: 'var(--color-g100)' }}>心無旁騖，只做自己。</h1>
        <p className="en-h3" style={{ color: 'var(--color-accent-earth)' }}>NOTHING IN THE WAY.</p>
        <p className="en-h3" style={{ color: 'var(--color-accent-earth)' }}>EVERYTHING IN YOU.</p>
      </div>
    </section>
  );
};

export default Hero;
