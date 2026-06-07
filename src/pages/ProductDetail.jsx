import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as faceapi from '@vladmandic/face-api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import allProducts from '../data/products.json';
import { X, Camera, Sparkle, Lightbulb, ArrowLeft } from '@phosphor-icons/react';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = allProducts.find(p => p.id === id);
  
  // -- States --
  const [activeView, setActiveView] = useState('front'); // 'front' or 'side'
  const [activeColorId, setActiveColorId] = useState('');
  const [activeSkinTone, setActiveSkinTone] = useState('none');
  
  // Try-On Modal States
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [alignStatus, setAlignStatus] = useState('detecting');
  const [gScale, setGScale] = useState(1);
  const [gX, setGX] = useState(50); // X position %
  const [gY, setGY] = useState(40); // Y position %
  const [gRotation, setGRotation] = useState(0); // Rotation in degrees

  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (product && product.colors && product.colors.length > 0) {
      setActiveColorId(product.colors[0].id);
    }
  }, [product]);

  useEffect(() => {
    if (isCameraOpen && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraOpen, stream]);

  useEffect(() => {
    return () => closeCamera();
  }, []);

  useEffect(() => {
    if (isTryOnOpen && !modelsLoaded) {
      const loadModels = async () => {
        try {
          const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
          await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
          await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL);
          setModelsLoaded(true);
        } catch (err) {
          console.error("Failed to load face-api models", err);
        }
      };
      loadModels();
    }
  }, [isTryOnOpen, modelsLoaded]);

  useEffect(() => {
    if (isCameraOpen && modelsLoaded && videoRef.current) {
      const detectLoop = async () => {
        if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) {
          animationRef.current = requestAnimationFrame(detectLoop);
          return;
        }
        try {
          // Detect face without landmarks for speed
          const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions());
          if (detection) {
            const box = detection.box;
            const videoWidth = videoRef.current.videoWidth || 640;
            const videoHeight = videoRef.current.videoHeight || 480;
            const faceArea = (box.width * box.height) / (videoWidth * videoHeight);
            
            // X is mirrored in the video style, but face-api box uses raw video coords.
            // When mirrored, if X is at 10% from left in raw, it appears at 90% in mirrored view.
            // Center is still center (50%).
            const faceCenterX = (box.x + box.width / 2) / videoWidth;
            const faceCenterY = (box.y + box.height / 2) / videoHeight;
            
            // Expected center is ~50% X, ~40% Y (because oval is top 15%, height 50%)
            const isCenteredX = Math.abs(faceCenterX - 0.5) < 0.2;
            const isCenteredY = Math.abs(faceCenterY - 0.5) < 0.2;
            
            if (!isCenteredX || !isCenteredY) {
              setAlignStatus('not_centered');
            } else if (faceArea < 0.10) {
              setAlignStatus('too_far');
            } else if (faceArea > 0.30) {
              setAlignStatus('too_close');
            } else {
              setAlignStatus('perfect');
            }
          } else {
            setAlignStatus('detecting');
          }
        } catch(e) {}
        
        animationRef.current = requestAnimationFrame(detectLoop);
      };
      detectLoop();
    }
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
  }, [isCameraOpen, modelsLoaded]);

  if (!product) {
    return <div style={{ padding: 'var(--spacing-section-y)', textAlign: 'center' }}>找不到該商品。 <Link to="/products">回到列表</Link></div>;
  }

  const activeColor = product.colors.find(c => c.id === activeColorId) || product.colors[0];

  const images = {
    front: activeColor.img,
    side: '/product/Gemini_Generated_Image_cnm2a9cnm2a9cnm2.png' // Mock side view
  };

  const skinTones = [
    { id: '暖白皮', name: '暖白皮' },
    { id: '冷白皮', name: '冷白皮' },
    { id: '小麥色', name: '小麥色' }
  ];

  // -- Handlers --
  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setIsCameraOpen(true);
      setUserPhoto(null);
    } catch (err) {
      alert('無法存取相機，請確認瀏覽器權限設置。');
    }
  };

  const closeCamera = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      // Mirror the image to make it intuitive
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      
      setUserPhoto(dataUrl);
      closeCamera();

      if (modelsLoaded) {
        setIsDetecting(true);
        const img = new Image();
        img.src = dataUrl;
        img.onload = async () => {
          try {
            const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true);
            setIsDetecting(false);
            if (detection) {
              const leftEye = detection.landmarks.getLeftEye();
              const rightEye = detection.landmarks.getRightEye();
              
              const leftEyeCenter = leftEye.reduce((acc, curr) => ({ x: acc.x + curr.x, y: acc.y + curr.y }), { x: 0, y: 0 });
              leftEyeCenter.x /= leftEye.length;
              leftEyeCenter.y /= leftEye.length;
              const rightEyeCenter = rightEye.reduce((acc, curr) => ({ x: acc.x + curr.x, y: acc.y + curr.y }), { x: 0, y: 0 });
              rightEyeCenter.x /= rightEye.length;
              rightEyeCenter.y /= rightEye.length;

              const eyeDist = Math.sqrt(Math.pow(rightEyeCenter.x - leftEyeCenter.x, 2) + Math.pow(rightEyeCenter.y - leftEyeCenter.y, 2));
              const centerX = (leftEyeCenter.x + rightEyeCenter.x) / 2;
              const centerY = ((leftEyeCenter.y + rightEyeCenter.y) / 2) + (eyeDist * 0.15);

              const xPercent = (centerX / canvas.width) * 100;
              const yPercent = (centerY / canvas.height) * 100;

              // Physical math calculation
              // Average pupillary distance (PD) is ~63mm.
              // So 1mm in real life = (eyeDist / 63) pixels on screen.
              const frameWidthMM = product.frameWidthMM || 140; // Fallback to 140 if missing
              const glassesPixelWidth = frameWidthMM * (eyeDist / 63);
              
              // 計算眼鏡佔整張相片寬度的百分比 (0~1)
              const newScale = glassesPixelWidth / canvas.width;
              
              // Calculate head tilt angle
              // faceapi getLeftEye() returns the eye on the left side of the image
              const dx = rightEyeCenter.x - leftEyeCenter.x;
              const dy = rightEyeCenter.y - leftEyeCenter.y;
              const angle = Math.atan2(dy, dx) * (180 / Math.PI);
              
              setGX(xPercent);
              setGY(yPercent);
              setGScale(newScale);
              setGRotation(angle);
            }
          } catch (e) {
            setIsDetecting(false);
          }
        };
      }
    }
  };

  const generatePolaroidCanvas = () => {
    return new Promise((resolve) => {
      if (!userPhoto || !canvasRef.current) return resolve(null);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      const bgImg = new Image();
      bgImg.src = userPhoto;
      bgImg.onload = () => {
        // IG Story 9:16 Dimensions
        canvas.width = 1080;
        canvas.height = 1920;
        
        // Background - Cream color
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 1. Render photo + glasses to an offscreen canvas first to preserve relative positions
        const offCanvas = document.createElement('canvas');
        offCanvas.width = bgImg.width;
        offCanvas.height = bgImg.height;
        const oCtx = offCanvas.getContext('2d');
        
        oCtx.drawImage(bgImg, 0, 0, bgImg.width, bgImg.height);
        
        const glassesImg = new Image();
        glassesImg.src = activeColor.img; 
        glassesImg.onload = () => {
          const gw = bgImg.width * gScale;
          const gh = (gw / glassesImg.width) * glassesImg.height;
          const gx = (bgImg.width * (gX / 100)) - (gw / 2);
          const gy = (bgImg.height * (gY / 100)) - (gh / 2);
          
          oCtx.save();
          oCtx.translate(gx + gw/2, gy + gh/2);
          oCtx.rotate(gRotation * Math.PI / 180);
          oCtx.drawImage(glassesImg, -gw/2, -gh/2, gw, gh);
          oCtx.restore();
          
          // 2. Crop offscreen canvas to 1:1 and draw on main canvas
          const sSize = Math.min(offCanvas.width, offCanvas.height);
          const sx = (offCanvas.width - sSize) / 2;
          const sy = (offCanvas.height - sSize) / 2;
          
          const dSize = 920;
          const dx = (canvas.width - dSize) / 2; // 80px margin
          const dy = 240; // top margin
          
          ctx.drawImage(offCanvas, sx, sy, sSize, sSize, dx, dy, dSize, dSize);
          
          // Add a subtle border around the image
          ctx.strokeStyle = '#E0DDD8';
          ctx.lineWidth = 2;
          ctx.strokeRect(dx, dy, dSize, dSize);

          // 3. Draw Typography (Aesthetics)
          // Top text
          ctx.font = '300 36px "Ranade", sans-serif';
          ctx.fillStyle = '#8C7D64'; // accent-earth
          ctx.textAlign = 'center';
          ctx.letterSpacing = '8px'; // standard canvas api doesn't support letterSpacing directly in all browsers, but we can simulate or ignore.
          ctx.fillText('V I R T U A L   T R Y - O N', canvas.width / 2, 140);
          
          // Bottom text (Product Info)
          ctx.font = '400 48px "Noto Serif TC", serif';
          ctx.fillStyle = '#343230';
          ctx.textAlign = 'left';
          ctx.fillText(`${product.name}`, dx, dy + dSize + 120);
          
          ctx.font = '300 36px "Noto Sans TC", sans-serif';
          ctx.fillStyle = '#8C8980'; // g70
          ctx.fillText(`${activeColor.name}`, dx, dy + dSize + 180);

          // 4. Draw Logo
          const logoImg = new Image();
          logoImg.src = '/logo/logo_1.svg';
          logoImg.onload = () => {
             // Calculate natural ratio to prevent distortion
             const logoRatio = logoImg.height / logoImg.width;
             const logoWidth = 240;
             const logoHeight = logoWidth * logoRatio;
             
             ctx.drawImage(logoImg, canvas.width - dx - logoWidth, dy + dSize + 110, logoWidth, logoHeight);
             resolve(canvas);
          };
          logoImg.onerror = () => {
             // Fallback text if logo fails
             ctx.font = '300 48px "Ranade", sans-serif';
             ctx.fillStyle = '#343230';
             ctx.textAlign = 'right';
             ctx.fillText('KISURA', canvas.width - dx, dy + dSize + 150);
             resolve(canvas);
          };
        };
      };
    });
  };

  const handleDownload = async () => {
    const canvas = await generatePolaroidCanvas();
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `kisura_${product.name}_tryon.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShareCustom = async () => {
    const canvas = await generatePolaroidCanvas();
    if (!canvas) return;
    
    // Smart routing for share
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile && navigator.share) {
      canvas.toBlob(async (blob) => {
         const file = new File([blob], `kisura_${product.name}_tryon.png`, { type: 'image/png' });
         try {
           await navigator.share({
             title: 'KISURA 線上試戴',
             text: `我正在試戴 KISURA ${product.name}，覺得如何呢？`,
             files: [file]
           });
         } catch (err) {
           console.log('Share canceled or failed', err);
         }
      }, 'image/png');
    } else {
      // Desktop or unsupported fallback -> download & prompt
      alert(`電腦版瀏覽器不支援直接發布到社群。已為您下載試戴美照！快傳送到手機分享吧 ✨`);
      const link = document.createElement('a');
      link.download = `kisura_${product.name}_tryon.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const relatedProducts = allProducts.filter(p => p.cat === product.cat && p.id !== product.id).slice(0, 3);

  const [isBarHidden, setIsBarHidden] = useState(false);
  const footerSentinelRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsBarHidden(entry.isIntersecting),
      { threshold: 0 }
    );
    if (footerSentinelRef.current) observer.observe(footerSentinelRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="product-detail-page" style={{ backgroundColor: 'var(--color-primary-white)', position: 'relative' }}>
      <button onClick={() => navigate('/explore?gender=all')} style={{ position: 'absolute', top: '24px', right: 'var(--padding-x)', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '14px', color: 'var(--color-g80)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
        <ArrowLeft size={16} /> 產品列表
      </button>
      <div className="grid-2" style={{ borderBottom: '1px solid var(--color-g20)' }}>
        
        {/* Left: Product Image */}
        <div style={{ backgroundColor: 'transparent', position: 'relative' }}>
           <div className="h-auto-mobile" style={{ position: 'sticky', top: '80px', padding: '40px', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '100%', paddingBottom: '100%', overflow: 'hidden', backgroundColor: 'transparent' }}>
                <img src={activeColor.img} alt={product.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', padding: '40px' }} />
              </div>
           </div>
        </div>

        {/* Right: Product Info */}
        <div style={{ padding: '8vw var(--padding-x)' }}>
          <p className="tc-body" style={{ color: 'var(--color-g80)', marginBottom: '16px', letterSpacing: '0.1em' }}>{product.category || product.cat}</p>
          <h1 className="tc-h1" style={{ marginBottom: '20px', color: 'var(--color-g100)' }}>{product.name}</h1>
          
          {/* Colors & Skin Tone Matcher */}
          <div style={{ marginBottom: '48px', padding: '24px', backgroundColor: 'var(--color-g10)', borderRadius: '8px' }}>
            <p className="tc-body" style={{ color: 'var(--color-g80)', marginBottom: '16px' }}>顏色：{activeColor.name}</p>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              {product.colors.map(color => (
                <button 
                  key={color.id}
                  onClick={() => setActiveColorId(color.id)}
                  style={{ 
                    width: '32px', height: '32px', borderRadius: '8px', 
                    backgroundColor: color.hex,
                    border: activeColorId === color.id ? '2px solid var(--color-g100)' : '1px solid var(--color-g40)',
                    outline: activeColorId === color.id ? '2px solid var(--color-primary-white)' : 'none',
                    outlineOffset: '-4px'
                  }}
                  title={color.name}
                  aria-label={color.name}
                />
              ))}
            </div>

            {/* Creative Feature: Skin Tone Matcher */}
            <div style={{ borderTop: '1px solid var(--color-g20)', paddingTop: '16px' }}>
              <p className="tc-caption" style={{ color: 'var(--color-g80)', marginBottom: '8px' }}>適合您的膚色嗎？選擇膚色看建議：</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {skinTones.map(tone => (
                  <button 
                    key={tone.id}
                    onClick={() => setActiveSkinTone(tone.id === activeSkinTone ? 'none' : tone.id)}
                    style={{ 
                      padding: '4px 12px', fontSize: '12px',
                      backgroundColor: activeSkinTone === tone.id ? 'var(--color-g100)' : 'transparent',
                      color: activeSkinTone === tone.id ? 'var(--color-primary-white)' : 'var(--color-g80)',
                      border: '1px solid var(--color-g40)', transition: 'all 0.2s', borderRadius: '8px'
                    }}>
                    {tone.name}
                  </button>
                ))}
              </div>
              {activeSkinTone !== 'none' && (
                <p className="tc-caption" style={{ marginTop: '12px', color: 'var(--color-g80)' }}>
                  {activeColor.suitableSkinTones.includes(activeSkinTone) ? <><Sparkle size={16} weight="fill" style={{ marginRight: '4px' }}/>{`非常適合！${activeColor.pitch}`}</> : <><Lightbulb size={16} weight="fill" style={{ marginRight: '4px' }}/>{`雖然這款顏色更推薦給 ${activeColor.suitableSkinTones.join('、')}，但只要您喜歡，依然可以大膽嘗試！`}</>}
                </p>
              )}
            </div>
          </div>

          <p className="tc-body" style={{ color: 'var(--color-g80)', marginBottom: '28px', maxWidth: '500px', lineHeight: '1.8' }}>
            {activeColor.pitch}
          </p>
          
          <div className={`product-mobile-actions ${isBarHidden ? 'hidden' : ''}`} style={{ display: 'flex', gap: '16px', marginBottom: '60px' }}>
            <div className="mobile-title-row" style={{ display: 'none' }}>
              {product.cat} | {product.name}
            </div>
            <div className="action-buttons-row" style={{ display: 'flex', gap: '16px', flex: 1 }}>
              <Link to={`/stores?model=${product.id}`} className="btn-primary" style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>哪裡購買</Link>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => setIsTryOnOpen(true)}>線上試戴</button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--color-g20)', paddingTop: '32px' }}>
              <h3 className="tc-h5" style={{ color: 'var(--color-g100)', marginBottom: '24px' }}>
                商品規格
              </h3>
             <ul style={{ listStyle: 'none', padding: 0, margin: 0 }} className="tc-body">
               <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-g10)', paddingBottom: '12px', marginBottom: '12px', color: 'var(--color-g80)' }}>
                 <span>材質</span><span>純鈦、醋酸纖維</span>
               </li>
               <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-g10)', paddingBottom: '12px', marginBottom: '12px', color: 'var(--color-g80)' }}>
                 <span>適合臉型</span><span>{product.suitableFaceShapes.join('、')}</span>
               </li>
               <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-g10)', paddingBottom: '12px', marginBottom: '12px', color: 'var(--color-g80)' }}>
                 <span>尺寸</span><span>52□18-145</span>
               </li>
             </ul>
          </div>
        </div>
      </div>


      {/* You Might Also Like */}
      {relatedProducts.length > 0 && (
        <div style={{ padding: '80px 0 40px 0', backgroundColor: 'var(--color-g10)' }}>
          <h2 className="tc-h2" style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--color-g100)' }}>您可能也會喜歡</h2>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--padding-x)' }}>
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={8}
              slidesPerView={'auto'}
              centeredSlides={true}
              className="product-swiper"
              breakpoints={{
                768: { slidesPerView: 3, centeredSlides: false }
              }}
              style={{ paddingBottom: '20px' }}
            >
              {relatedProducts.map(prod => (
                <SwiperSlide key={prod.id}>
                  <ProductCard product={prod} />
                </SwiperSlide>
              ))}
            </Swiper>
            <style>{`
              .swiper-button-next, .swiper-button-prev { color: var(--color-g100); }
            `}</style>
          </div>
        </div>
      )}

      {/* 2D Try-On Modal */}
      {isTryOnOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-container">
            
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-g20)', display: 'flex', position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
              <h2 className="tc-h5" style={{ color: 'var(--color-g100)', margin: 0 }}>相片模擬試戴</h2>
              <button onClick={() => { setIsTryOnOpen(false); setUserPhoto(null); }} style={{ position: 'absolute', right: '24px', fontSize: '24px', color: 'var(--color-g80)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><X size={24} /></button>
            </div>

            <div className="flex-col-mobile" style={{ display: 'flex', flex: 1, minHeight: 0, overflowY: userPhoto ? 'auto' : 'hidden', overflowX: 'hidden', position: 'relative' }}>
              
              <div className={`vto-photo-container ${userPhoto ? 'has-photo' : ''}`} style={{ 
                flex: userPhoto ? 2 : 1, 
                width: '100%', 
                position: userPhoto ? 'relative' : 'absolute',
                top: userPhoto ? 'auto' : 0,
                left: userPhoto ? 'auto' : 0,
                right: userPhoto ? 'auto' : 0,
                bottom: userPhoto ? 'auto' : 0,
                backgroundColor: 'var(--color-g10)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' 
              }}>
                {!userPhoto ? (
                  <div style={{ textAlign: 'center' }}>
                    <p className="tc-body" style={{ color: 'var(--color-g80)', marginBottom: '24px' }}>請點擊下方按鈕啟動相機<br/>(我們不會儲存您的相片)</p>
                    <button className="btn-primary" onClick={openCamera} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><Camera size={18} /> 啟動相機</button>
                  </div>
                ) : (
                  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isDetecting && (
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 10 }}>
                        <div style={{ width: '40px', height: '40px', border: '3px solid var(--color-g20)', borderTop: '3px solid var(--color-accent-earth)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
                        <p className="tc-body" style={{ color: 'var(--color-g80)', fontWeight: 'bold' }}>AI 臉部特徵定位中...</p>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                      </div>
                    )}
                    
                    <div style={{ position: 'relative', display: 'block', width: '100%' }}>
                      <img src={userPhoto} alt="User" style={{ width: '100%', height: 'auto', display: 'block' }} />
                      
                      {!isDetecting && (
                        <img 
                          src={activeColor.img} 
                          alt="Glasses Overlay" 
                          style={{ 
                            position: 'absolute', 
                            top: `${gY}%`, left: `${gX}%`, 
                            transform: `translate(-50%, -50%) rotate(${gRotation}deg)`,
                            width: `${gScale * 100}%`, 
                            pointerEvents: 'none',
                            transition: 'all 0.3s ease'
                          }} 
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              {userPhoto && (
                <div className="vto-controls-container" style={{ flex: 1, padding: '32px', borderLeft: '1px solid var(--color-g20)', display: 'flex', flexDirection: 'column', gap: '32px', overflowY: 'auto' }}>
                  {/* Add Color Picker inside Modal */}
                  <div>
                    <p className="tc-body" style={{ margin: 0, fontSize: '16px' }}>試戴顏色：{activeColor.name}</p>
                  </div>

                  <div style={{ borderTop: '1px solid var(--color-g20)', paddingTop: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <p className="tc-body" style={{ marginBottom: '4px', fontSize: '16px' }}>調整上下位置</p>
                      <input type="range" className="custom-slider" min="10" max="90" step="1" value={gY} onChange={(e) => setGY(parseFloat(e.target.value))} style={{ background: `linear-gradient(to right, var(--color-accent-earth) ${((gY - 10) / 80) * 100}%, var(--color-g20) ${((gY - 10) / 80) * 100}%)` }} />
                    </div>
                    <div>
                      <p className="tc-body" style={{ marginBottom: '4px', fontSize: '16px' }}>調整左右位置</p>
                      <input type="range" className="custom-slider" min="10" max="90" step="1" value={gX} onChange={(e) => setGX(parseFloat(e.target.value))} style={{ background: `linear-gradient(to right, var(--color-accent-earth) ${((gX - 10) / 80) * 100}%, var(--color-g20) ${((gX - 10) / 80) * 100}%)` }} />
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                     <button className="btn-outline" onClick={openCamera} style={{ padding: '12px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Camera size={20} /> 重新拍照</button>
                     <button className="btn-primary" onClick={handleShareCustom} style={{ padding: '12px 0', backgroundColor: '#333', border: '1px solid #333' }}>分享至社群</button>
                     <button className="btn-primary" onClick={handleDownload} style={{ padding: '12px 0' }}>📥 儲存相片 (9:16)</button>
                  </div>
                </div>
              )}

            </div>
          </div>
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>
      )}

      {/* Camera Full-Screen Overlay */}
      {isCameraOpen && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'var(--color-g100)', zIndex: 10000, 
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
          overflow: 'auto', padding: '20px 16px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', margin: 'auto 0', maxHeight: '100%' }}>
            <h3 className="tc-h2" style={{ color: 'var(--color-primary-white)', marginBottom: '16px', flexShrink: 0 }}>即時相片擷取</h3>
            <p className="tc-body" style={{ color: 'var(--color-primary-white)', marginBottom: '20px', display: 'flex', gap: '8px', alignItems: 'flex-start', textAlign: 'left', maxWidth: '90%', width: '400px', flexShrink: 0 }}>
              <Lightbulb size={24} style={{ flexShrink: 0, marginTop: '4px' }} weight="fill" color="var(--color-accent-earth)" /> 
              <span>提醒您：請拍攝包含<strong style={{ color: 'var(--color-primary-white)' }}>「胸上」</strong>的<strong style={{ color: 'var(--color-primary-white)' }}>「清晰正面照」</strong>，並確保光線充足，以獲得最精準的推薦結果。</span>
            </p>
            
            <div style={{ position: 'relative', width: '100%', maxWidth: '400px', flex: 1, minHeight: 0, backgroundColor: 'var(--color-g100)', overflow: 'hidden', borderRadius: '8px', flexShrink: 1 }}>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: 'scaleX(-1)' }} 
              />
              
              {/* Overlay Guide */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
                {/* 臉部輪廓橢圓與十字線 */}
                <div style={{ 
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
                  height: '65%', aspectRatio: '1 / 1.35', borderRadius: '50%',
                  border: alignStatus === 'perfect' ? '3px solid #4CAF50' : '2px dashed rgba(255, 255, 255, 0.8)',
                  animation: alignStatus !== 'perfect' && alignStatus !== 'detecting' ? 'flashWarning 1s infinite' : 'none',
                  transition: 'all 0.3s ease'
                }}>
                  {/* 十字線 */}
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', borderLeft: alignStatus === 'perfect' ? '1px solid rgba(76, 175, 80, 0.5)' : '1px dashed rgba(255,255,255,0.4)', transition: 'all 0.3s ease' }}></div>
                  <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: alignStatus === 'perfect' ? '1px solid rgba(76, 175, 80, 0.5)' : '1px dashed rgba(255,255,255,0.4)', transition: 'all 0.3s ease' }}></div>
                </div>
                
                {/* 提示文字 */}
                <div style={{ position: 'absolute', top: '80%', left: 0, right: 0, textAlign: 'center' }}>
                  <span style={{ 
                    backgroundColor: alignStatus === 'perfect' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(52,50,48,0.5)', 
                    color: 'var(--color-primary-white)', padding: '8px 20px', fontSize: '15px', letterSpacing: '0.05em', fontWeight: 'bold',
                    animation: alignStatus !== 'perfect' && alignStatus !== 'detecting' ? 'flashWarning 1s infinite' : 'none',
                    display: 'inline-block',
                    borderRadius: '24px',
                    whiteSpace: 'nowrap'
                  }}>
                    {alignStatus === 'detecting' && '臉部定位中...'}
                    {alignStatus === 'not_centered' && '請將臉部對準虛線框'}
                    {alignStatus === 'too_far' && '請再靠近鏡頭一點'}
                    {alignStatus === 'too_close' && '請稍微遠離鏡頭'}
                    {alignStatus === 'perfect' && '完美！請保持姿勢按下拍攝'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', marginTop: '24px', flexShrink: 0, paddingBottom: '16px' }}>
              <button onClick={capturePhoto} style={{ padding: '16px 40px', backgroundColor: 'var(--color-primary-white)', color: 'var(--color-g100)', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: '300', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.05em', fontFamily: 'var(--font-tc-body)' }}><Camera size={24} /> 拍攝</button>
              <button onClick={closeCamera} style={{ padding: '15px 39px', backgroundColor: 'transparent', color: 'var(--color-primary-white)', border: '1px solid var(--color-primary-white)', borderRadius: '4px', fontSize: '16px', fontWeight: '300', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.05em', fontFamily: 'var(--font-tc-body)' }}><X size={20} /> 取消</button>
            </div>
          </div>
        </div>
      )}

      <div ref={footerSentinelRef} style={{ height: '1px', width: '100%' }}></div>
    </div>
  );
};

export default ProductDetail;
