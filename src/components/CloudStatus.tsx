import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Database, HardDrive, Clock } from 'lucide-react';

const API_URL = 'https://yasndeco-api.andrey-gaffer.workers.dev/api';

interface HealthStatus {
  isOnline: boolean;
  lastSync: Date | null;
  dbStatus: 'Connected' | 'Error';
  r2Status: 'Connected' | 'Error';
  lastCheck: Date;
}

export const checkHealth = async (): Promise<HealthStatus | null> => {
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    
    return {
      isOnline: data.success !== false,
      lastSync: data.lastSync ? new Date(data.lastSync) : new Date(),
      lastCheck: new Date(),
      dbStatus: data.services?.db === 'ok' ? 'Connected' : 'Error',
      r2Status: data.services?.r2 === 'ok' ? 'Connected' : 'Error'
    };
  } catch (error) {
    return {
      isOnline: false,
      lastSync: new Date(),
      lastCheck: new Date(),
      dbStatus: 'Error',
      r2Status: 'Error'
    };
  }
};

const CloudStatus: React.FC = () => {
  const { t } = useTranslation();
  const [health, setHealth] = useState<HealthStatus>({
    isOnline: true,
    lastSync: new Date(),
    dbStatus: 'Connected',
    r2Status: 'Connected',
    lastCheck: new Date()
  });
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkSystemHealth = useCallback(async () => {
    const result = await checkHealth();
    if (result) {
      setHealth(result);
    }
  }, []);

  useEffect(() => {
    checkSystemHealth();
    
    intervalRef.current = setInterval(() => {
      checkSystemHealth();
    }, 180000);

    const handleFocus = () => {
      checkSystemHealth();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkSystemHealth]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div 
      className="group relative flex items-center gap-2 cursor-help"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex h-2.5 w-2.5">
        {health.isOnline && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
          health.isOnline ? 'bg-green-500' : 'bg-red-500'
        }`}></span>
      </div>
      
      <span className={`text-xs font-medium uppercase tracking-wide ${
        health.isOnline ? 'text-green-500' : 'text-red-500'
      }`}>
        {health.isOnline ? t('admin.cloudStatus.online') : t('admin.cloudStatus.offline')}
      </span>

      <div className={`
        invisible group-hover:visible absolute top-full right-0 mt-2 p-4 
        bg-[#1a1a1a] border border-[#FF6B00]/50 rounded-lg shadow-2xl z-[100] 
        w-64 backdrop-blur-md transition-opacity duration-200
        ${isHovered ? 'opacity-100' : 'opacity-0'}
      `}>
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <span className="text-sm font-bold text-white">Yan's Deco Cloud</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Database className={`w-4 h-4 ${health.dbStatus === 'Connected' ? 'text-green-500' : 'text-red-500'}`} />
            <span className="text-xs text-zinc-300">D1 Database:</span>
            <span className={`text-xs font-medium ${health.dbStatus === 'Connected' ? 'text-green-500' : 'text-red-500'}`}>
              {health.dbStatus}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <HardDrive className={`w-4 h-4 ${health.r2Status === 'Connected' ? 'text-green-500' : 'text-red-500'}`} />
            <span className="text-xs text-zinc-300">R2 Storage:</span>
            <span className={`text-xs font-medium ${health.r2Status === 'Connected' ? 'text-green-500' : 'text-red-500'}`}>
              {health.r2Status}
            </span>
          </div>
          
          <hr className="border-white/10" />
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-zinc-400" />
            <span className="text-xs text-zinc-400">Sync:</span>
            <span className="text-xs font-medium text-white">
              {health.lastSync ? formatTime(health.lastSync) : '—'}
            </span>
          </div>
          
          <div className="text-[10px] text-zinc-500 text-right pt-1">
            Check: {formatTime(health.lastCheck)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudStatus;
