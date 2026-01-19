import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Cloud,
  Settings,
  CheckCircle,
  Clock,
  LogOut,
  User,
  Bell,
  Globe,
  Database,
  Shield
} from 'lucide-react';

const AdminSettings: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLight, setIsLight] = useState(() => localStorage.getItem('site-theme') === 'light');

  useEffect(() => {
    const handleThemeChange = () => {
      setIsLight(localStorage.getItem('site-theme') === 'light');
    };
    
    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);
  
  const themeToggle = () => {
    const newTheme = isLight ? 'dark' : 'light';
    localStorage.setItem('site-theme', newTheme);
    setIsLight(!isLight);
    window.dispatchEvent(new Event('themechange'));
  };

  const textClass = isLight ? 'text-zinc-900' : 'text-zinc-100';
  const mutedClass = isLight ? 'text-zinc-600' : 'text-zinc-400';
  const borderClass = isLight ? 'border-black' : 'border-[#FF6B00]/20';
  const hoverBorderClass = 'hover:border-[#FF6B00]';

  const adminNavItems = [
    { id: 'products', label: t('admin.sections.products.title'), icon: <ChevronRight className="w-4 h-4" />, path: '/admin/products' },
    { id: 'categories', label: t('admin.sections.categories.title'), icon: <ChevronRight className="w-4 h-4" />, path: '/admin/categories' },
    { id: 'brands', label: t('admin.sections.brands.title'), icon: <ChevronRight className="w-4 h-4" />, path: '/admin/brands' },
    { id: 'translations', label: t('admin.sections.translations.title'), icon: <ChevronRight className="w-4 h-4" />, path: '/admin/translations' },
    { id: 'calculators', label: t('admin.sections.calculators.title'), icon: <ChevronRight className="w-4 h-4" />, path: '/admin/calculators' },
    { id: 'settings', label: t('admin.sections.settings.title'), icon: <ChevronRight className="w-4 h-4" />, path: '/admin/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Настройки будут добавлены здесь
  // ========================================
  
  const settingsSections = [
    {
      id: 'notifications',
      title: 'Уведомления',
      icon: <Bell className="w-6 h-6" />,
      description: 'Настройка WhatsApp, Email и Telegram уведомлений о заказах',
      path: '/admin/settings/notifications',
      status: 'pending'
    },
    {
      id: 'integrations',
      title: 'Интеграции',
      icon: <Globe className="w-6 h-6" />,
      description: 'Подключение внешних сервисов и API',
      path: '/admin/settings/integrations',
      status: 'pending'
    },
    {
      id: 'database',
      title: 'База данных',
      icon: <Database className="w-6 h-6" />,
      description: 'Управление данными и миграции',
      path: '/admin/settings/database',
      status: 'pending'
    },
    {
      id: 'security',
      title: 'Безопасность',
      icon: <Shield className="w-6 h-6" />,
      description: 'Настройки безопасности и доступа',
      path: '/admin/settings/security',
      status: 'pending'
    }
  ];

  // ========================================

  return (
    <div className="min-h-screen">
      <header className={`w-full flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 border-b fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isLight 
          ? 'bg-white/95 backdrop-blur-md border-gray-200' 
          : 'bg-black/95 backdrop-blur-md border-white/10'
      }`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin')}
            className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              isLight ? 'text-gray-500 hover:text-[#FF6B00]' : 'text-zinc-500 hover:text-[#FF6B00]'
            }`}
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            {t('admin.backToDashboard')}
          </button>
          <div className={`h-4 w-px ${isLight ? 'bg-gray-300' : 'bg-white/10'}`} />
          
          <nav className="hidden md:flex items-center gap-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? isLight ? 'bg-[#FF6B00] text-black' : 'bg-[#FF6B00] text-black'
                    : isLight ? 'text-gray-600 hover:bg-gray-100 hover:text-[#FF6B00]' : 'text-zinc-400 hover:bg-white/5 hover:text-[#FF6B00]'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2">
            <Cloud className={`w-3.5 h-3.5 text-green-500`} />
            <span className="text-xs font-medium uppercase tracking-wide text-green-500">
              {t('admin.cloudStatus.online')}
            </span>
          </div>

          <button
            onClick={themeToggle}
            className={`flex items-center justify-center w-9 h-9 transition-all duration-300 ${
              isLight ? 'text-black hover:text-[#FF6B00]' : 'text-zinc-400 hover:text-[#FF6B00]'
            }`}
            title={isLight ? t('admin.theme.dark') : t('admin.theme.light')}
          >
            {isLight ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#FF6B00] flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-black" />
            </div>
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                isLight ? 'text-gray-600 hover:text-[#FF6B00]' : 'text-zinc-400 hover:text-[#FF6B00]'
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('admin.logout')}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className={`font-black italic text-2xl md:text-3xl uppercase tracking-tight ${textClass}`}>
              {t('admin.settings.title')}
            </h1>
            <p className={`text-xs ${mutedClass} mt-1`}>
              {t('admin.sections.settings.description')}
            </p>
          </div>

          {/* Секции настроек */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {settingsSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(section.path)}
                className={`relative p-5 bg-transparent border ${borderClass} ${hoverBorderClass} rounded-xl transition-all duration-500 group cursor-pointer`}
              >
                <div className={`mb-3 ${isLight ? 'text-[#FF6B00]' : 'text-[#FF6B00]'}`}>
                  {section.icon}
                </div>
                <h3 className={`font-bold italic text-lg uppercase tracking-wide mb-1 ${textClass}`}>
                  {section.title}
                </h3>
                <p className={`text-sm ${mutedClass} mb-3`}>{section.description}</p>
                <div className="flex items-center gap-2">
                  {section.status === 'ready' ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-xs text-green-500">Готово</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5 text-yellow-500" />
                      <span className="text-xs text-yellow-500">Скоро</span>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Заглушка для контента */}
          <div className={`mt-12 p-8 border ${borderClass} rounded-xl text-center`}>
            <Settings className={`w-12 h-12 mx-auto mb-4 opacity-30 ${textClass}`} />
            <p className={`text-lg ${mutedClass} mb-2`}>
              Выберите раздел настроек слева
            </p>
            <p className={`text-sm ${mutedClass}`}>
              Здесь будут доступны настройки уведомлений, интеграций и другие параметры системы
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
