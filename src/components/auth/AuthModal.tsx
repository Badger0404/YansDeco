import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

declare global {
  interface Window {
    google: any;
  }
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, theme }) => {
  const { t } = useTranslation();
  const { login, register, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  const isLight = theme === 'light';
  const textClass = isLight ? 'text-zinc-900' : 'text-white';
  const mutedClass = isLight ? 'text-zinc-600' : 'text-gray-400';
  const bgClass = isLight ? 'bg-white' : 'bg-zinc-900';
  const borderClass = isLight ? 'border-zinc-200' : 'border-zinc-700';
  const inputBgClass = isLight ? 'bg-white' : 'bg-black/50';

  const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

  useEffect(() => {
    if (isOpen && window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });
    }
  }, [isOpen]);

  const handleGoogleResponse = async (response: any) => {
    setLoading(true);
    setError('');
    
    try {
      const payload = JSON.parse(atob(response.credential));
      
      const result = await loginWithGoogle(
        payload.sub,
        payload.name,
        payload.email,
        payload.picture
      );
      
      if (result.success) {
        onClose();
        resetForms();
      } else {
        setError(result.error || 'Google login failed');
      }
    } catch (err) {
      setError('Google login failed');
    }
    
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          setError('Google login is not available. Please try again or use email login.');
        }
      });
    } else {
      setError('Google login is not available');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(loginEmail, loginPassword);
    
    if (result.success) {
      onClose();
      resetForms();
    } else {
      setError(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (registerPassword !== registerConfirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (registerPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    
    const result = await register(registerName, registerPhone, registerEmail, registerPassword);
    
    if (result.success) {
      onClose();
      resetForms();
    } else {
      setError(result.error || 'Registration failed');
    }
    
    setLoading(false);
  };

  const resetForms = () => {
    setLoginEmail('');
    setLoginPassword('');
    setRegisterName('');
    setRegisterPhone('');
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterConfirmPassword('');
    setError('');
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[80] ${bgClass} rounded-2xl shadow-2xl overflow-hidden`}
          >
            <div className={`relative p-6 border-b ${borderClass}`}>
              <button
                onClick={onClose}
                className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
              >
                <X className={`w-5 h-5 ${textClass}`} />
              </button>
              
              <h2 className={`font-black italic text-2xl uppercase tracking-tight ${textClass}`}>
                {mode === 'login' ? t('auth.login') : t('auth.register')}
              </h2>
              <p className={`text-sm ${mutedClass} mt-1`}>
                {mode === 'login' ? t('auth.welcomeBack') : t('auth.createAccount')}
              </p>
            </div>

            <div className="p-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-500 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {mode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                      {t('auth.email')}
                    </label>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${mutedClass}`} />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                      {t('auth.password')}
                    </label>
                    <div className="relative">
                      <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${mutedClass}`} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className={`w-full pl-10 pr-12 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 ${mutedClass} hover:text-[#FF6B00]`}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#FF6B00] text-black py-4 text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-[#FF8533] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        {t('auth.login')}
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                      {t('auth.name')}
                    </label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${mutedClass}`} />
                      <input
                        type="text"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                      {t('auth.phone')}
                    </label>
                    <div className="relative">
                      <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${mutedClass}`} />
                      <input
                        type="tel"
                        value={registerPhone}
                        onChange={(e) => setRegisterPhone(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                      {t('auth.email')}
                    </label>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${mutedClass}`} />
                      <input
                        type="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                      {t('auth.password')}
                    </label>
                    <div className="relative">
                      <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${mutedClass}`} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className={`w-full pl-10 pr-12 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 ${mutedClass} hover:text-[#FF6B00]`}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                      {t('auth.confirmPassword')}
                    </label>
                    <div className="relative">
                      <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${mutedClass}`} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#FF6B00] text-black py-4 text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-[#FF8533] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        {t('auth.register')}
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="mt-6">
                <div className={`flex items-center gap-4 ${mutedClass}`}>
                  <div className="flex-1 h-px bg-current opacity-20" />
                  <span className="text-xs uppercase tracking-wide">{t('auth.or')}</span>
                  <div className="flex-1 h-px bg-current opacity-20" />
                </div>

                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className={`w-full mt-4 py-3 border ${borderClass} rounded-xl text-sm font-bold uppercase tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${textClass} hover:bg-[#FF6B00]/10 hover:border-[#FF6B00]`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {t('auth.google')}
                </button>
              </div>

              <button
                onClick={switchMode}
                className={`w-full mt-6 text-center text-sm ${mutedClass} hover:text-[#FF6B00] transition-colors`}
              >
                {mode === 'login' ? (
                  <>{t('auth.noAccount')} <span className="font-bold text-[#FF6B00]">{t('auth.register')}</span></>
                ) : (
                  <>{t('auth.haveAccount')} <span className="font-bold text-[#FF6B00]">{t('auth.login')}</span></>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
