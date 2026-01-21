import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import AdminHeader from './components/AdminHeader';
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
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import Legal from './pages/Legal';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AddProduct from './pages/AddProduct';
import Categories from './pages/Categories';
import AdminBrands from './pages/AdminBrands';
import BrandDetail from './pages/BrandDetail';
import BrandPublic from './pages/BrandPublic';
import AdminTranslations from './pages/AdminTranslations';
import AdminCalculators from './pages/AdminCalculators';
import AdminSettings from './pages/AdminSettings';
import ProductDetailAdmin from './pages/ProductDetailAdmin';
import EditProduct from './pages/EditProduct';
import AdminServices from './pages/AdminServices';
import AdminContent from './pages/AdminContent';
import CategoryDetail from './pages/CategoryDetail';
import CategoryEdit from './pages/CategoryEdit';
import AddCategory from './pages/AddCategory';
import i18n from './i18n';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import CartDrawer from './components/cart/CartDrawer';
import AuthModal from './components/auth/AuthModal';
import AdminClients from './pages/AdminClients';
import AdminClientDetail from './pages/AdminClientDetail';

type Theme = 'dark' | 'light';

const bgDark = '/assets/bg/bg-dark.png';
const bgLight = '/assets/bg/bg-light.png';

const AnimatedRoutes: React.FC<{ theme: Theme }> = ({ theme }) => {
  const location = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [location.pathname, location.search]);

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="will-change-transform"
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home theme={theme} />} />
          <Route path="/catalogue" element={<Catalogue theme={theme} />} />
          <Route path="/catalogue/:categoryId" element={<Catalogue theme={theme} />} />
          <Route path="/catalogue/:categoryId/:subcategoryId" element={<ProductDetail theme={theme} />} />
          <Route path="/catalogue/:categoryId/:subcategoryId/:productId" element={<ProductPage theme={theme} />} />
          <Route path="/product/:id" element={<ProductPage theme={theme} />} />
          <Route path="/marques" element={<Marques theme={theme} />} />
          <Route path="/marques/:id" element={<BrandPublic theme={theme} />} />
          <Route path="/services" element={<Services theme={theme} />} />
          <Route path="/calculateurs" element={<Calculateurs theme={theme} />} />
          <Route path="/contact" element={<Contact theme={theme} />} />
          <Route path="/legal" element={<Legal theme={theme} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/:id" element={<ProductDetailAdmin />} />
            <Route path="products/:id/edit" element={<EditProduct />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="categories" element={<Categories />} />
            <Route path="categories/:id" element={<CategoryDetail />} />
            <Route path="categories/:id/edit" element={<CategoryEdit />} />
            <Route path="add-category" element={<AddCategory />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="brands/:id" element={<BrandDetail />} />
            <Route path="translations" element={<AdminTranslations />} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="clients/:id" element={<AdminClientDetail />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="calculators" element={<AdminCalculators />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="warehouse" element={<div className="p-8 text-center text-zinc-400">Warehouse Terminal - Страница временно недоступна</div>} />
          </Route>
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/:id" element={<ProductDetailAdmin />} />
          <Route path="/admin/products/:id/edit" element={<EditProduct />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/categories/:id" element={<CategoryDetail />} />
            <Route path="/admin/categories/:id/edit" element={<CategoryEdit />} />
            <Route path="/admin/add-category" element={<AddCategory />} />
            <Route path="/admin/brands" element={<AdminBrands />} />
          <Route path="/admin/brands/:id" element={<BrandDetail />} />
          <Route path="/admin/translations" element={<AdminTranslations />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/calculators" element={<AdminCalculators />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/warehouse" element={<div className="p-8 text-center text-zinc-400">Warehouse Terminal - Страница временно недоступна</div>} />
          <Route path="/v-terminal" element={<div className="p-8 text-center text-zinc-400">Warehouse Terminal - Страница временно недоступна</div>} />
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
  const isAdmin = location.pathname.startsWith('/admin') || location.pathname.startsWith('/v-terminal');

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

  const currentBg = theme === 'dark' ? bgDark : bgLight;

  return (
    <I18nextProvider i18n={i18n}>
      <CartProvider>
        <AuthProvider>
          <div className="relative min-h-screen">
            <div
              className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
              style={{
                backgroundImage: `url(${currentBg})`
              }}
            />
            
            {!isAdmin && <Header theme={theme} onToggleTheme={() => {
              const newTheme = theme === 'dark' ? 'light' : 'dark';
              localStorage.setItem('site-theme', newTheme);
              setTheme(newTheme);
              window.dispatchEvent(new Event('themechange'));
            }} />}
            {isAdmin && <AdminHeader />}
            <ScrollToTop />
            <main className={`relative z-10 ${isAdmin ? 'pt-16 sm:pt-20' : ''}`}>
              <AnimatedRoutes theme={theme} />
            </main>
            {!isAdmin && <Footer theme={theme} />}
            <CartDrawer theme={theme} />
            <AuthModal isOpen={false} onClose={() => {}} theme={theme} />
          </div>
        </AuthProvider>
      </CartProvider>
    </I18nextProvider>
  );
};

export default App;
