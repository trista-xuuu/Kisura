import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as faceapi from '@vladmandic/face-api';
import allProducts from '../data/products.json';
import { Lightbulb, Camera, X, MagnifyingGlass, Sparkle, Palette, Ruler } from '@phosphor-icons/react';
import ProductCard from '../components/ProductCard';

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
    if (!modelsLoaded) {
      const loadModels = async () => {
        try {
          const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
          ]);
          setModelsLoaded(true);
        } catch (err) {
          console.error("Failed to load face-api models", err);
        }
      };
      loadModels();
    }
  }, [modelsLoaded]);

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
  
  // For manual override testing
  const faceShapes = ['圓臉', '方臉', '鵝蛋臉', '心型臉'];
  const skinTones = ['暖白皮', '冷白皮', '小麥色'];

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target.result);
        analyzePhoto(e.target.result);
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
      // Mirror the canvas to match the screen
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      
      closeCamera();
      setPhoto(dataUrl);
      analyzePhoto(dataUrl);
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

  const analyzePhoto = async (imageSrc) => {
    setIsScanning(true);
    setScanResult(null);
    
    try {
      const img = new Image();
      img.src = imageSrc;
      await new Promise(r => img.onload = r);
      
      const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
      
      if (!detection) {
        alert("無法偵測到清晰的人臉，請重新上傳或拍攝正面清晰照。");
        setIsScanning(false);
        setPhoto(null);
        return;
      }
      
      const landmarks = detection.landmarks;
      const positions = landmarks.positions;
      
      // Face Shape Analysis
      const jawWidth = faceapi.euclideanDistance([positions[0].x, positions[0].y], [positions[16].x, positions[16].y]);
      const faceHeight = faceapi.euclideanDistance([positions[8].x, positions[8].y], [positions[27].x, positions[27].y]) * 1.35; 
      const lowerJawWidth = faceapi.euclideanDistance([positions[4].x, positions[4].y], [positions[12].x, positions[12].y]);
      const foreheadWidth = faceapi.euclideanDistance([positions[1].x, positions[1].y], [positions[15].x, positions[15].y]);
      
      let detectedShape = '鵝蛋臉';
      if (jawWidth > faceHeight * 0.9) {
        if (lowerJawWidth > jawWidth * 0.85) {
          detectedShape = '方臉';
        } else {
          detectedShape = '圓臉';
        }
      } else {
        if (foreheadWidth > jawWidth * 0.95 && lowerJawWidth < jawWidth * 0.75) {
          detectedShape = '心型臉';
        } else {
          detectedShape = '鵝蛋臉';
        }
      }

      // Skin Tone Analysis
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      
      const samplePoints = [positions[2], positions[3], positions[13], positions[14]];
      let rTotal = 0, gTotal = 0, bTotal = 0, sampleCount = 0;
      const boxSize = 10;
      
      samplePoints.forEach(p => {
        const x = Math.floor(p.x - boxSize/2);
        const y = Math.floor(p.y - boxSize/2);
        if (x >= 0 && y >= 0 && x + boxSize < img.width && y + boxSize < img.height) {
          const imgData = ctx.getImageData(x, y, boxSize, boxSize).data;
          for (let i = 0; i < imgData.length; i += 4) {
            rTotal += imgData[i];
            gTotal += imgData[i+1];
            bTotal += imgData[i+2];
            sampleCount++;
          }
        }
      });
      
      const avgR = rTotal / sampleCount || 255;
      const avgG = gTotal / sampleCount || 255;
      const avgB = bTotal / sampleCount || 255;
      
      let detectedSkin = '暖白皮';
      const brightness = (avgR + avgG + avgB) / 3;
      const r_g_diff = avgR - avgG;
      
      if (brightness < 130) {
        detectedSkin = '小麥色';
      } else if (r_g_diff > 45) {
        detectedSkin = '冷白皮';
      } else {
        detectedSkin = '暖白皮';
      }
      
      // Set a minimum time for the animation UX
      setTimeout(() => {
        setIsScanning(false);
        setScanResult({
          faceShape: detectedShape,
          skinTone: detectedSkin
        });
      }, 1000);
      
    } catch (err) {
      console.error(err);
      alert("分析過程中發生錯誤。");
      setIsScanning(false);
      setPhoto(null);
    }
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
    <div style={{ backgroundColor: 'var(--color-primary-white)' }}>
      
      <div style={{ padding: '80px var(--padding-x)', textAlign: 'center', backgroundColor: 'var(--color-g10)' }}>
        <p className="en-caption" style={{ color: 'var(--color-g80)', marginBottom: '16px', letterSpacing: '0.2em' }}>AI RECOMMENDATION</p>
        <h1 className="tc-h1" style={{ color: 'var(--color-g100)', marginBottom: '20px' }}>AI 專屬推薦</h1>
        <p className="tc-body" style={{ color: 'var(--color-g80)', maxWidth: '600px', margin: '0 auto' }}>
          上傳您的正面相片，我們的 AI 將為您分析臉部輪廓與膚色，找出最能完美修飾您臉型與提亮氣色的專屬眼鏡。
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 var(--padding-x)' }}>
        
        {/* Camera Overlay */}
        {isCameraOpen && (
          <div style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'var(--color-g100)', zIndex: 9999, 
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

        {/* Upload Area */}
        {!photo && !isCameraOpen && (
          <div style={{ 
            border: '2px dashed var(--color-g40)', padding: '80px 20px', borderRadius: '8px',
            textAlign: 'center', backgroundColor: 'var(--color-g10)' 
          }}>
            <p className="tc-h5" style={{ marginBottom: '16px', color: 'var(--color-g80)' }}>請提供一張清晰的正面照片</p>
            <p className="tc-body" style={{ marginBottom: '28px', color: 'var(--color-g80)', backgroundColor: '#FCF7ED', display: 'inline-block', padding: '8px 24px' }}>
              💡 為了獲得最佳分析效果，請確保照片為<strong>「胸上正面照」</strong>且臉部清晰明亮
            </p>
            
            <div className="grid-2" style={{ gap: '16px', maxWidth: '480px', margin: '0 auto' }}>
              <button className="btn-primary" onClick={openCamera} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', height: '56px', padding: '0 16px', boxSizing: 'border-box' }}>
                <Camera size={20} /> 即時拍照
              </button>
              
              <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', height: '56px', padding: '0 16px', margin: 0, boxSizing: 'border-box', cursor: 'pointer' }} onClick={() => document.getElementById('upload1').click()}>
                上傳相片
              </button>
              <input id="upload1" type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
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
              <div style={{ padding: '60px 0', textAlign: 'center', backgroundColor: 'var(--color-g10)', borderRadius: '8px' }}>
                <h3 className="tc-h5" style={{ color: 'var(--color-g80)', marginBottom: '16px' }}>AI 正在分析中...</h3>
                <ul className="tc-body" style={{ color: 'var(--color-g60)', lineHeight: 2, display: 'inline-block', textAlign: 'left', listStyle: 'none', padding: 0 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MagnifyingGlass size={20} /> 輪廓特徵擷取</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Palette size={20} /> 膚色調性判定</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Ruler size={20} /> 商品資料庫比對</li>
                </ul>
              </div>
            ) : scanResult && (
              <div style={{ padding: '32px', backgroundColor: 'var(--color-g10)', borderRadius: '8px' }}>
                <h3 className="tc-h5" style={{ color: 'var(--color-g100)', marginBottom: '32px' }}>分析完成！</h3>
                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="tc-body" style={{ color: 'var(--color-g60)', fontSize: '18px', whiteSpace: 'nowrap' }}>您的臉部輪廓：</span>
                  <select 
                    style={{ flex: 1, minWidth: 0, padding: '8px 16px', borderRadius: '4px', border: '1px solid var(--color-g30)', fontFamily: 'var(--font-tc-body)', color: 'var(--color-g100)', fontSize: '15px', backgroundColor: 'var(--color-primary-white)', cursor: 'pointer', appearance: 'none', background: 'url("data:image/svg+xml;utf8,<svg fill=\'black\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/><path d=\'M0 0h24v24H0z\' fill=\'none\'/></svg>") no-repeat right 8px center', backgroundSize: '20px' }}
                    value={scanResult.faceShape}
                    onChange={(e) => setScanResult({...scanResult, faceShape: e.target.value})}
                  >
                    {faceShapes.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="tc-body" style={{ color: 'var(--color-g60)', fontSize: '18px', whiteSpace: 'nowrap' }}>您的膚色調性：</span>
                  <select 
                    style={{ flex: 1, minWidth: 0, padding: '8px 16px', borderRadius: '4px', border: '1px solid var(--color-g30)', fontFamily: 'var(--font-tc-body)', color: 'var(--color-g100)', fontSize: '15px', backgroundColor: 'var(--color-primary-white)', cursor: 'pointer', appearance: 'none', background: 'url("data:image/svg+xml;utf8,<svg fill=\'black\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/><path d=\'M0 0h24v24H0z\' fill=\'none\'/></svg>") no-repeat right 8px center', backgroundSize: '20px' }}
                    value={scanResult.skinTone}
                    onChange={(e) => setScanResult({...scanResult, skinTone: e.target.value})}
                  >
                    {skinTones.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <p className="tc-body" style={{ color: 'var(--color-g80)', marginBottom: '28px', display: 'flex', gap: '8px', alignItems: 'flex-start', justifyContent: 'center', textAlign: 'left' }}>
                  <Lightbulb size={24} weight="fill" color="var(--color-accent-earth)" style={{ flexShrink: 0, marginTop: '2px' }} /> 
                  <span>為了獲得最佳分析效果，請確保照片為<strong>「胸上正面照」</strong>且臉部清晰明亮</span>
                </p>
                
                <div style={{ marginTop: '32px' }}>
                  <button className="btn-primary" style={{ display: 'block', width: '100%', cursor: 'pointer', margin: 0, whiteSpace: 'nowrap', height: '56px', lineHeight: '56px', padding: '0', boxSizing: 'border-box', textAlign: 'center' }} onClick={() => { setPhoto(null); setScanResult(null); setIsScanning(false); }}>
                    再分析一次
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recommendations */}
      {scanResult && !isScanning && !isCameraOpen && (
        <div style={{ padding: '60px var(--padding-x) 80px', backgroundColor: 'var(--color-g10)' }}>
          <h2 className="tc-h2" style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--color-g100)' }}>
            為您嚴選的完美鏡框
          </h2>
          
          {recommendations.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '8px' }}>
              {recommendations.map(prod => (
                <ProductCard 
                  key={prod.id} 
                  product={prod} 
                  defaultColor={prod.bestColor} 
                  aiReason={prod.bestColor.pitch} 
                />
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
