import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import Marques from './pages/Marques';
import Services from './pages/Services';
import Calculateurs from './pages/Calculateurs';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import ProductPage from './pages/ProductPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import AdminBrands from './pages/AdminBrands';
import AdminTranslations from './pages/AdminTranslations';
import AdminCalculators from './pages/AdminCalculators';
import AdminSettings from './pages/AdminSettings';
import i18n from './i18n';

type Theme = 'dark' | 'light';

const bgDark = '/assets/bg/bg-dark.png';
const bgLight = '/assets/bg/bg-light.png';

const AnimatedRoutes: React.FC<{ theme: Theme }> = ({ theme }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home theme={theme} />} />
          <Route path="/catalogue" element={<Catalogue theme={theme} />} />
          <Route path="/catalogue/:categoryId" element={<Catalogue theme={theme} />} />
          <Route path="/catalogue/:categoryId/:subcategoryId" element={<ProductDetail theme={theme} />} />
          <Route path="/catalogue/:categoryId/:subcategoryId/:productId" element={<ProductPage theme={theme} />} />
          <Route path="/marques" element={<Marques theme={theme} />} />
          <Route path="/services" element={<Services theme={theme} />} />
          <Route path="/calculateurs" element={<Calculateurs theme={theme} />} />
          <Route path="/contact" element={<Contact theme={theme} />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/brands" element={<AdminBrands />} />
          <Route path="/admin/translations" element={<AdminTranslations />} />
          <Route path="/admin/calculators" element={<AdminCalculators />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('site-theme') as Theme) || 'dark';
  });
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    localStorage.setItem('site-theme', theme);
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme((localStorage.getItem('site-theme') as Theme) || 'dark');
    };
    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('site-theme', newTheme);
    setTheme(newTheme);
    console.log('Theme toggled to:', newTheme);
    window.dispatchEvent(new Event('themechange'));
  };

  const currentBg = theme === 'dark' ? bgDark : bgLight;

  return (
    <I18nextProvider i18n={i18n}>
      <div className="relative min-h-screen">
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
          style={{
            backgroundImage: `url(${currentBg})`
          }}
        />
        
        {isAdmin ? (
          <div className="relative z-10">
            <AdminDashboard onToggleTheme={toggleTheme} />
          </div>
        ) : (
          <>
            <Header theme={theme} onToggleTheme={toggleTheme} />
            <ScrollToTop />
            <main className="relative z-10">
              <AnimatedRoutes theme={theme} />
            </main>
            {location.pathname !== '/' && <Footer theme={theme} />}
          </>
        )}
      </div>
    </I18nextProvider>
  );
};

export default App;
