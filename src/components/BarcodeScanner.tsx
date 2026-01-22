import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, RefreshCw, Check, AlertCircle, Image as ImageIcon, ScanLine, Maximize2, Minimize2 } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import Tesseract from 'tesseract.js';

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ isOpen, onClose, onScan }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualBarcode, setManualBarcode] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLiveView, setIsLiveView] = useState(false);

  const [zoom, setZoom] = useState(1);
  const [zoomCapabilities, setZoomCapabilities] = useState<{ min: number; max: number; step: number } | null>(null);
  const [isZooming, setIsZooming] = useState(false);
  const zoomTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [barcodeDetectorSupported, setBarcodeDetectorSupported] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const checkBarcodeDetector = async () => {
      if ('BarcodeDetector' in window && window.BarcodeDetector) {
        try {
          // @ts-ignore
          const formats = await window.BarcodeDetector.getSupportedFormats();
          // @ts-ignore
          const supportedEAN = formats.some((f: string) => f.includes('ean') || f.includes('upc'));
          if (supportedEAN) {
            setBarcodeDetectorSupported(true);
          }
        } catch (e) {
          console.warn('BarcodeDetector not available:', e);
        }
      }
    };
    checkBarcodeDetector();
    
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    if (isOpen && isLiveView) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isOpen, isLiveView]);

  const startCamera = async () => {
    try {
      if (streamRef.current) stopCamera();

      const getStream = async (constraints: MediaStreamConstraints) => {
        try {
          return await navigator.mediaDevices.getUserMedia(constraints);
        } catch (e) {
          return null;
        }
      };

      let stream = await getStream({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
          // @ts-ignore
          videoStabilization: true,
        } as any
      });

      if (!stream) {
        stream = await getStream({
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } as any
        });
      }

      if (!stream) {
        stream = await getStream({
          video: { facingMode: 'environment' }
        });
      }

      if (!stream) {
        throw new Error("Camera access denied");
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => console.error("Play failed:", e));
          const track = stream.getVideoTracks()[0];
          const capabilities = (track.getCapabilities ? track.getCapabilities() : {}) as any;
          if (capabilities.zoom) {
            const maxZoom = Math.min(capabilities.zoom.max, 5); // Limit to 5x max
            const minZoom = Math.max(capabilities.zoom.min, 1);
            setZoomCapabilities({ min: minZoom, max: maxZoom, step: capabilities.zoom.step });
            setZoom(1);
          }
        };
      }
    } catch (err: any) {
      let msg = "Не удалось запустить камеру.";
      if (err.name === 'NotAllowedError') msg += " Доступ запрещен.";
      else if (err.name === 'NotFoundError') msg += " Камера не найдена.";
      setError(msg);
    }
  };

  const stopCamera = () => {
    if (zoomTimeoutRef.current) {
      clearTimeout(zoomTimeoutRef.current);
      zoomTimeoutRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const toggleFullscreen = async () => {
    console.log('toggleFullscreen called, ref exists:', !!scannerContainerRef.current);
    console.log('toggleFullscreen called, current state:', !!document.fullscreenElement);
    if (!document.fullscreenElement) {
      console.log('Requesting fullscreen...');
      try {
        await scannerContainerRef.current?.requestFullscreen();
        console.log('Fullscreen request successful');
      } catch (err) {
        console.error('Fullscreen error:', err);
      }
    } else {
      console.log('Exiting fullscreen...');
      await document.exitFullscreen();
    }
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
    if (zoomTimeoutRef.current) clearTimeout(zoomTimeoutRef.current);
    zoomTimeoutRef.current = setTimeout(async () => {
      setIsZooming(true);
      if (streamRef.current) {
        const track = streamRef.current.getVideoTracks()[0];
        try {
          await track.applyConstraints({
            advanced: [{ zoom: newZoom }] as unknown as MediaTrackConstraintSet[]
          });
        } catch (err) { console.warn("Zoom failed:", err); }
      }
      setIsZooming(false);
    }, 150);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
            processImage(file);
          }
        }, 'image/jpeg', 1.0);
      }
    }
  };

  const preprocessImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const cropWidth = img.width * 0.8;
        const cropHeight = img.height * 0.25;
        const cropX = (img.width - cropWidth) / 2;
        const cropY = (img.height - cropHeight) / 2;
        const MAX_WIDTH = 1200;
        const scale = Math.min(MAX_WIDTH / cropWidth, 1);
        canvas.width = cropWidth * scale;
        canvas.height = cropHeight * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas failed'));
        ctx.filter = 'grayscale(100%) brightness(100%) contrast(400%)';
        ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 0.5;
        ctx.drawImage(canvas, 1, 1);
        ctx.globalAlpha = 1.0;
        canvas.toBlob((blob) => {
          if (blob) resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          else reject(new Error('Blob failed'));
        }, 'image/jpeg', 1.0);
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = URL.createObjectURL(file);
    });
  };

  const detectBarcodeNative = async (file: File): Promise<string | null> => {
    if (!('BarcodeDetector' in window) || !window.BarcodeDetector) return null;
    try {
      // @ts-ignore
      const barcodeDetector = new window.BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39'] });
      const bitmap = await createImageBitmap(file);
      const barcodes = await barcodeDetector.detect(bitmap);
      if (barcodes.length > 0) return barcodes[0].rawValue;
    } catch (err) { console.warn('Native detection failed:', err); }
    return null;
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setManualBarcode('');
    setIsSuccess(false);

    try {
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
      const resizedFile = await preprocessImage(file);

      if (barcodeDetectorSupported) {
        const nativeResult = await detectBarcodeNative(resizedFile);
        if (nativeResult) {
          setManualBarcode(nativeResult);
          setIsSuccess(true);
          if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(200);
          setIsProcessing(false);
          return;
        }
      }

      const html5QrCode = new Html5Qrcode("reader-hidden");
      let barcodeFound = false;
      try {
        const decodedText = await html5QrCode.scanFile(resizedFile, false);
        setManualBarcode(decodedText);
        setIsSuccess(true);
        barcodeFound = true;
        if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(200);
      } catch (err) { console.warn('Barcode scan failed'); }
      finally { html5QrCode.clear(); }

      if (!barcodeFound) {
        const result = await Tesseract.recognize(resizedFile, 'eng', {
          logger: m => console.log(m),
          // @ts-ignore
          tessedit_char_whitelist: '0123456789',
          // @ts-ignore
          tessedit_pageseg_mode: '6',
        });

        let cleanDigits = result.data.text.replace(/[^0-9]/g, '');
        if (cleanDigits.length === 15 && cleanDigits[1] === '1' && cleanDigits[8] === '1') {
          cleanDigits = cleanDigits.substring(0, 1) + cleanDigits.substring(2, 8) + cleanDigits.substring(9);
        }
        if (cleanDigits.length > 13) cleanDigits = cleanDigits.replace('001', '00');

        const match = cleanDigits.match(/(87|78|88|3\d|4\d|50)\d{11}/);
        let finalCode = match ? match[0] : (cleanDigits.length > 13 && cleanDigits.startsWith('1') ? cleanDigits.substring(1, 14) : cleanDigits.substring(0, 13));

        if (finalCode.length >= 8) {
          setManualBarcode(finalCode);
          setIsSuccess(true);
          if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(200);
        } else {
          setError(`Пусто. OCR увидел: "${result.data.text.substring(0, 10)}"`);
        }
      }
    } catch (err: any) {
      setError('Ошибка: ' + (err?.message || 'Неизвестная ошибка'));
    } finally {
      setIsProcessing(false);
      if (nativeCameraInputRef.current) nativeCameraInputRef.current.value = '';
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };

  const handleConfirm = () => {
    const code = manualBarcode.trim();
    if (code) {
      onScan(code);
      onClose();
    }
  };

  const resetScanner = () => {
    setCapturedImage(null);
    setError(null);
    setManualBarcode('');
    setIsSuccess(false);
    setIsLiveView(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={scannerContainerRef}
      className="fixed inset-0 z-[9999] bg-black flex flex-col"
      style={{ 
        height: '100dvh',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)'
      }}
    >
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} className="w-full h-full bg-black flex flex-col">
        <div className="flex items-center justify-between p-4 bg-zinc-900/90 z-50 shrink-0 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B00] flex items-center justify-center">
              <ScanLine className="w-5 h-5 text-black" />
            </div>
            <h3 className="text-white font-bold text-base uppercase tracking-wider">Сканер v5.0</h3>
            {barcodeDetectorSupported && (
              <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
                Native API ✓
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { console.log('Fullscreen button clicked'); toggleFullscreen(); }}
              className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full active:bg-white/20 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5 text-zinc-400" /> : <Maximize2 className="w-5 h-5 text-zinc-400" />}
            </button>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full">
              <X className="w-6 h-6 text-zinc-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
          <div id="reader-hidden" className="hidden" style={{ display: 'none' }}></div>
          {isLiveView && (
            <video 
              ref={videoRef} 
              className="absolute inset-0 w-full h-full object-cover"
              style={{ transform: 'translateZ(0)', willChange: 'transform' }}
              playsInline 
              muted 
              autoPlay 
            />
          )}
          
          <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
            <div className="w-[85%] h-[25%] border-2 border-green-500 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] relative">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-green-500 -mt-1 -ml-1"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-green-500 -mt-1 -mr-1"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-green-500 -mb-1 -ml-1"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-green-500 -mb-1 -mr-1"></div>
            </div>
          </div>

          {capturedImage ? (
            <img src={capturedImage} alt="Captured" className={`w-full h-full object-contain ${isProcessing ? 'opacity-40' : 'opacity-100'}`} />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 space-y-4 opacity-50">
              <Camera className="w-16 h-16 text-zinc-600" />
              <p className="text-zinc-500 text-center text-sm max-w-[200px]">Код горизонтально по центру</p>
            </div>
          )}

          <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">
            {isProcessing && (
              <div className="flex flex-col items-center bg-black/80 p-6 rounded-2xl backdrop-blur-md border border-white/10">
                <RefreshCw className="w-12 h-12 text-[#FF6B00] animate-spin mb-3" />
                <span className="text-white font-bold uppercase tracking-widest text-xs">Обработка...</span>
              </div>
            )}
            {!isProcessing && error && (
              <div className="bg-black/90 p-6 rounded-2xl border border-red-500/50 text-center max-w-[80%]">
                <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                <p className="text-white font-bold text-sm mb-4">{error}</p>
                <button onClick={resetScanner} className="w-full py-3 bg-white/10 rounded-xl text-white font-bold text-xs uppercase">Попробовать</button>
              </div>
            )}
            {!isProcessing && isSuccess && (
              <div className="bg-black/90 p-6 rounded-2xl border border-green-500/50 text-center max-w-[80%]">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-black stroke-[3]" />
                </div>
                <p className="text-white font-mono text-2xl font-bold mb-4 break-all">{manualBarcode}</p>
                <button onClick={handleConfirm} className="w-full py-3 bg-[#FF6B00] text-black font-bold rounded-xl uppercase">Готово</button>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 pb-6 bg-zinc-900/90 space-y-4 z-50 shrink-0 border-t border-white/5 backdrop-blur-md" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {!capturedImage && !isLiveView ? (
            <div className="flex flex-col gap-3">
              <button onClick={() => setIsLiveView(true)} className="w-full py-4 bg-[#FF6B00] text-black rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-sm">
                <Camera className="w-6 h-6" />СКАНИРОВАТЬ
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 bg-zinc-800 text-zinc-400 rounded-xl flex items-center justify-center gap-2 font-bold text-xs uppercase">
                <ImageIcon className="w-5 h-5" />Из галереи
              </button>
            </div>
          ) : isLiveView ? (
            <div className="flex flex-col gap-3 w-full">
              {zoomCapabilities && (
                <div className="flex items-center gap-3 px-1">
                  <span className="text-white text-xs font-bold w-8 text-right">{zoom.toFixed(1)}x</span>
                  <input type="range" min={zoomCapabilities.min} max={zoomCapabilities.max} step={0.1} value={zoom} onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 rounded-lg appearance-none cursor-pointer bg-zinc-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#FF6B00] [&::-webkit-slider-thumb]:rounded-full" disabled={isZooming} />
                  {isZooming && <RefreshCw className="w-4 h-4 text-[#FF6B00] animate-spin" />}
                </div>
              )}
              <div className="flex gap-3 items-center">
                <button onClick={() => setIsLiveView(false)} className="w-12 h-12 rounded-full bg-zinc-800 text-white flex items-center justify-center border border-white/10"><X className="w-5 h-5" /></button>
                <button onClick={capturePhoto} className="flex-1 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_0_0_4px_rgba(255,255,255,0.2)]"><div className="w-12 h-12 rounded-full border-2 border-black"></div></button>
                <button onClick={toggleFullscreen} className="w-12 h-12 rounded-full bg-zinc-800 text-white flex items-center justify-center border border-white/10">{isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}</button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <button onClick={resetScanner} className="flex-1 py-3 bg-zinc-800 text-white rounded-xl font-bold text-xs uppercase">Сброс</button>
            </div>
          )}
          <input type="file" ref={nativeCameraInputRef} onChange={handleFileSelect} accept="image/*" capture="environment" className="hidden" />
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
        </div>
      </motion.div>
    </div>
  );
};

export default BarcodeScanner;
