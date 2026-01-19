import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Cloud,
  CheckCircle,
  LogOut,
  User,
  Bell,
  MessageSquare,
  Mail,
  Globe,
  Database,
  Shield,
  Smartphone,
  Save
} from 'lucide-react';

type SettingsSection = 'notifications' | 'integrations' | 'database' | 'security';

const AdminSettings: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLight, setIsLight] = useState(() => localStorage.getItem('site-theme') === 'light');
  const [activeSection, setActiveSection] = useState<SettingsSection>('notifications');

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
  const cardBgClass = isLight ? 'bg-white/40' : 'bg-zinc-900/40';
  const inputBgClass = isLight ? 'bg-white' : 'bg-black/50';

  const adminNavItems = [
    { id: 'products', label: t('admin.sections.products.title'), icon: <ChevronRight className="w-4 h-4" />, path: '/admin/products' },
    { id: 'categories', label: t('admin.sections.categories.title'), icon: <ChevronRight className="w-4 h-4" />, path: '/admin/categories' },
    { id: 'brands', label: t('admin.sections.brands.title'), icon: <ChevronRight className="w-4 h-4" />, path: '/admin/brands' },
    { id: 'translations', label: t('admin.sections.translations.title'), icon: <ChevronRight className="w-4 h-4" />, path: '/admin/translations' },
    { id: 'calculators', label: t('admin.sections.calculators.title'), icon: <ChevronRight className="w-4 h-4" />, path: '/admin/calculators' },
    { id: 'settings', label: t('admin.sections.settings.title'), icon: <ChevronRight className="w-4 h-4" />, path: '/admin/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const settingsSections: { id: SettingsSection; title: string; description: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'notifications',
      title: t('admin.settings.notifications'),
      description: t('admin.settings.notificationsDesc'),
      icon: <Bell className="w-8 h-8" />,
      color: 'from-green-500/20 to-emerald-600/10'
    },
    {
      id: 'integrations',
      title: t('admin.settings.integrations'),
      description: t('admin.settings.integrationsDesc'),
      icon: <Globe className="w-8 h-8" />,
      color: 'from-blue-500/20 to-indigo-600/10'
    },
    {
      id: 'database',
      title: t('admin.settings.database'),
      description: t('admin.settings.databaseDesc'),
      icon: <Database className="w-8 h-8" />,
      color: 'from-purple-500/20 to-violet-600/10'
    },
    {
      id: 'security',
      title: t('admin.settings.security'),
      description: t('admin.settings.securityDesc'),
      icon: <Shield className="w-8 h-8" />,
      color: 'from-red-500/20 to-rose-600/10'
    }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'notifications':
        return <NotificationsSettings textClass={textClass} mutedClass={mutedClass} borderClass={borderClass} inputBgClass={inputBgClass} />;
      case 'integrations':
        return <IntegrationsSettings textClass={textClass} mutedClass={mutedClass} borderClass={borderClass} inputBgClass={inputBgClass} />;
      case 'database':
        return <DatabaseSettings textClass={textClass} mutedClass={mutedClass} borderClass={borderClass} />;
      case 'security':
        return <SecuritySettings textClass={textClass} mutedClass={mutedClass} borderClass={borderClass} />;
      default:
        return null;
    }
  };

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

          {/* Секции настроек - стиль плиток админки */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {settingsSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveSection(section.id)}
                className={`relative h-40 rounded-xl border cursor-pointer transition-all duration-500 group overflow-hidden ${
                  activeSection === section.id 
                    ? `border-[#FF6B00] shadow-[0_0_20px_rgba(255,107,0,0.3)]` 
                    : `${borderClass} ${hoverBorderClass}`
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="absolute inset-0 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col items-center justify-center h-full p-5 text-center">
                  <div className={`mb-3 transition-all duration-500 ${
                    activeSection === section.id ? 'scale-110' : 'scale-100'
                  } ${activeSection === section.id ? 'text-[#FF6B00]' : 'text-white'}`}>
                    {section.icon}
                  </div>
                  
                  <h3 className={`font-black italic text-xl uppercase tracking-tight mb-2 transition-all duration-300 ${
                    activeSection === section.id ? 'text-white' : 'text-white'
                  }`}>
                    {section.title}
                  </h3>

                  <div className={`absolute bottom-3 left-3 right-3 transition-all duration-500 ${
                    activeSection === section.id 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-3'
                  }`}>
                    <p className={`text-xs text-center bg-black/40 backdrop-blur-sm rounded-lg py-1.5 px-3 text-white`}>
                      {section.description}
                    </p>
                  </div>
                </div>

                <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 ${
                  activeSection === section.id ? 'opacity-100' : ''
                }`}>
                  <div className={`absolute inset-0 rounded-xl border-2 ${
                    activeSection === section.id ? 'border-[#FF6B00]/50' : 'border-white/30'
                  }`} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Контент активной секции */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`p-6 border ${borderClass} rounded-xl ${cardBgClass}`}
            >
              {renderSectionContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

// ============ Notifications Settings ============
const NotificationsSettings: React.FC<{textClass: string; mutedClass: string; borderClass: string; inputBgClass: string}> = ({ textClass, mutedClass, borderClass, inputBgClass }) => {
  const { t } = useTranslation();
  
  const [whatsappConfig, setWhatsappConfig] = useState({
    enabled: false,
    phone: '',
    instanceId: '',
    token: ''
  });
  const [telegramConfig, setTelegramConfig] = useState({
    enabled: false,
    botToken: '',
    chatId: ''
  });
  const [emailConfig, setEmailConfig] = useState({
    enabled: true,
    smtpHost: '',
    smtpPort: '',
    email: '',
    password: ''
  });

  return (
    <div>
      <h2 className={`font-bold italic text-xl uppercase tracking-wide mb-6 ${textClass}`}>
        🔔 {t('admin.settings.orderNotifications')}
      </h2>

      {/* WhatsApp */}
      <div className={`p-5 border ${borderClass} rounded-xl mb-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className={`font-bold uppercase tracking-wide ${textClass}`}>{t('admin.settings.whatsapp')}</h3>
              <p className={`text-xs ${mutedClass}`}>{t('admin.settings.whatsappDesc')}</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={whatsappConfig.enabled}
              onChange={(e) => setWhatsappConfig({...whatsappConfig, enabled: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B00]"></div>
          </label>
        </div>

        {whatsappConfig.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4 mt-4 pt-4 border-t border-dashed border-gray-300 dark:border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>{t('admin.settings.phone')}</label>
                <input
                  type="text"
                  value={whatsappConfig.phone}
                  onChange={(e) => setWhatsappConfig({...whatsappConfig, phone: e.target.value})}
                  className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                  placeholder="+33612345678"
                />
              </div>
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>{t('admin.settings.instanceId')}</label>
                <input
                  type="text"
                  value={whatsappConfig.instanceId}
                  onChange={(e) => setWhatsappConfig({...whatsappConfig, instanceId: e.target.value})}
                  className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                  placeholder="ABC123..."
                />
              </div>
              <div className="md:col-span-2">
                <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>{t('admin.settings.apiToken')}</label>
                <input
                  type="password"
                  value={whatsappConfig.token}
                  onChange={(e) => setWhatsappConfig({...whatsappConfig, token: e.target.value})}
                  className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                  placeholder="Ваш API токен"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Telegram */}
      <div className={`p-5 border ${borderClass} rounded-xl mb-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className={`font-bold uppercase tracking-wide ${textClass}`}>{t('admin.settings.telegram')}</h3>
              <p className={`text-xs ${mutedClass}`}>{t('admin.settings.telegramDesc')}</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={telegramConfig.enabled}
              onChange={(e) => setTelegramConfig({...telegramConfig, enabled: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B00]"></div>
          </label>
        </div>

        {telegramConfig.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4 mt-4 pt-4 border-t border-dashed border-gray-300 dark:border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>{t('admin.settings.botToken')}</label>
                <input
                  type="password"
                  value={telegramConfig.botToken}
                  onChange={(e) => setTelegramConfig({...telegramConfig, botToken: e.target.value})}
                  className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                  placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                />
              </div>
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>{t('admin.settings.chatId')}</label>
                <input
                  type="text"
                  value={telegramConfig.chatId}
                  onChange={(e) => setTelegramConfig({...telegramConfig, chatId: e.target.value})}
                  className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                  placeholder="-100123456789"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Email */}
      <div className={`p-5 border ${borderClass} rounded-xl mb-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Mail className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className={`font-bold uppercase tracking-wide ${textClass}`}>{t('admin.settings.email')}</h3>
              <p className={`text-xs ${mutedClass}`}>{t('admin.settings.emailDesc')}</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={emailConfig.enabled}
              onChange={(e) => setEmailConfig({...emailConfig, enabled: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B00]"></div>
          </label>
        </div>

        {emailConfig.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4 mt-4 pt-4 border-t border-dashed border-gray-300 dark:border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>{t('admin.settings.smtpHost')}</label>
                <input
                  type="text"
                  value={emailConfig.smtpHost}
                  onChange={(e) => setEmailConfig({...emailConfig, smtpHost: e.target.value})}
                  className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>{t('admin.settings.smtpPort')}</label>
                <input
                  type="text"
                  value={emailConfig.smtpPort}
                  onChange={(e) => setEmailConfig({...emailConfig, smtpPort: e.target.value})}
                  className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                  placeholder="587"
                />
              </div>
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>{t('admin.settings.email')}</label>
                <input
                  type="email"
                  value={emailConfig.email}
                  onChange={(e) => setEmailConfig({...emailConfig, email: e.target.value})}
                  className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                  placeholder="info@yansdeco.fr"
                />
              </div>
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>{t('admin.settings.smtpPassword')}</label>
                <input
                  type="password"
                  value={emailConfig.password}
                  onChange={(e) => setEmailConfig({...emailConfig, password: e.target.value})}
                  className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="bg-[#FF6B00] text-black px-8 py-3 rounded-xl font-bold uppercase tracking-wide hover:bg-[#FF8533] transition-colors flex items-center gap-2">
          <Save className="w-4 h-4" />
          {t('admin.settings.saveSettings')}
        </button>
      </div>
    </div>
  );
};

// ============ Integrations Settings ============
const IntegrationsSettings: React.FC<{textClass: string; mutedClass: string; borderClass: string; inputBgClass: string}> = ({ textClass, mutedClass, borderClass, inputBgClass }) => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h2 className={`font-bold italic text-xl uppercase tracking-wide mb-6 ${textClass}`}>
        🌐 {t('admin.settings.integrations')}
      </h2>

      <div className={`p-5 border ${borderClass} rounded-xl mb-6`}>
        <h3 className={`font-bold uppercase tracking-wide mb-4 ${textClass}`}>API Keys</h3>
        <div className="space-y-4">
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>Cloudflare API Token</label>
            <div className="flex gap-2">
              <input
                type="password"
                className={`flex-1 px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                placeholder="Ваш Cloudflare API Token"
              />
              <button className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-bold uppercase hover:border-[#FF6B00] transition-colors">
                {t('admin.products.view')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`p-5 border ${borderClass} rounded-xl mb-6`}>
        <h3 className={`font-bold uppercase tracking-wide mb-4 ${textClass}`}>Web Services</h3>
        <div className="space-y-4">
          {[
            { name: 'Cloudflare Workers', status: 'connected', icon: '☁️' },
            { name: 'Cloudflare D1', status: 'connected', icon: '🗄️' },
            { name: 'Cloudflare R2', status: 'connected', icon: '📦' }
          ].map((service, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-black/5 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{service.icon}</span>
                <span className={`font-bold ${textClass}`}>{service.name}</span>
              </div>
              <span className="flex items-center gap-2 text-green-500 text-sm font-bold uppercase">
                <CheckCircle className="w-4 h-4" />
                {t('admin.settings.connected')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============ Database Settings ============
const DatabaseSettings: React.FC<{textClass: string; mutedClass: string; borderClass: string}> = ({ textClass, mutedClass, borderClass }) => {
  const { t } = useTranslation();
  const [dbStats] = useState({
    tables: 12,
    totalRecords: 1247,
    dbSize: '45.2 MB'
  });

  return (
    <div>
      <h2 className={`font-bold italic text-xl uppercase tracking-wide mb-6 ${textClass}`}>
        💾 {t('admin.settings.database')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`p-5 border ${borderClass} rounded-xl text-center`}>
          <p className={`text-3xl font-black italic ${textClass}`}>{dbStats.tables}</p>
          <p className={`text-xs ${mutedClass} mt-1`}>{t('admin.settings.tables')}</p>
        </div>
        <div className={`p-5 border ${borderClass} rounded-xl text-center`}>
          <p className={`text-3xl font-black italic ${textClass}`}>{dbStats.totalRecords.toLocaleString()}</p>
          <p className={`text-xs ${mutedClass} mt-1`}>{t('admin.settings.records')}</p>
        </div>
        <div className={`p-5 border ${borderClass} rounded-xl text-center`}>
          <p className={`text-3xl font-black italic ${textClass}`}>{dbStats.dbSize}</p>
          <p className={`text-xs ${mutedClass} mt-1`}>{t('admin.settings.dbSize')}</p>
        </div>
      </div>

      <div className={`p-5 border ${borderClass} rounded-xl mb-6`}>
        <h3 className={`font-bold uppercase tracking-wide mb-4 ${textClass}`}>{t('admin.settings.saveSettings')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 border border-gray-300 dark:border-gray-600 rounded-xl text-left hover:border-[#FF6B00] transition-colors">
            <p className={`font-bold ${textClass}`}>{t('admin.settings.exportData')}</p>
            <p className={`text-xs ${mutedClass} mt-1`}>Скачать резервную копию базы данных</p>
          </button>
          <button className="p-4 border border-gray-300 dark:border-gray-600 rounded-xl text-left hover:border-[#FF6B00] transition-colors">
            <p className={`font-bold ${textClass}`}>{t('admin.settings.importData')}</p>
            <p className={`text-xs ${mutedClass} mt-1`}>Восстановить из резервной копии</p>
          </button>
          <button className="p-4 border border-gray-300 dark:border-gray-600 rounded-xl text-left hover:border-[#FF6B00] transition-colors">
            <p className={`font-bold ${textClass}`}>{t('admin.settings.clearCache')}</p>
            <p className={`text-xs ${mutedClass} mt-1`}>Удалить временные данные</p>
          </button>
          <button className="p-4 border border-red-500/50 rounded-xl text-left hover:border-red-500 transition-colors">
            <p className={`font-bold text-red-500`}>{t('admin.settings.resetData')}</p>
            <p className={`text-xs text-red-400 mt-1`}>Удалить все данные (необратимо)</p>
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ Security Settings ============
const SecuritySettings: React.FC<{textClass: string; mutedClass: string; borderClass: string}> = ({ textClass, mutedClass, borderClass }) => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    twoFactor: false,
    sessionTimeout: '24',
    ipWhitelist: ''
  });

  return (
    <div>
      <h2 className={`font-bold italic text-xl uppercase tracking-wide mb-6 ${textClass}`}>
        🛡️ {t('admin.settings.security')}
      </h2>

      <div className={`p-5 border ${borderClass} rounded-xl mb-6`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`font-bold uppercase tracking-wide ${textClass}`}>{t('admin.settings.twoFactor')}</h3>
            <p className={`text-xs ${mutedClass} mt-1`}>Дополнительная защита аккаунта</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={settings.twoFactor}
              onChange={(e) => setSettings({...settings, twoFactor: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B00]"></div>
          </label>
        </div>
      </div>

      <div className={`p-5 border ${borderClass} rounded-xl mb-6`}>
        <h3 className={`font-bold uppercase tracking-wide mb-4 ${textClass}`}>Sessions</h3>
        <div className="mb-4">
          <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>{t('admin.settings.sessionTimeout')}</label>
          <select
            value={settings.sessionTimeout}
            onChange={(e) => setSettings({...settings, sessionTimeout: e.target.value})}
            className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} bg-transparent`}
          >
            <option value="1">1 {t('admin.settings.hour')}</option>
            <option value="6">6 {t('admin.settings.hours')}</option>
            <option value="12">12 {t('admin.settings.hours')}</option>
            <option value="24">24 {t('admin.settings.hours')}</option>
            <option value="168">7 {t('admin.settings.days')}</option>
          </select>
        </div>
      </div>

      <div className={`p-5 border ${borderClass} rounded-xl mb-6`}>
        <h3 className={`font-bold uppercase tracking-wide mb-4 ${textClass}`}>{t('admin.settings.activityLog')}</h3>
        <div className={`p-4 bg-black/5 rounded-lg max-h-48 overflow-y-auto`}>
          <p className={`text-xs ${mutedClass} font-mono`}>
            {`[2024-01-19 10:32:15] Admin login - IP: 192.168.1.1
[2024-01-19 10:32:18] Settings accessed - IP: 192.168.1.1
[2024-01-19 10:35:42] Product updated #123 - IP: 192.168.1.1
[2024-01-19 11:01:33] New order #456 - IP: 192.168.1.45
[2024-01-19 11:15:00] Database backup created - IP: system`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
