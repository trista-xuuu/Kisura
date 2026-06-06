import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as faceapi from '@vladmandic/face-api';
import allProducts from '../data/products.json';
import { Lightbulb, Camera, X, MagnifyingGlass, Sparkle, Palette, Ruler } from '@phosphor-icons/react';

const AIRecommendation = () => {
  const [photo, setPhoto] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  
  // Camera states
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [alignStatus, setAlignStatus] = useState('detecting');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (isCameraOpen && !modelsLoaded) {
      const loadModels = async () => {
        try {
          const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
          await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
          setModelsLoaded(true);
        } catch (err) {
          console.error("Failed to load face-api models", err);
        }
      };
      loadModels();
    }
  }, [isCameraOpen, modelsLoaded]);

  useEffect(() => {
    if (isCameraOpen && modelsLoaded && videoRef.current) {
      const detectLoop = async () => {
        if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) {
          animationRef.current = requestAnimationFrame(detectLoop);
          return;
        }
        try {
          const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions());
          if (detection) {
            const box = detection.box;
            const videoWidth = videoRef.current.videoWidth || 640;
            const videoHeight = videoRef.current.videoHeight || 480;
            const faceArea = (box.width * box.height) / (videoWidth * videoHeight);
            
            const faceCenterX = (box.x + box.width / 2) / videoWidth;
            const faceCenterY = (box.y + box.height / 2) / videoHeight;
            
            // Expected center is ~50% X, ~40% Y (because oval is top 15%, height 50%)
            const isCenteredX = Math.abs(faceCenterX - 0.5) < 0.2;
            const isCenteredY = Math.abs(faceCenterY - 0.4) < 0.2;
            
            if (!isCenteredX || !isCenteredY) {
              setAlignStatus('not_centered');
            } else if (faceArea < 0.05) {
              setAlignStatus('too_far');
            } else if (faceArea > 0.35) {
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
  
  // For manual override testing
  const faceShapes = ['圓臉', '方臉', '鵝蛋臉', '心型臉'];
  const skinTones = ['暖白皮', '冷白皮', '小麥色'];

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target.result);
        startSimulatedScan();
      };
      reader.readAsDataURL(file);
    }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setIsCameraOpen(true);
      // Need a slight timeout to let React render the video element first
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Camera access denied or error:", err);
      alert("無法存取相機，請確認您已允許瀏覽器存取相機權限。");
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      
      closeCamera();
      setPhoto(dataUrl);
      startSimulatedScan();
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startSimulatedScan = () => {
    setIsScanning(true);
    setScanResult(null);
    
    // Simulate API call for MediaPipe
    setTimeout(() => {
      setIsScanning(false);
      // Randomly pick for demo, or you can allow manual override later
      const randomFace = faceShapes[Math.floor(Math.random() * faceShapes.length)];
      const randomSkin = skinTones[Math.floor(Math.random() * skinTones.length)];
      
      setScanResult({
        faceShape: randomFace,
        skinTone: randomSkin
      });
    }, 2500);
  };

  // 推薦邏輯
  const getRecommendations = () => {
    if (!scanResult) return [];

    let recommendations = [];

    allProducts.forEach(product => {
      // 1. 檢查臉型是否符合
      const isFaceMatch = product.suitableFaceShapes.some(s => s === scanResult.faceShape);
      
      if (isFaceMatch) {
        // 2. 在符合臉型的產品中，尋找符合膚色的顏色
        const matchingColors = product.colors.filter(c => c.suitableSkinTones.includes(scanResult.skinTone));
        
        if (matchingColors.length > 0) {
          // 加入推薦清單，以最佳顏色為主圖
          recommendations.push({
            ...product,
            bestColor: matchingColors[0]
          });
        }
      }
    });

    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div style={{ backgroundColor: 'var(--color-primary-white)', minHeight: '100vh', paddingBottom: '120px' }}>
      
      <div style={{ padding: '80px var(--padding-x)', textAlign: 'center', backgroundColor: 'var(--color-g10)' }}>
        <p className="en-caption" style={{ color: 'var(--color-g80)', marginBottom: '16px', letterSpacing: '0.2em' }}>AI RECOMMENDATION</p>
        <h1 className="tc-h1" style={{ color: 'var(--color-g100)', marginBottom: '16px' }}>AI 專屬推薦</h1>
        <p className="tc-body" style={{ color: 'var(--color-g80)', maxWidth: '600px', margin: '0 auto' }}>
          上傳您的正面相片，我們的 AI 將為您分析臉部輪廓與膚色，找出最能完美修飾您臉型與提亮氣色的專屬眼鏡。
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 var(--padding-x)' }}>
        
        {/* Camera Overlay */}
        {isCameraOpen && (
          <div style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999, 
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' 
          }}>
            <h3 className="tc-h2" style={{ color: '#FFF', marginBottom: '16px' }}>即時相片擷取</h3>
            <button onClick={closeCamera} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', zIndex: 20, display: 'flex' }}><X size={32} /></button>
            <p className="tc-body" style={{ color: '#FFF', marginBottom: '32px', display: 'flex', gap: '8px', alignItems: 'flex-start', textAlign: 'left' }}>
              <Lightbulb size={24} style={{ flexShrink: 0, marginTop: '4px' }} weight="fill" color="var(--color-accent-earth)" /> 
              <span>提醒您：請拍攝包含<strong style={{ color: '#FFF' }}>「胸上」</strong>的<strong style={{ color: '#FFF' }}>「清晰正面照」</strong>，<br/>並確保光線充足，以獲得最精準的推薦結果。</span>
            </p>
            
            <div style={{ position: 'relative', width: '90%', maxWidth: '600px', backgroundColor: '#000', overflow: 'hidden' }}>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                style={{ width: '100%', display: 'block', transform: 'scaleX(-1)' }} 
              />
              
              {/* Overlay Guide */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
                {/* 臉部輪廓橢圓與十字線 */}
                <div style={{ 
                  position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', 
                  width: '35%', height: '50%', borderRadius: '50%',
                  border: alignStatus === 'perfect' ? '3px solid #4CAF50' : '2px dashed rgba(255, 255, 255, 0.8)',
                  animation: alignStatus !== 'perfect' && alignStatus !== 'detecting' ? 'flashWarning 1s infinite' : 'none',
                  transition: 'all 0.3s ease'
                }}>
                  {/* 十字線 */}
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', borderLeft: alignStatus === 'perfect' ? '1px solid rgba(76, 175, 80, 0.5)' : '1px dashed rgba(255,255,255,0.4)', transition: 'all 0.3s ease' }}></div>
                  <div style={{ position: 'absolute', top: '45%', left: 0, right: 0, borderTop: alignStatus === 'perfect' ? '1px solid rgba(76, 175, 80, 0.5)' : '1px dashed rgba(255,255,255,0.4)', transition: 'all 0.3s ease' }}></div>
                </div>
                
                {/* 提示文字 */}
                <div style={{ position: 'absolute', top: '58%', left: 0, right: 0, textAlign: 'center' }}>
                  <span style={{ 
                    backgroundColor: alignStatus === 'perfect' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(0,0,0,0.5)', 
                    color: '#FFF', padding: '8px 20px', fontSize: '15px', letterSpacing: '0.05em', fontWeight: 'bold',
                    animation: alignStatus !== 'perfect' && alignStatus !== 'detecting' ? 'flashWarning 1s infinite' : 'none',
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

            <div style={{ display: 'flex', gap: '24px', marginTop: '40px' }}>
              <button className="btn-primary" onClick={capturePhoto} style={{ padding: '12px 32px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}><Camera size={24} /> 拍攝</button>
              <button className="btn-outline" onClick={closeCamera} style={{ padding: '12px 32px', backgroundColor: 'var(--color-primary-white)', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}><X size={20} /> 取消</button>
            </div>
          </div>
        )}

        {/* Upload Area */}
        {!photo && !isCameraOpen && (
          <div style={{ 
            border: '2px dashed var(--color-g40)', padding: '80px 20px', 
            textAlign: 'center', backgroundColor: 'var(--color-g10)' 
          }}>
            <p className="tc-h5" style={{ marginBottom: '16px', color: 'var(--color-g80)' }}>請提供一張清晰的正面照片</p>
            <p className="tc-body" style={{ marginBottom: '32px', color: 'var(--color-g80)', backgroundColor: '#FCF7ED', display: 'inline-block', padding: '8px 24px' }}>
              💡 為了獲得最佳分析效果，請確保照片為<strong>「胸上正面照」</strong>且臉部清晰明亮
            </p>
            
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <label className="btn-primary" style={{ cursor: 'pointer' }}>
                上傳相片
                <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
              </label>
              
              <button className="btn-primary" onClick={openCamera} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={20} /> 即時拍照
              </button>
            </div>
            
            <p className="tc-caption" style={{ marginTop: '24px', color: 'var(--color-g80)' }}>
              我們保證您的隱私，照片僅用於即時運算，不會儲存於伺服器。
            </p>
          </div>
        )}

        {/* Scanning & Result Area */}
        {photo && !isCameraOpen && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            {/* Analysis Result */}
            {isScanning ? (
              <div style={{ padding: '60px 0', textAlign: 'center', backgroundColor: 'var(--color-g10)' }}>
                <h3 className="tc-h5" style={{ color: 'var(--color-g80)', marginBottom: '16px' }}>AI 正在分析中...</h3>
                <ul className="tc-body" style={{ color: 'var(--color-g60)', lineHeight: 2, display: 'inline-block', textAlign: 'left', listStyle: 'none', padding: 0 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MagnifyingGlass size={20} /> 輪廓特徵擷取</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Palette size={20} /> 膚色調性判定</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Ruler size={20} /> 商品資料庫比對</li>
                </ul>
              </div>
            ) : scanResult && (
              <div style={{ padding: '40px', backgroundColor: 'var(--color-g10)' }}>
                <h3 className="tc-h5" style={{ color: 'var(--color-g100)', marginBottom: '32px' }}>分析完成！</h3>
                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="tc-body" style={{ color: 'var(--color-g60)', fontSize: '18px' }}>您的臉部輪廓：</span>
                  <select 
                    className="tc-h5" style={{ padding: '8px 16px', border: '1px solid var(--color-g40)', color: 'var(--color-accent-earth)', backgroundColor: 'transparent' }}
                    value={scanResult.faceShape}
                    onChange={(e) => setScanResult({...scanResult, faceShape: e.target.value})}
                  >
                    {faceShapes.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="tc-body" style={{ color: 'var(--color-g60)', fontSize: '18px' }}>您的膚色調性：</span>
                  <select 
                    className="tc-h5" style={{ padding: '8px 16px', border: '1px solid var(--color-g40)', color: 'var(--color-accent-earth)', backgroundColor: 'transparent' }}
                    value={scanResult.skinTone}
                    onChange={(e) => setScanResult({...scanResult, skinTone: e.target.value})}
                  >
                    {skinTones.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <p className="tc-body" style={{ color: 'var(--color-g80)', marginBottom: '32px', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                  <Lightbulb size={20} weight="fill" color="var(--color-accent-earth)" /> 為了獲得最佳分析效果，請確保照片為<strong>「胸上正面照」</strong>且臉部清晰明亮
                </p>
                
                <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
                  <label className="btn-outline" style={{ display: 'inline-block', cursor: 'pointer', flex: 1, textAlign: 'center', padding: '16px 0' }}>
                    重新上傳
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  </label>
                  <button className="btn-outline" style={{ flex: 1, padding: '16px 0' }} onClick={() => { setPhoto(null); openCamera(); }}>
                    重新拍照
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recommendations */}
      {scanResult && !isScanning && !isCameraOpen && (
        <div style={{ padding: '60px var(--padding-x)', backgroundColor: 'var(--color-g10)' }}>
          <h2 className="tc-h2" style={{ textAlign: 'center', marginBottom: '40px', color: 'var(--color-g100)' }}>
            為您嚴選的完美鏡框
          </h2>
          
          {recommendations.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
              {recommendations.map(prod => (
                <div key={prod.id} style={{ backgroundColor: 'var(--color-primary-white)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                  <Link to={`/product/${prod.id}`} style={{ display: 'block' }}>
                    <div style={{ position: 'relative', paddingTop: '100%', backgroundColor: 'var(--color-primary-white)' }}>
                      <img src={prod.bestColor.img} alt={prod.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', padding: '24px' }} />
                    </div>
                  </Link>
                  <div style={{ padding: '24px' }}>
                    <p className="en-caption" style={{ color: 'var(--color-g80)', marginBottom: '8px' }}>{prod.cat}</p>
                    <Link to={`/product/${prod.id}`} style={{ textDecoration: 'none' }}>
                      <h3 className="tc-h5" style={{ color: 'var(--color-g100)', marginBottom: '16px' }}>{prod.name} ({prod.bestColor.name})</h3>
                    </Link>
                    <div style={{ padding: '16px', backgroundColor: 'var(--color-g10)', borderLeft: '3px solid var(--color-accent-earth)' }}>
                      <p className="tc-caption" style={{ color: 'var(--color-g80)' }}>
                        <strong style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Sparkle size={16} weight="fill" color="var(--color-accent-earth)" /> AI 推薦理由：</strong><br/>
                        {prod.bestColor.pitch}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p className="tc-body" style={{ color: 'var(--color-g80)' }}>抱歉，目前找不到同時符合您特徵的商品。<br/>歡迎嘗試其他風格！</p>
            </div>
          )}
        </div>
      )}

      {/* Global CSS for scanning animation */}
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
};

export default AIRecommendation;
