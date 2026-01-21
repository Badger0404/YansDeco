import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Camera, X, Zap } from 'lucide-react';

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ isOpen, onClose, onScan }) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [isVideoReady, setIsVideoReady] = useState(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
    setIsVideoReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    setIsScanning(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        videoRef.current.onloadedmetadata = () => {
          setIsVideoReady(true);
          setIsScanning(true);
        };
        
        videoRef.current.onerror = () => {
          setError('Ошибка видео потока');
          setIsScanning(false);
        };
        
        await videoRef.current.play().then(() => {
          setIsVideoReady(true);
          setIsScanning(true);
        }).catch(() => {
          setError('Не удалось запустить видео');
          setIsScanning(false);
        });
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      
      if (err.name === 'NotAllowedError') {
        setError('Доступ к камере запрещён. Разрешите доступ в настройках браузера.');
      } else if (err.name === 'NotFoundError') {
        setError('Камера не найдена. Подключите камеру и попробуйте снова.');
      } else {
        setError('Не удалось получить доступ к камере: ' + (err.message || 'Unknown error'));
      }
      setIsScanning(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      stopCamera();
      onScan(manualBarcode.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.95)'
      }}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '500px',
          backgroundColor: '#18181b',
          border: '1px solid #3f3f46',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderBottom: '1px solid #3f3f46'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 107, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Camera style={{ width: '20px', height: '20px', color: '#FF6B00' }} />
            </div>
            <div>
              <h3 style={{ color: 'white', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '14px' }}>
                {t('stock.scanTitle')}
              </h3>
              <p style={{ color: '#a1a1aa', fontSize: '12px' }}>
                {t('stock.scanSubtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '8px'
            }}
          >
            <X style={{ width: '20px', height: '20px', color: '#a1a1aa' }} />
          </button>
        </div>

        {/* Video Container */}
        <div 
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            backgroundColor: '#000',
            overflow: 'hidden'
          }}
        >
          {/* Video */}
          <video
            ref={videoRef}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: isVideoReady ? 'block' : 'none'
            }}
            playsInline
            muted
            autoPlay
          />

          {/* Loading indicator */}
          {!isVideoReady && (
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  style={{
                    width: '48px',
                    height: '48px',
                    border: '3px solid #3f3f46',
                    borderTopColor: '#FF6B00',
                    borderRadius: '50%',
                    margin: '0 auto 12px'
                  }}
                />
                <p style={{ color: '#a1a1aa', fontSize: '14px' }}>Загрузка камеры...</p>
              </div>
            </div>
          )}

          {/* Scanning overlay frame */}
          {isVideoReady && (
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '280px',
                height: '160px',
                border: '3px solid #FF6B00',
                borderRadius: '12px',
                boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
                overflow: 'hidden'
              }}
            >
              {/* Corner markers */}
              <div style={{ position: 'absolute', top: '-8px', left: '-8px', width: '24px', height: '24px', borderTop: '4px solid #FF6B00', borderLeft: '4px solid #FF6B00', borderRadius: '4px 0 0 0' }} />
              <div style={{ position: 'absolute', top: '-8px', right: '-8px', width: '24px', height: '24px', borderTop: '4px solid #FF6B00', borderRight: '4px solid #FF6B00', borderRadius: '0 4px 0 0' }} />
              <div style={{ position: 'absolute', bottom: '-8px', left: '-8px', width: '24px', height: '24px', borderBottom: '4px solid #FF6B00', borderLeft: '4px solid #FF6B00', borderRadius: '0 0 0 4px' }} />
              <div style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: '24px', height: '24px', borderBottom: '4px solid #FF6B00', borderRight: '4px solid #FF6B00', borderRadius: '0 0 4px 0' }} />
              
              {/* Animated scan line */}
              <motion.div 
                animate={{ top: ['0%', '95%', '0%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, transparent, #FF6B00, transparent)'
                }}
              />
            </div>
          )}

          {/* Status indicator */}
          {isVideoReady && (
            <div 
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            >
              <span 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  color: 'white'
                }}
              >
                <Zap style={{ width: '12px', height: '12px', color: '#FF6B00' }} />
                {isScanning ? 'Сканирование...' : 'Готов'}
              </span>
            </div>
          )}
        </div>

        {/* Error state */}
        {error && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '32px 16px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '16px' }}>{error}</p>
            <button
              onClick={startCamera}
              style={{
                padding: '12px 24px',
                backgroundColor: '#FF6B00',
                color: 'black',
                fontSize: '14px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Попробовать снова
            </button>
          </div>
        )}

        {/* Manual input */}
        <div style={{ padding: '16px', borderTop: '1px solid #3f3f46' }}>
          <p style={{ color: '#a1a1aa', fontSize: '12px', textAlign: 'center', marginBottom: '12px' }}>
            Или введите штрих-код вручную:
          </p>
          <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              placeholder="Введите штрих-код..."
              style={{
                flex: 1,
                padding: '12px 16px',
                backgroundColor: '#27272a',
                border: '1px solid #3f3f46',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                backgroundColor: '#FF6B00',
                color: 'black',
                fontSize: '14px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Добавить
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #3f3f46' }}>
          <p style={{ color: '#71717a', fontSize: '11px', textAlign: 'center' }}>
            Наведите камеру на штрих-код товара
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default BarcodeScanner;
